--[[
    Modificacoes MRI no client do ox_inventory (carregado depois do init.lua).
]]

RegisterNUICallback('getConfig', function(_, cb)
    cb({
        accentColor = GetConvar('mri:color', '#00E699'),
        backgroundColor = GetConvar('mri:backgroundColor', ''),
        categories = lib.load('data.categories') or {},
    })
end)

local function playSound(name, set)
    if GetConvarInt('mri:inventorySfx', 1) == 0 then return end

    PlaySoundFrontend(-1, name, set, true)
end

RegisterNUICallback('mriPlaySound', function(data, cb)
    cb(1)

    if type(data) ~= 'table' or type(data.name) ~= 'string' or type(data.set) ~= 'string' then return end

    playSound(data.name, data.set)
end)

local lastWeaponHash

AddEventHandler('ox_inventory:currentWeapon', function(weapon)
    local hash = weapon and weapon.hash

    if hash and hash ~= lastWeaponHash then
        playSound('PICK_UP_WEAPON', 'HUD_FRONTEND_CUSTOM_SOUNDSET')
    end

    lastWeaponHash = hash
end)

RegisterNUICallback('mriGetUiConfig', function(_, cb)
    local uiConfig = lib.callback.await('ox_lib:getUiConfig', false)

    cb(type(uiConfig) == 'table' and uiConfig or false)
end)

RegisterNetEvent('ox_inventory:accentColorChanged', function(newColor)
    SendNUIMessage({ action = 'updateAccentColor', data = { accentColor = newColor } })
end)

RegisterNetEvent('ox_inventory:backgroundColorChanged', function(newColor)
    SendNUIMessage({ action = 'updateBackgroundColor', data = { backgroundColor = newColor or '' } })
end)

RegisterNetEvent('ox_lib:uiConfigChanged', function(newConfig)
    if type(newConfig) ~= 'table' then return end
    SendNUIMessage({ action = 'applyUiConfig', data = newConfig })
end)

-- Owner (citizenid) do inventario do player, exibido no cabecalho da NUI antes
-- do nome. Pedido ao server quando o inventario do player e carregado.
AddEventHandler('ox_inventory:setPlayerInventory', function()
    local owner = lib.callback.await('mri_inventory:getOwner', false)

    SendNUIMessage({ action = 'mriSetOwner', data = owner })
end)
