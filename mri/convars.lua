-- Re-reads the inventory:* convars ox_inventory consults on every use, so a change (panel or console) applies at once.

local function bool(name, default) return GetConvarBool('inventory:' .. name, default) end
local function int(name, default) return GetConvarInt('inventory:' .. name, default) end

local function decode(name, fallback)
    local ok, value = pcall(json.decode, GetConvar('inventory:' .. name, ''))
    return ok and value or fallback
end

-- same shape as init.lua: job -> 0, refilled in place since shops and stashes hold this table
local function police()
    local list = decode('police', {})
    if type(list) == 'string' then list = { list } end
    for job in pairs(shared.police) do shared.police[job] = nil end
    for i = 1, #list do shared.police[list[i]] = 0 end
end

local LIVE

if IsDuplicityVersion() then
    LIVE = {
        police = police,
        dropslots = function() shared.dropslots = int('dropslots', shared.playerslots) end,
        dropweight = function() shared.dropweight = int('dropweight', shared.playerweight) end,
        randomloot = function() server.randomloot = bool('randomloot', true) end,
        evidencegrade = function() server.evidencegrade = int('evidencegrade', 2) end,
        loglevel = function() server.loglevel = int('loglevel', 1) end,
        vehicleloot = function() server.vehicleloot = decode('vehicleloot', server.vehicleloot) end,
        dumpsterloot = function() server.dumpsterloot = decode('dumpsterloot', server.dumpsterloot) end,
        bulkstashsave = function() server.bulkstashsave = bool('bulkstashsave', true) end,
        loghookrejection = function() server.loghookrejection = bool('loghookrejection', true) end,
    }
else
    -- init.lua always ignores these on top of the list
    local ALWAYS_IGNORED <const> = { `WEAPON_UNARMED`, `WEAPON_HANDCUFFS`, `WEAPON_GARBAGEBAG`, `OBJECT`, `WEAPON_HOSE` }

    local function flag(name, default)
        return function() client[name] = bool(name, default) end
    end

    local function weaponWheel(name, default)
        return function()
            client[name] = bool(name, default)
            require('modules.utils.client').WeaponWheel()
        end
    end

    local function marker(name)
        return function() client[name] = decode(name, client[name]) end
    end

    LIVE = {
        police = police,
        autoreload = flag('autoreload', false),
        screenblur = flag('screenblur', true),
        aimedfiring = flag('aimedfiring', false),
        giveplayerlist = flag('giveplayerlist', false),
        weaponanims = flag('weaponanims', true),
        itemnotify = flag('itemnotify', true),
        weaponnotify = flag('weaponnotify', true),
        dropprops = flag('dropprops', false),
        weaponmismatch = flag('weaponmismatch', true),
        suppresspickups = weaponWheel('suppresspickups', true),
        disableweapons = weaponWheel('disableweapons', false),
        dropmarker = marker('dropmarker'),
        dropmodel = function() client.dropmodel = joaat(GetConvar('inventory:dropmodel', 'prop_med_bag_01b')) end,
        ignoreweapons = function()
            local set = {}
            for _, weapon in ipairs(decode('ignoreweapons', {})) do set[tonumber(weapon) or joaat(weapon)] = true end
            for _, hash in ipairs(ALWAYS_IGNORED) do set[hash] = true end
            client.ignoreweapons = set
        end,
    }
end

AddConvarChangeListener('inventory:*', function(convar)
    local refresh = LIVE[convar:sub(#'inventory:' + 1)]
    if refresh then refresh() end
end)
