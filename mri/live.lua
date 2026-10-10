-- Applies mri_Qbox inventory editor changes live (GlobalState from mri/data.lua); what is built once at start waits for a restart.

local Data = MriInventoryData
local ItemList = require 'modules.items.shared'
local isServer = IsDuplicityVersion()
local Inventory = not isServer and require 'modules.inventory.client'

local function isList(value)
    return type(value) == 'table' and value[1] ~= nil
end

local function same(a, b)
    if type(a) ~= 'table' or type(b) ~= 'table' then return a == b end
    for k, v in pairs(a) do
        if not same(v, b[k]) then return false end
    end
    for k in pairs(b) do
        if a[k] == nil then return false end
    end
    return true
end

-- keeps the table other modules already hold, so lookups see the new values
local function replaceInPlace(target, source)
    for k in pairs(target) do
        if source[k] == nil then target[k] = nil end
    end
    for k, v in pairs(source) do
        local current = target[k]
        if type(v) == 'table' and type(current) == 'table' and not isList(v) and not isList(current) then
            replaceInPlace(current, v)
        else
            target[k] = v
        end
    end
end

local function useExport(resource, export)
    return function(...)
        return exports[resource][export](nil, ...)
    end
end

local function imagePath(path)
    if path then
        return path:match('^[%w]+://') and path or ('%s/%s'):format(client.imagepath, path)
    end
end

-- same rules as newItem in modules/items/shared.lua
local function processItem(data)
    data.weight = data.weight or 0
    if data.close == nil then data.close = true end
    if data.stack == nil then data.stack = true end

    local clientData, serverData = data.client, data.server
    if not data.consume and ((clientData and (clientData.status or clientData.usetime or clientData.export)) or (serverData and serverData.export)) then
        data.consume = 1
    end

    if isServer then
        data.client = nil
        if not data.durability and (data.degrade or (data.consume and data.consume ~= 0 and data.consume < 1)) then
            data.durability = true
        end
        if serverData and serverData.export then
            data.cb = useExport(string.strsplit('.', serverData.export))
        end
    else
        data.server = nil
        if clientData then
            if clientData.export then data.export = useExport(string.strsplit('.', clientData.export)) end
            clientData.image = imagePath(clientData.image)
            if clientData.propTwo then
                clientData.prop = clientData.prop and { clientData.prop, clientData.propTwo } or clientData.propTwo
                clientData.propTwo = nil
            end
        end
    end

    return data
end

-- same rules as the data.weapons loop in modules/items/shared.lua
local function processWeapon(section, name, data)
    data.name = name
    data.close = section == 'Ammo'
    data.weight = data.weight or 0
    if section == 'Weapons' then
        data.model = data.model or name
        data.hash = joaat(data.model)
        data.stack = data.throwable and true or false
        data.durability = data.durability or 0.05
        data.weapon = true
    else
        data.stack = true
    end
    data[section == 'Ammo' and 'ammo' or section == 'Components' and 'component' or section == 'Tints' and 'tint' or 'weapon'] = true

    if isServer then
        data.client = nil
    else
        data.server = nil
        if data.client and data.client.image then data.client.image = imagePath(data.client.image) end
    end

    return data
end

---@param list table[] array catalog after the merge
---@param id string
local function findEntry(list, id)
    local index = id:match('^#(%d+)$')
    if index then return list[tonumber(index)] end
    for i = 1, #list do
        if list[i].name == id then return list[i] end
    end
end

---@type table<string, true> NUI item data to resend
local changedItems = {}

local function setItem(name, data)
    if not isServer then
        local old = ItemList[name]
        data.count = old and old.count or 0
        changedItems[name] = true
    end
    ItemList[name] = data
    if name == 'money' then ItemList.cash = data end
end

local function sendItems()
    if isServer or not next(changedItems) or not client.uiLoaded then
        changedItems = {}
        return
    end

    local payload = {}
    for name in pairs(changedItems) do
        local item = ItemList[name]
        local buttons
        if item.buttons then
            buttons = {}
            for i = 1, #item.buttons do
                buttons[i] = { label = item.buttons[i].label, group = item.buttons[i].group }
            end
        end
        payload[name] = {
            name = name,
            label = item.label,
            stack = item.stack,
            close = item.close,
            count = item.count,
            description = item.description,
            buttons = buttons,
            ammoName = item.ammoname,
            image = item.client and item.client.image,
        }
    end
    changedItems = {}
    SendNUIMessage({ action = 'mriItems', data = payload })
end

local function refreshLive(catalog, merged, beforeReplace)
    for target in pairs(Data.live[catalog] or {}) do
        if beforeReplace then beforeReplace(target) end
        replaceInPlace(target, Data.copy(merged))
    end
end

-- points and target zones of the stash or evidence list, removed before the list changes
local function removePoints(list)
    for _, entry in pairs(list) do
        if entry.point then
            entry.point:remove()
            entry.point = nil
        elseif entry.zoneId then
            exports.ox_target:removeZone(entry.zoneId)
            entry.zoneId = nil
        end
    end
end

local APPLY = {
    items = function(merged, ids)
        for id in pairs(ids) do
            local entry = merged[id]
            -- a removed item stays until the restart: inventories may still hold it
            if entry then
                entry.name = id
                setItem(id, processItem(entry))
            end
        end
        sendItems()
    end,

    weapons = function(merged, ids)
        for id in pairs(ids) do
            local section, name = id:match('^(.-):(.+)$')
            local entry = section and merged[section] and merged[section][name]
            if entry then setItem(name, processWeapon(section, name, entry)) end
        end
        sendItems()
    end,

    shops = function(merged, ids)
        if not isServer then return end
        for id in pairs(ids) do
            if merged[id] then exports.ox_inventory:RegisterShop(id, merged[id]) end
        end
    end,

    stashes = function(merged, ids)
        if isServer then
            for id in pairs(ids) do
                local stash = findEntry(merged, id)
                if stash then
                    local coords = shared.target and stash.target and stash.target.loc or stash.coords
                    exports.ox_inventory:RegisterStash(stash.name, stash.label, stash.slots, stash.weight, stash.owner, stash.groups or stash.jobs, coords)
                end
            end
            return
        end
        refreshLive('stashes', merged, removePoints)
        if PlayerData.loaded then Inventory.Stashes() end
    end,

    evidence = function(merged)
        if isServer then return end
        refreshLive('evidence', merged, removePoints)
        if PlayerData.loaded then Inventory.Evidence() end
    end,

    licenses = function(merged) refreshLive('licenses', merged) end,
    vehicles = function(merged) refreshLive('vehicles', merged) end,
    animations = function(merged) refreshLive('animations', merged) end,
}

for catalog in pairs(Data.CATALOGS) do
    AddStateBagChangeHandler(Data.KEY:format(catalog), 'global', function(_, _, value)
        local old, new = Data.edits[catalog] or {}, value or {}
        Data.edits[catalog] = value

        local ids = {}
        for id, edit in pairs(new) do
            if not same(edit, old[id]) then ids[id] = true end
        end
        for id in pairs(old) do
            if new[id] == nil then ids[id] = true end
        end
        if not next(ids) or not APPLY[catalog] then return end

        APPLY[catalog](Data.apply(catalog, Data.base(catalog), new), ids)
    end)
end
