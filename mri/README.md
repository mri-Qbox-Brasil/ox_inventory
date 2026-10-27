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
├── data.lua       Carrega ANTES do init.lua (server e client): edições do
│                  editor do inventário do mri_Qbox por cima de data/*.lua,
│                  sem gravar nada aqui (ver "Editor do inventário" abaixo).
├── settings.lua   Carrega ANTES do init.lua (server): aba Ajustes do editor
│                  vira as convars inventory:* (ver "Ajustes" abaixo).
├── live.lua       Aplica na hora as edições que chegam pelo GlobalState.
├── convars.lua    Relê na hora as convars inventory:* que o upstream consulta
│                  a cada uso, quando mudam (painel ou console).
├── client.lua     Cor de destaque da suite (convar mri:color, callback
│                  getConfig + evento accentColorChanged), categorias do
│                  filtro (data/categories.lua, também no getConfig) e o
│                  owner (citizenid) do player mandado pra NUI (mriSetOwner).
│                  Sons nativos do GTA: callback mriPlaySound e som de equipar
│                  arma (liga/desliga pela convar mri:inventorySfx).
│                  Aviso de item pelo ox_lib (ver "Notificação de itens").
├── server.lua     Broadcast da mri:color quando ela muda e o callback
│                  mri_inventory:getOwner.
└── README.md      Este arquivo.
```

## Editor do inventário (mri_Qbox)

O módulo `inventory` do mri_Qbox guarda as edições em `mri_Qbox/data/inventory.json`
(`{ <catálogo> = { <id> = patch | false } }`). Nada é gravado nos arquivos daqui.

- `mri/data.lua` envolve o `lib.load('data.<catálogo>')`: devolve o arquivo com as edições
  mescladas (mapas campo a campo, listas trocam inteiras, `false` remove, funções do original
  ficam). No boot o server lê o json por `LoadResourceFile` e publica
  `GlobalState['mri:inventory:<catálogo>']`; o client lê de lá.
- O mri_Qbox publica o mesmo GlobalState ao salvar. `mri/live.lua` aplica na hora: itens e
  armas (ItemList dos dois lados e evento `mriItems` na NUI), lojas (`RegisterShop`), baús
  (`RegisterStash` e pontos do client), evidências, licenças (preço), veículos e animações
  (tabelas trocadas no lugar). O que o upstream monta uma vez no start (pontos de loja,
  crafting, pontos de licença) e item removido ficam pro próximo restart.
- Catálogos: items, weapons, shops, crafting, licenses, stashes, evidence, vehicles, animations.
- Itens e lojas da MRI: o `data/items.lua` e o `data/shops.lua` daqui são os do original. Os da
  MRI vêm de `mri_Qbox/resources/modules/inventory/base/<catálogo>.lua` (`LAYERS`), que o
  `mri/data.lua` lê nos dois lados (`LoadResourceFile`) antes das edições. Com o arquivo daqui
  igual ao original (tamanho e FNV-1a em `ORIGINAL`, atualizar ao sincronizar esse arquivo), cada
  entrada troca a do original inteira e `false` remove; com o arquivo mexido pelo dono, só entram
  as entradas que faltam nele. O export server `MriOriginalFile(catalog)` diz qual dos dois casos
  vale (o editor usa). Sem o arquivo do mri_Qbox, o console acusa e o catálogo sobe só com o original.
  As imagens dos itens continuam em `web/images` (vários resources usam esse caminho direto).

## Ajustes (convars pelo painel)

A aba Ajustes do editor grava em `mri_Qbox/data/inventory.json`, chave `settings`
(`{ <convar sem o prefixo inventory:> = valor }`), só o que o dono mudou.

- `mri/settings.lua` (server, antes do init.lua) guarda o valor de cada convar como veio do
  `ox.cfg`/`server.cfg` (ou o padrão do ox_inventory) e aplica os do painel com `SetConvar`
  (`SetConvarReplicated` nas que o client lê). Assim o init.lua já sobe com eles. Ao salvar, o
  mri_Qbox publica `GlobalState['mri:inventory:settings']` e o mesmo arquivo reaplica; convar
  tirada do painel volta ao valor original. Export server `MriSettingsOriginal()`: esses originais.
- `mri/convars.lua` (server e client, depois do init.lua) escuta `inventory:*` e atualiza na
  hora o que o upstream lê a cada uso (`client.*`, `server.*`, `shared.police` trocado no lugar,
  porque lojas e baús guardam essa tabela). O resto (espaços e peso do jogador, imagens,
  marcadores de loja, evidência e crafting, `/steal`, olhinho, preço variável, limpeza de baú)
  vale quando o jogador entra de novo ou no restart, e a aba diz qual.
- Ficam fora do painel: `framework`, `accounts`, `keys`, `enablekeys`, `webhook`, `validhosts`
  e `versioncheck`.

## Fora desta pasta

- `fxmanifest.lua`: carrega os arquivos de `mri/`;
- `locales/pt-br.json`: traduções da MRI; os itens e as lojas ficam no
  mri_Qbox (acima);
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
| Visual do inventário (tamanho, colunas, formato e opacidade do slot, nome do item, peso, desgaste, filtros, dicas, posição dos atalhos, fundo atrás da grade) | aba **Inventário** do `/uiconfig` | `ox_lib:uiConfigChanged` |

O visual vem no mesmo config do `/uiconfig` (chaves `inventory*`, validadas no
`mri/server.lua` do ox_lib). O `web/src/lib/uiConfig.ts` passa tamanho e
colunas pras variáveis `--inv-scale` e `--inv-cols` (o SCSS calcula slot e grade
com elas) e o formato do slot, o nome, o desgaste e os atalhos pra
`data-inv-*` no `<html>`. O fundo (`data-inv-backdrop`: tela toda, bordas, embaixo
ou nenhum; `data-inv-backdrop-color`: tema, preto ou a cor da cidade) e as
opacidades (`--inv-backdrop-alpha`, `--inv-slot-alpha`) também; opacidade
"Do tema" tira a variável e volta à opacidade do `/uiconfig`. Peso, filtros e dicas o React lê do
`useInventoryLook`. Sem o nosso ox_lib, fica tudo no padrão (o visual de
sempre). Mínimo de 5 colunas por causa dos 5 atalhos.

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

O aviso de item é o do ox_inventory original: o slot do item aparecendo
embaixo, no meio da tela, com a ação em cima (`Adicionado +3`) e o nome
embaixo, em fila quando chegam vários. Separado da pilha do `lib.notify`.

### Pelo ox_lib

Com o nosso ox_lib rodando, ele publica `GlobalState['mri:itemNotify']` e
desenha o aviso numa pilha só dele (`features/item-notify` do ox_lib), no
formato escolhido no `/uiconfig` em **Inventário > Aviso de item**: **Slot**
(padrão, o mesmo daqui), **Faixa** (cards no estilo "arena"), **Pílula**,
**Ícone** ou **Linha**, com posição, distância da borda e tamanho. O `mri/client.lua` envolve o `SendNUIMessage`: a mensagem
`itemNotify` vira o export `ox_lib:itemNotify`
(`{ key, label, action, image, count, tone }`) e o som de pegar item toca no
Lua. Sem a chave (ox_lib original ou parado), o slot daqui
(`web/src/components/utils/ItemNotifications.tsx`) desenha o aviso.

Nos dois lados:

- avisos do mesmo item + ação (+ `metadata.label`) enquanto um ainda está na
  tela se somam no mesmo slot (`+3` → `+5`) e o tempo reinicia, em vez de
  empilhar vários iguais (ex.: pegar item por item de um baú);
- no máximo 5 ao mesmo tempo; o mais antigo sai primeiro;
- a quantidade usa `--ui-success` (ganhou), `--ui-error` (perdeu); equipar
  usa o accent; `$notifyExit` do SCSS bate com o `NOTIFY_EXIT` do componente.

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

## Release

Mesmo modelo do `mri_Qspawn`, com uma diferença por causa da GPL:

- O trabalho acontece no **`mri-Qbox-Brasil/ox_inventory-source`** (privado). A
  cada push na `main`, o `.github/workflows/release.yml` chama o
  `callable-mirror-release` da org: o semantic-release calcula a versão pelos
  commits (`feat` sobe minor, `fix` sobe patch, `feat!`/`BREAKING CHANGE` sobe
  major), grava no `fxmanifest.lua`, builda a NUI com npm (lockfile:
  `web/package-lock.json`) e monta o zip.
- O **`mri-Qbox-Brasil/ox_inventory`** (público) é o espelho. Com
  `public-source: true` ele recebe o **código completo**, inclusive `web/src`
  (a GPL-3.0 do ox_inventory e do ox_inv_redesign exige o fonte público), e é
  lá que fica a release com o zip.
- O **zip** da release é só o que o servidor precisa: sem `web/src` e sem os
  arquivos do `.releaseignore`, com `web/build` e `web/images` (as imagens dos
  itens; o `build.sh` da org copia `web/images` quando existe).
- A numeração é nossa, a partir da **3.0.0** (a base foi a tag `v2.47.9`, a
  versão do upstream no fork). Não segue a numeração do overextended.
- Merges do upstream entram no `-source` (remote `upstream`); o público é
  sobrescrito a cada release, então nada deve ser commitado direto nele.
- A receita (`mriTxRecipe`) baixa
  `releases/latest/download/ox_inventory.zip` do repo público.

## Convenção de licença

ox_inventory é GPL-3.0. As modificações MRI nesta pasta seguem a mesma licença.
