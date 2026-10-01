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
│                  Sons nativos do GTA: callback mriPlaySound e som de equipar
│                  arma (liga/desliga pela convar mri:inventorySfx).
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
  sem sair do slot), menu de contexto com ícones e os controles repensados
  (ver "Controles" abaixo). Depois de mexer em `web/src`, rodar
  `npm run build` dentro de `web/`.

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

Soltar um item no chão vazio faz o servidor criar um drop e o client mandar um
novo `setupInventory` com ele (`newdrop` → `drop-123456`, label `Drop 123456`).
Pra isso não parecer um "recarregar", o `InventoryGrid` trata `drop`/`newdrop`
como o mesmo chão: o título fica "Chão" (só `CustomDrop` com prefixo próprio
mostra o nome) e a key dos slots não usa o id, então os slots não são
recriados e só o que recebeu o item anima.

A cor da durabilidade no slot também segue o tema: 75+ usa `--ui-success`,
50 a 74 o accent, 15 a 49 `--ui-warning` e abaixo de 15 `--ui-error`.

A fonte Saira é auto-hospedada em `web/src/fonts` (o `@import` do Google Fonts
trava a renderização no CEF). Se o `/uiconfig` escolher outra fonte, ela precisa
estar disponível no cliente; senão cai na Saira. Os `.woff2` saem em
`web/build/assets` e estão liberados no `files` do `fxmanifest.lua`.

## Controles

Os controles do ox (siglas, campo de quantidade no meio onde 0 = tudo, botões
Usar/Enviar pra arrastar em cima, SHIFT = metade) foram trocados pelas
convenções que jogador já traz de outros jogos, sem precisar de legenda:

| Ação | Como | Onde fica |
|---|---|---|
| Mover | Arrastar | `InventorySlot` |
| Quantidade ao arrastar | Rodinha do mouse enquanto arrasta (SHIFT = 10 em 10); contador no item arrastado, começa na pilha inteira (1 em loja/craft) | `DragPreview` (usa o `itemAmount` do store e zera ao soltar) |
| Dividir ao arrastar | Arrastar segurando SHIFT leva metade da pilha (o contador já mostra a metade); se mexeu a rodinha, vale a rodinha | `onDrop` (`shiftPressed`) + `DragPreview` |
| Largar / guardar | Soltar fora dos painéis ou no fundo do painel da direita; soltar num vão do próprio painel não faz nada | `useDrop` no `.inventory-wrapper` (`inventory/index.tsx`) |
| Transferir a pilha inteira | SHIFT + clique (CTRL + clique continua valendo) | `InventorySlot` |
| Usar / equipar | Mouse em cima + E, ou "Usar" no menu (ALT + clique continua valendo) | `hooks/useInventoryHotkeys.ts` |
| Ações | Botão direito em qualquer inventário menos loja/craft | `InventoryContext` |
| Atalho rápido | Mouse em cima + 1 a 5 (do seu inventário ou do chão/baú) | `hooks/useInventoryHotkeys.ts` |
| Largar / pegar rápido | Mouse em cima + F: num item seu larga (ou guarda, se a direita for baú); num item do chão/baú, pega | `hooks/useInventoryHotkeys.ts` |
| Pegar tudo | Botão no cabeçalho do chão/baú/porta-malas | `InventoryGrid` |

- **Menu**: no seu inventário, Usar, Enviar e Largar (vira "Guardar" quando a
  direita não é o chão) + Dividir em "Mais ações"; nos outros, Pegar e Pegar
  parte. Enviar, Dividir e Pegar parte abrem o `QuantityDialog` (número,
  slider, 1 / ½ / Tudo, rodinha, Enter confirma, Esc fecha só ele). Dividir
  manda a quantidade pro primeiro slot vazio.
- **Enviar** usa o `giveItem` do ox: com a convar `inventory:giveplayerlist`
  ligada ele mostra a lista de jogadores próximos (menu do ox_lib); sem ela,
  manda pro jogador mais perto. Antes, com o campo em 0, o servidor dava 1 item
  (`math.max(1, count)`); agora a quantidade vem do diálogo.
- **Usar não é duplo clique** de propósito: item com `close = true` fecha o
  inventário no meio dos cliques, a NUI perde o foco e os cliques que sobram
  viram soco no jogo. O E é um toque só. (Também houve um "segurar e soltar"
  com anel, que saiu por não combinar.) E e F não vazam pro jogo porque o ox
  chama `DisableAllControlActions` enquanto o inventário está aberto.
- **Pegar tudo** move um item por vez e espera o `swapItems` responder (o
  client recusa movimentos simultâneos); para no primeiro recusado.
- **Barra de dicas** (`HintBar.tsx`, no rodapé): mostra só as ações possíveis
  pro que está debaixo do mouse (seu item, chão/baú, loja, craft) e enquanto
  arrasta. O SHIFT + clique (transferir) não aparece nela de propósito, só na
  aba "Controles". O item debaixo do mouse fica no `lib/inventoryUx.ts`, junto
  com o pedido do seletor de quantidade.
- **Aba "Controles"** (`UsefulControls.tsx`): a mesma lista em glifos — teclas
  físicas (`KeyCap`) e mouse em SVG com o botão/rodinha aceso (`MouseGlyph`,
  em `web/src/components/utils/icons/ControlGlyphs.tsx`). Textos nas chaves
  `ui_mri_ctrl_*` e `ui_mri_hint_*` do `pt-br.json`.
- O `onDrop` ganhou um terceiro parâmetro (`amount`, `0` = pilha inteira),
  e devolve a promessa do `validateMove`. O `shiftPressed` (metade) só vale
  quando `amount` não é passado, ou seja, nos arrastos; SHIFT + clique, menu,
  atalhos e "Pegar tudo" passam a quantidade explícita.

## Notificação de itens

O `itemNotify` (`web/src/components/utils/ItemNotifications.tsx`) não mostra
mais um slot no meio da tela: é uma pilha de cards no canto direito no estilo
"arena" (Apex / jogos da EA). O card tem o lado esquerdo em diagonal com uma
faixa na cor da ação, o ícone grande saindo por cima do card, o nome em fonte
condensada bold, a ação embaixo e a quantidade (`+3` / `−1`) numa etiqueta
sólida. Na entrada o card é revelado da direita pra esquerda, o ícone cai com
quique e um brilho passa por cima; quando a quantidade soma, a etiqueta pulsa.

Sem verde/vermelho: tudo em branco (`--foreground`). Removido usa um branco
mais apagado (e o sinal `−`) e guardado usa `--muted-foreground`; o degradê
branco do card fica em 14% pra não estourar.

A fonte é a Barlow Condensed, carregada do Google Fonts no `web/index.html`
com `media="print"` + `onload` pra não travar a renderização no CEF. Se não
carregar (servidor sem internet), cai na fonte da suíte (`$notifyFont`).

- Avisos do mesmo item + ação (+ `metadata.label`) enquanto um ainda está na
  tela se somam no mesmo card (`+3` → `+5`) e o tempo reinicia, em vez de
  empilhar vários cards iguais (ex.: pegar item por item de um baú);
- no máximo `NOTIFY_MAX` (5) ao mesmo tempo; o mais antigo sai primeiro;
- `NOTIFY_DURATION` e `NOTIFY_EXIT` ficam no componente, e o `$notifyExit` do
  SCSS precisa bater com o `NOTIFY_EXIT`;
- as cores usam só `var(--tone)` sem alpha (o degradê do card é uma camada
  com `opacity`) para não depender de `color-mix` no CEF do FiveM.

A API continua a mesma: `ox_inventory:itemNotify`, `Utils.ItemNotify` e o
`suppressItemNotifications`.

## Sons e animações

Poucos sons, todos nativos do GTA (`PlaySoundFrontend`), o mesmo conjunto do
`tetris_oxinventory`. Os da NUI ficam em `web/src/lib/sfx.ts` (`SOUNDS`: som,
soundset e throttle opcional) e tocam pelo callback `mriPlaySound` do
`mri/client.lua`; o de arma fica direto no `mri/client.lua`.

| Momento | Som do GTA |
|---|---|
| Abrir / fechar o inventário | `Clothes_On` / `Clothes_Off` (`GTAO_Hot_Tub_Sounds`) |
| Soltar um item (mover, trocar ou empilhar) | `Grab_Parachute` (`BASEJUMPS_SOUNDS`) |
| Item adicionado com o inventário fechado | `sports_bag` (`dlc_xm_pickup_sweetener_sounds`) |
| Equipar uma arma nova | `PICK_UP_WEAPON` (`HUD_FRONTEND_CUSTOM_SOUNDSET`) |

O de arma escuta `ox_inventory:currentWeapon` e só toca quando o hash muda pra
uma arma diferente: desarmar (`nil`) e updates de munição/durabilidade da mesma
arma também disparam esse evento.

Hover, filtro, menu, usar, dar, erro etc. ficam sem som de propósito: muito
som de UI soa barato. Houve uma versão com `.ogg` do pack Kenney e outra com
sons de menu do GTA em tudo; as duas saíram por isso. Pra achar outros sons, o
dump [`soundNames.json`](https://github.com/DurtyFree/gta-v-data-dumps) do
DurtyFree lista todos (`AudioName` + `AudioRef`, que é o soundset).

`PlaySoundFrontend` não tem volume, então a convar `mri:inventorySfx` só liga
e desliga (`0` desliga, padrão ligado).

> **Performance: nada de animação infinita em elemento que fica na tela.** Uma
> animação `infinite` (ainda mais com `filter: drop-shadow`) faz a NUI
> redesenhar todo frame, e no FiveM isso obriga o jogo a reenviar a textura da
> interface todo frame. A barra de dicas tinha os glifos pulsando: com o
> inventário parado eram ~1.400 redesenhos em 9 s (~1,5 s de trabalho); sem
> elas, zero. Os glifos só animam dentro da aba "Controles", e com número
> fixo de repetições (3/4), não `infinite`.

Animações (todas em CSS, no fim do `index.scss`):

- **Abrir**: os painéis entram dos lados, o centro dá um pop e os slots
  aparecem em onda na diagonal (só os 30 primeiros da grade, os 5 atalhos e a
  hotbar, via `nth-child`);
- **Slot**: o item sobe um pouco no hover e o slot afunda ao clicar; o alvo do
  drag cresce com brilho na cor da suíte;
- **Drag**: o item arrastado cresce ao ser pego e inclina conforme a velocidade
  do mouse (`DRAG_MAX_TILT`), com amortecimento num `requestAnimationFrame`. A
  inclinação fica num elemento interno (`.item-drag-preview-tilt`): se girar o
  elemento de fora, o `getBoundingClientRect` que o react-dnd usa pra posição
  muda e entra em loop de render;
- **Impacto**: o `InventorySlot` compara nome/quantidade com o render anterior.
  Item novo no slot faz `land` (cai com quique e brilho), quantidade subindo faz
  `stack` (pulso + número pulando) e descendo faz `consume` (encolhe). O slot
  ser montado não conta, então abrir o inventário não anima tudo;
- **Usar/Enviar**: crescem e balançam quando um item do jogador passa por cima;
- **Menu de contexto**: pop elástico a partir do cursor (`transform: false` no
  `useFloating` pra posição não brigar com a escala).

## Convenção de licença

ox_inventory é GPL-3.0. As modificações MRI nesta pasta seguem a mesma licença.
