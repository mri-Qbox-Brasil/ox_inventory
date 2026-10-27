-- Loads before init.lua (server): Ajustes of the mri_Qbox inventory editor become the inventory:* convars (see mri/README.md).

local KEY <const> = 'mri:inventory:settings'

-- convars the panel may set, with the ox_inventory default; replicated = the client reads it
local CONVARS <const> = {
    slots = { default = '50', replicated = true },
    weight = { default = '30000', replicated = true },
    dropslots = { replicated = true },
    dropweight = { replicated = true },
    target = { default = 'false', replicated = true },
    police = { default = '["police", "sheriff"]', replicated = true },
    networkdumpsters = { default = 'false', replicated = true },
    autoreload = { default = 'false', replicated = true },
    screenblur = { default = 'true', replicated = true },
    aimedfiring = { default = 'false', replicated = true },
    giveplayerlist = { default = 'false', replicated = true },
    weaponanims = { default = 'true', replicated = true },
    itemnotify = { default = 'true', replicated = true },
    weaponnotify = { default = 'true', replicated = true },
    imagepath = { default = 'nui://ox_inventory/web/images', replicated = true },
    dropprops = { default = 'false', replicated = true },
    dropmodel = { default = 'prop_med_bag_01b', replicated = true },
    weaponmismatch = { default = 'true', replicated = true },
    ignoreweapons = { default = '[]', replicated = true },
    suppresspickups = { default = 'true', replicated = true },
    disableweapons = { default = 'false', replicated = true },
    enablestealcommand = { default = 'true', replicated = true },
    disablesetupnotification = { default = 'false', replicated = true },
    dropmarker = { default = '{"type": 2, "colour": [150, 30, 30], "scale": [0.3, 0.2, 0.15]}', replicated = true },
    shopmarker = { default = '{"type": 29, "colour": [30, 150, 30], "scale": [0.5, 0.5, 0.5]}', replicated = true },
    evidencemarker = { default = '{"type": 2, "colour": [30, 30, 150], "scale": [0.3, 0.2, 0.15]}', replicated = true },
    craftingmarker = { default = '{"type": 2, "colour": [150, 150, 30], "scale": [0.3, 0.2, 0.15]}', replicated = true },
    randomprices = { default = 'false' },
    randomloot = { default = 'true' },
    evidencegrade = { default = '2' },
    loglevel = { default = '1' },
    vehicleloot = { default = '[["sprunk", 1, 1], ["water", 1, 1], ["garbage", 1, 2, 50], ["panties", 1, 1, 5], ["money", 1, 50], ["money", 200, 400, 5], ["bandage", 1, 1]]' },
    dumpsterloot = { default = '[["mustard", 1, 1], ["garbage", 1, 3], ["money", 1, 10], ["burger", 1, 1]]' },
    clearstashes = { default = '6 MONTH' },
    cleartime = { default = '5' },
    bulkstashsave = { default = 'true' },
    loghookrejection = { default = 'true' },
}

local UNSET <const> = '\0'

-- what the server.cfg/ox.cfg gave (or the ox_inventory default), to go back to when the panel resets one
local original = {}
for name, def in pairs(CONVARS) do
    local value = GetConvar('inventory:' .. name, UNSET)
    original[name] = value ~= UNSET and value or def.default
end
-- drops follow the player inventory when nothing set them
original.dropslots = original.dropslots or original.slots
original.dropweight = original.dropweight or original.weight

local function encode(value)
    local kind = type(value)
    if kind == 'boolean' then return value and 'true' or 'false' end
    if kind == 'number' then return math.type(value) == 'float' and tostring(value) or ('%d'):format(value) end
    if kind == 'table' then return json.encode(value) end
    return tostring(value)
end

local function apply(name, value)
    local text = value == nil and original[name] or encode(value)
    local convar = 'inventory:' .. name
    if GetConvar(convar, UNSET) == text then return end
    if CONVARS[name].replicated then SetConvarReplicated(convar, text) else SetConvar(convar, text) end
end

local function applyAll(settings)
    settings = type(settings) == 'table' and settings or {}
    for name in pairs(CONVARS) do apply(name, settings[name]) end
end

local raw = LoadResourceFile('mri_Qbox', 'data/inventory.json')
local ok, saved = pcall(json.decode, raw or '{}')
local settings = ok and type(saved) == 'table' and saved.settings or nil
applyAll(settings)
GlobalState[KEY] = settings

-- the mri_Qbox panel publishes on save; mri/convars.lua re-reads what can change live
AddStateBagChangeHandler(KEY, 'global', function(_, _, value)
    applyAll(value)
end)

exports('MriSettingsOriginal', function() return original end)
