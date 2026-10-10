# [3.2.0](https://github.com/mri-Qbox-Brasil/ox_inventory-source/compare/v3.1.0...v3.2.0) (2026-10-10)


### Features

* **images:** remove a imagem dos sprays do mri_QexoticPaints ([6f270b4](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/6f270b4dbb517188611b317377a3a3ee9962ee79))
* **items:** data/items.lua volta ao original; itens da MRI vêm do mri_Qbox ([78d6316](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/78d6316b951a75e49f45eeb88621be99fd04c993))
* **items:** itens da MRI só substituem os do data/items.lua quando o arquivo é o original ([f630cb0](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/f630cb0ecd99dbed44befd3a8b2e62057d27e29d))
* **items:** troca os itens do ars_ambulancejob pelos do mri_Qmedical ([08514bc](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/08514bcf2af72e569409a6c34dcbb0e8d2c2c311))
* **mri:** edições do editor do inventário do mri_Qbox por cima de data/, aplicadas na hora ([a2a6f86](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/a2a6f86e1a12941c72bb33e1352b87704f952ddd))
* **shops:** data/shops.lua volta ao original; lojas da MRI vêm do mri_Qbox ([0f50caf](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/0f50caf3be6dbeaa89e993f18d1be0b31d54e939))

# [3.1.0](https://github.com/mri-Qbox-Brasil/ox_inventory-source/compare/v3.0.0...v3.1.0) (2026-10-07)


### Features

* **items:** botões de juntar e separar chaves no vehiclekey e no keybag (mri_Qcarkeys) ([ff0fb01](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/ff0fb01b39fbde906efff29b684beafc2641003a))
* **items:** botões do keybag passam a guardar as chaves soltas na bolsa (container) ([90983e0](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/90983e0a6645aae490e426ae5acb7a97c072450b))
* **items:** keybag vira keyring (molho de chaves) com botões de juntar chaves ([5084352](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/5084352cf1fd0db0743d3386a3c972073cb121a4))

# [3.0.0](https://github.com/mri-Qbox-Brasil/ox_inventory-source/compare/v2.47.9...v3.0.0) (2026-10-01)


* feat!: release própria da MRI no modelo source + espelho público ([047bd93](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/047bd935a95b35910dc1d22285b544add05af9bf))


### Bug Fixes

* add glass missing item ([7b2d003](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/7b2d00319a18437b23e23e27338cc28f61236e18))
* drug item images ([0f27465](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/0f27465a08b771ebf7232508f75776d74799489d))
* drug items ([8c17c7c](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/8c17c7ccfe1ede67ed3d1b2aa0f4bb00389b6464))
* **fonts:** tira a Saira hospedada; fonte vem do ui-kit (Google Fonts) e troca junto com o /uiconfig ([768caae](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/768caaeb51cc10162bbf6576c09b84bee362094b))
* parameter name in defaultGetPlayerName function ([#1967](https://github.com/mri-Qbox-Brasil/ox_inventory-source/issues/1967)) ([b5c3991](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/b5c39919bcce3f534a458d7e23966e6bdb27e620))
* **server:** reject client-supplied invid for vehicle inventories ([ce8ad4c](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/ce8ad4c624cacebf0b2434a3aa27b363fb4c4b06))
* **server:** yield while waiting for player ped ([#1972](https://github.com/mri-Qbox-Brasil/ox_inventory-source/issues/1972)) ([41430ab](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/41430abd9e9568e25f5524677d9a338cf49f2dac))
* **web/InventorySlot:** drop incorrect NodeJS.Timeout cast ([f353d69](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/f353d69811bcaea7d2a8278412f13b44487002b8))
* **web:** soltar item no chão não recarrega o painel com o nome do drop ([ac4802e](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/ac4802e3710cb4430f260c6f90da46a7a73f993c))


### Features

* add item speaker para mri_Qboombox ([b4973e5](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/b4973e50063b0d4aa6331b1c6a8c9b8aa18d550d))
* **inventory:** exibe id + citizenid antes do nome do player ([96e5c05](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/96e5c051ad70604ad4ab510c61c77dbe5adbfc1a))
* itens do sd-phone e sd-tablet (8 cores cada) no lugar do phone do npwd ([9a7b229](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/9a7b22932a33dfac2a8fef97e6f909147cf8bf0c))
* **server/inventory:** add GetInventories export. ([#1971](https://github.com/mri-Qbox-Brasil/ox_inventory-source/issues/1971)) ([172b391](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/172b3914d0cf1967ead8cccc583763e8d5316eb7))
* **theme:** consume mri:color suite convar via --primaryColor ([77a5560](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/77a5560747b4101d992738fb2c200afb01049fe0)), closes [#00E699](https://github.com/mri-Qbox-Brasil/ox_inventory-source/issues/00E699)
* **web:** botão direito pega item do chão e controles com glifos de teclas e mouse ([8195abf](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/8195abf004196b54eae74ed6b82c6c466f780bbc))
* **web:** controles do inventário no padrão de jogo, sem legenda ([e48da79](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/e48da7914fbe0e3d216d174f5ee06e3c7626a758))
* **web:** notificação de itens estilo arena, sons do GTA e animações ([025dd15](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/025dd157459f1973e389fa18f691fad5b401fa63))
* **web:** redesign do inventário no tema da suíte ([aaff662](https://github.com/mri-Qbox-Brasil/ox_inventory-source/commit/aaff6624e7d50b5977fc3d9e41b8d04f8e1cd3d4))


### BREAKING CHANGES

* numeração própria a partir da 3.0.0, separada da do
overextended (o fork estava na 2.47.9 do upstream).
