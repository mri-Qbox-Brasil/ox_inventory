--[[
    Modificacoes MRI no client do ox_inventory (carregado depois do init.lua).
]]

-- Cor de destaque da suite MRI (compartilhada com mri_Qmultichar, mri_Qspawn,
-- mri_Qadmin, mri_Qloadscreen, mri_Qchat, ox_lib). Definida via
-- `setr mri:color "#hex"` no server.cfg ou pelo painel admin do mri_Qadmin.
RegisterNUICallback('getConfig', function(_, cb)
    cb({ accentColor = GetConvar('mri:color', '#00E699') })
end)

-- Broadcast: convar `mri:color` mudou no server, propaga pra NUI ja aberta.
-- Payload aninhado em `data` porque o useNuiEvent desestrutura `event.data.data`.
RegisterNetEvent('ox_inventory:accentColorChanged', function(newColor)
    SendNUIMessage({ action = 'updateAccentColor', data = { accentColor = newColor } })
end)

-- Owner (citizenid) do inventario do player, exibido no cabecalho da NUI antes
-- do nome. Pedido ao server quando o inventario do player e carregado.
AddEventHandler('ox_inventory:setPlayerInventory', function()
    local owner = lib.callback.await('mri_inventory:getOwner', false)

    SendNUIMessage({ action = 'mriSetOwner', data = owner })
end)
