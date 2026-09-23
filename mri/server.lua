--[[
    Modificacoes MRI no server do ox_inventory (carregado depois do init.lua).
]]

-- Broadcast em runtime quando a convar `mri:color` muda (admin via painel
-- mri_Qadmin ou `setr mri:color` no console). Mesmo padrao do
-- mri_Qmultichar/mri_Qspawn/mri_Qadmin/mri_Qchat/ox_lib.
AddConvarChangeListener('mri:color', function(name)
    if name ~= 'mri:color' then return end
    local color = GetConvar('mri:color', '#00E699')
    if not color:match('^#%x%x%x%x%x%x$') then return end
    TriggerClientEvent('ox_inventory:accentColorChanged', -1, color)
end)

-- Owner (citizenid) do inventario do proprio player, pro cabecalho da NUI.
-- require dentro do callback: o modulo ja esta em cache (carregado pelo
-- init.lua) e, se o init abortou, este arquivo nao quebra no load.
lib.callback.register('mri_inventory:getOwner', function(source)
    local inv = require('modules.inventory.server')(source)

    return inv and inv.owner
end)
