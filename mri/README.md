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
│                  getConfig + evento accentColorChanged), categorias do
│                  filtro (data/categories.lua, também no getConfig) e o
│                  owner (citizenid) do player mandado pra NUI (mriSetOwner).
├── server.lua     Broadcast da mri:color quando ela muda e o callback
│                  mri_inventory:getOwner.
└── README.md      Este arquivo.
```

## Fora desta pasta

- `fxmanifest.lua`: carrega os arquivos de `mri/`;
- `data/` e `locales/pt-br.json`: itens, lojas e traduções da MRI (config do
  servidor, editável pelo dono);
- `data/categories.lua`: categorias dos filtros do inventário do jogador. Cada
  categoria tem `name`, `label` e casa um item por nome exato (`items`) ou por
  início do nome (`prefixes`, ex.: `WEAPON_`). Editável pelo dono;
- `locales/pt-br.json`: chaves `ui_mri_*` com os textos novos da interface
  (filtro "Todos", atalhos rápidos e a descrição de cada tipo de inventário);
- `web/`: a interface redesenhada, com o visual baseado no
  [ox_inv_redesign](https://github.com/DemiAutomatic/ox_inv_redesign) (GPL-3.0):
  fundo escuro em tela cheia, cabeçalhos com ícone e descrição, anel de peso,
  slots com gradiente de durabilidade, atalhos rápidos (slots 1 a 5) embaixo da
  grade com os filtros por categoria (itens fora da categoria ficam apagados,
  sem sair do slot), botões Usar/Enviar no centro e menu de contexto com
  ícones. Depois de mexer em `web/src`, rodar `npm run build` dentro de `web/`.

## Tema da suíte

A NUI segue o mesmo padrão do ox_lib, mri_Qadmin e mri_Qmultichar: todo o
visual usa os tokens do `@mriqbox/ui-kit` (`--primary`, `--background`,
`--foreground`, `--border`, `--radius`, `--ui-font-family`, `--ui-success`,
`--ui-warning`, `--ui-error`), então trocar o tema no ox_lib muda o inventário.

| O que | De onde vem | Atualiza ao vivo por |
|---|---|---|
| Cor de destaque | convar `mri:color` (callback `getConfig`) | `ox_inventory:accentColorChanged` |
| Cor de fundo | convar `mri:backgroundColor` (callback `getConfig`) | `ox_inventory:backgroundColorChanged` |
| Tema dark/glass, fonte, radius, cores de status, opacidade do glass, override de accent/fundo | painel `/uiconfig` do ox_lib (`ox_lib:getUiConfig`, pedido pelo callback `mriGetUiConfig`) | `ox_lib:uiConfigChanged` |

Accent e fundo usam o `suiteColors` do `@mriqbox/ui-kit` (a mesma conta de
toda a suíte). Fundo vazio significa `#09090B`, que derivado dá a paleta dark
oficial, igual ao `:root` do `index.scss`.

O tema glass vem do `@mriqbox/ui-kit/themes.css` (importado no `main.tsx`):
transparência das superfícies, borda clara e o reflexo nos elementos marcados
com `mri-surface` (tooltip, menu, diálogo) e `mri-surface-card` (slots,
filtros, botões). O SCSS só usa os tokens.

O `mriGetUiConfig` é separado do `getConfig` de propósito: se o ox_lib não
tiver a pasta `mri/`, só esse pedido fica pendente e as cores continuam
chegando. Os broadcasts mandam o payload dentro de `data` porque o
`useNuiEvent` lê `event.data.data`.

A cor da durabilidade no slot também segue o tema: 75+ usa `--ui-success`,
50 a 74 o accent, 15 a 49 `--ui-warning` e abaixo de 15 `--ui-error`.

A fonte Saira é auto-hospedada em `web/src/fonts` (o `@import` do Google Fonts
trava a renderização no CEF). Se o `/uiconfig` escolher outra fonte, ela precisa
estar disponível no cliente; senão cai na Saira. Os `.woff2` saem em
`web/build/assets` e estão liberados no `files` do `fxmanifest.lua`.

## Convenção de licença

ox_inventory é GPL-3.0. As modificações MRI nesta pasta seguem a mesma licença.
