# mri/ — Modificações MRI Qbox no ox_inventory

Esta pasta isola o **código específico da MRI Qbox Brasil** sobre o
ox_inventory upstream (Overextended). Assim o `client.lua`, o `server.lua` e os
`modules/` ficam idênticos ao upstream e os merges entram sem conflito.

## Conteúdo

```
mri/
├── keybinds.lua   Carrega ANTES do init.lua: intercepta o lib.addKeybind e
│                  renomeia os binds inv/inv2/hotbar pra mriQ_*, mantendo as
│                  teclas que os jogadores já configuraram.
├── client.lua     Cor de destaque da suite (convar mri:color, callback
│                  getConfig + evento accentColorChanged) e o owner
│                  (citizenid) do player mandado pra NUI (mriSetOwner).
├── server.lua     Broadcast da mri:color quando ela muda e o callback
│                  mri_inventory:getOwner.
└── README.md      Este arquivo.
```

## Fora desta pasta

- `fxmanifest.lua`: carrega os arquivos de `mri/`;
- `data/` e `locales/pt-br.json`: itens, lojas e traduções da MRI (config do
  servidor, editável pelo dono);
- `web/`: a interface redesenhada.

## Convenção de licença

ox_inventory é GPL-3.0. As modificações MRI nesta pasta seguem a mesma licença.
