-- Loads before init.lua: the mri_Qbox inventory editor edits merged over data/*.lua, nothing written here (see mri/README.md).

local CATALOGS = {
    items = true, weapons = true, shops = true, crafting = true, licenses = true,
    stashes = true, evidence = true, vehicles = true, animations = true,
}
-- arrays in data/*.lua: the id is the entry name, or '#<index>' without one
local ARRAYS = { crafting = true, licenses = true, stashes = true, evidence = true }
-- split in sections: the id is '<section>:<key>' (vehicles: 'trunk.models:adder')
local SECTIONS = { weapons = true, animations = true, vehicles = true }

local function copy(value)
    if type(value) ~= 'table' then return value end
    local out = {}
    for k, v in pairs(value) do out[k] = copy(v) end
    return out
end

local function isList(value)
    return type(value) == 'table' and value[1] ~= nil
end

-- maps merge key by key; lists and plain values replace (functions of the original stay)
local function merge(base, patch)
    if type(base) ~= 'table' or type(patch) ~= 'table' or isList(base) or isList(patch) then
        return copy(patch)
    end
    for k, v in pairs(patch) do base[k] = merge(base[k], v) end
    return base
end

-- json has no vectors: {x, y, z[, w]} becomes a vector again
local function toVectors(value)
    if type(value) ~= 'table' then return value end
    local x, y, z, w = value.x, value.y, value.z, value.w
    local size = 0
    for _ in pairs(value) do size += 1 end
    if type(x) == 'number' and type(y) == 'number' and type(z) == 'number' then
        if size == 3 then return vec3(x, y, z) end
        if size == 4 and type(w) == 'number' then return vec4(x, y, z, w) end
    end
    local out = {}
    for k, v in pairs(value) do out[k] = toVectors(v) end
    return out
end

---@param catalog string
---@param key string
local function sectionKey(catalog, key)
    local number = tonumber(key)
    if number then return number end
    return catalog == 'vehicles' and joaat(key) or key
end

---@param catalog string
---@param data table file contents (changed in place for maps)
---@param edits table<string, table|false>?
---@return table
local function applyCatalog(catalog, data, edits)
    if not edits or not next(edits) then return data end

    if ARRAYS[catalog] then
        local out, seen = {}, {}
        for i = 1, #data do
            local entry = data[i]
            local id = entry.name or ('#%d'):format(i)
            local edit = edits[id]
            seen[id] = true
            if edit ~= false then out[#out + 1] = edit and merge(entry, edit) or entry end
        end
        for id, edit in pairs(edits) do
            if edit and not seen[id] then
                local entry = copy(edit)
                if not id:find('^#') then entry.name = id end
                out[#out + 1] = entry
            end
        end
        return out
    end

    for id, edit in pairs(edits) do
        local target, key = data, id
        if SECTIONS[catalog] then
            local section, name = id:match('^(.-):(.+)$')
            if section then
                target = data
                for part in section:gmatch('[^%.]+') do
                    target[part] = target[part] or {}
                    target = target[part]
                end
                key = sectionKey(catalog, name)
            end
        end
        if edit == false then
            target[key] = nil
        else
            target[key] = merge(target[key], edit)
        end
    end

    return data
end

---@type table<string, table<string, table|false>>
local edits = {}
local KEY = 'mri:inventory:%s'

if IsDuplicityVersion() then
    local raw = LoadResourceFile('mri_Qbox', 'data/inventory.json')
    local ok, saved = pcall(json.decode, raw or '{}')
    if not ok or type(saved) ~= 'table' then
        warn('mri_Qbox/data/inventory.json inválido, o inventário sobe sem as edições do editor')
        saved = {}
    end
    for catalog in pairs(CATALOGS) do
        edits[catalog] = toVectors(saved[catalog])
        GlobalState[KEY:format(catalog)] = edits[catalog]
    end
else
    for catalog in pairs(CATALOGS) do
        edits[catalog] = GlobalState[KEY:format(catalog)]
    end
end

-- MRI defaults shipped by mri_Qbox (base/<catalog>.lua): each entry replaces the file's, false removes it
local LAYERS = { items = true, shops = true }
local LAYER_FILE = 'resources/modules/inventory/base/%s.lua'
local loadChunk = load
local layers = {}

---@param catalog string
---@return table<string, table|false>?
local function layer(catalog)
    if not LAYERS[catalog] then return end
    if layers[catalog] == nil then
        local file = LAYER_FILE:format(catalog)
        local raw = LoadResourceFile('mri_Qbox', file)
        local chunk, err = loadChunk(raw or '', ('@@mri_Qbox/%s'):format(file), 't')
        local ok, result = false, raw and err or 'arquivo não encontrado'
        if raw and chunk then ok, result = pcall(chunk) end
        if not ok or type(result) ~= 'table' then
            lib.print.error(('mri_Qbox/%s: %s. O inventário sobe sem os padrões da MRI desse catálogo'):format(file, result))
            result = false
        end
        layers[catalog] = result
    end
    return layers[catalog] or nil
end

-- upstream data/<catalog>.lua without \r (length and FNV-1a): update when syncing that file
local ORIGINAL = {
    items = { size = 4598, hash = 1201248908 },
    shops = { size = 7401, hash = 3474986498 },
}
local original = {}

---@param catalog string
---@return boolean true when data/<catalog>.lua is the untouched upstream file
local function isOriginal(catalog)
    if original[catalog] == nil then
        local expected = ORIGINAL[catalog]
        local text = expected and LoadResourceFile(GetCurrentResourceName(), ('data/%s.lua'):format(catalog))
        local same = false
        if text then
            text = text:gsub('\r', '')
            if #text == expected.size then
                local hash = 2166136261
                for i = 1, #text do hash = ((hash ~ text:byte(i)) * 16777619) & 0xFFFFFFFF end
                same = hash == expected.hash
            end
        end
        original[catalog] = same
    end
    return original[catalog]
end

-- untouched file: the MRI entries replace and remove; edited by the owner: they only fill what is missing
---@param catalog string
---@param data table
local function applyLayer(catalog, data)
    local entries = layer(catalog)
    if not entries then return data end
    local replace = isOriginal(catalog)
    for id, entry in pairs(entries) do
        if replace then
            data[id] = entry ~= false and copy(entry) or nil
        elseif entry ~= false and data[id] == nil then
            data[id] = copy(entry)
        end
    end
    return data
end

if IsDuplicityVersion() then
    exports('MriOriginalFile', isOriginal)
end

---@type table<string, table<table, true>> every table lib.load returned (weak), kept current by mri/live.lua
local live = {}
local load = lib.load

rawset(lib, 'load', function(path, env)
    local result = load(path, env)
    local catalog = type(path) == 'string' and path:match('^data%.(%w+)$')
    if catalog and CATALOGS[catalog] and type(result) == 'table' then
        result = applyCatalog(catalog, applyLayer(catalog, result), edits[catalog])
        live[catalog] = live[catalog] or setmetatable({}, { __mode = 'k' })
        live[catalog][result] = true
    end
    return result
end)

MriInventoryData = {
    KEY = KEY,
    CATALOGS = CATALOGS,
    edits = edits,
    live = live,
    copy = copy,
    merge = merge,
    apply = applyCatalog,
    ---@param catalog string
    ---@return table fresh file contents with the MRI defaults, without the edits
    base = function(catalog) return applyLayer(catalog, load(('data.%s'):format(catalog))) end,
}
