--[[
    Carregado ANTES do init.lua (ver fxmanifest): intercepta o lib.addKeybind pra
    trocar o nome dos binds do inventario. Qualquer outro keybind passa direto.

    MRI: os binds usam o prefixo mriQ_ desde o mri_Qbox, entao o jogador mantem
    as teclas que ja configurou.
]]

local renamed = {
    inv = 'mriQ_inv',
    inv2 = 'mriQ_inv2',
    hotbar = 'mriQ_hotbar',
}

local addKeybind = lib.addKeybind

rawset(lib, 'addKeybind', function(data)
    data.name = renamed[data.name] or data.name

    return addKeybind(data)
end)
