return {
	['testburger'] = {
		label = 'Test Burger',
		weight = 220,
		degrade = 60,
		client = {
			image = 'burger_chicken.png',
			status = { hunger = 200000 },
			anim = 'eating',
			prop = 'burger',
			usetime = 2500,
			export = 'ox_inventory_examples.testburger'
		},
		server = {
			export = 'ox_inventory_examples.testburger',
			test = 'what an amazingly delicious burger, amirite?'
		},
		buttons = {
			{
				label = 'Lick it',
				action = function(slot)
					print('You licked the burger')
				end
			},
			{
				label = 'Squeeze it',
				action = function(slot)
					print('You squeezed the burger :(')
				end
			},
			{
				label = 'What do you call a vegan burger?',
				group = 'Hamburger Puns',
				action = function(slot)
					print('A misteak.')
				end
			},
			{
				label = 'What do frogs like to eat with their hamburgers?',
				group = 'Hamburger Puns',
				action = function(slot)
					print('French flies.')
				end
			},
			{
				label = 'Why were the burger and fries running?',
				group = 'Hamburger Puns',
				action = function(slot)
					print('Because they\'re fast food.')
				end
			}
		},
		consume = 0.3
	},

	['bandage'] = {
		label = 'Bandagem',
		weight = 115,
		client = {
			anim = { dict = 'missheistdockssetup1clipboard@idle_a', clip = 'idle_a', flag = 49 },
			prop = { model = `prop_rolled_sock_02`, pos = vec3(-0.14, -0.14, -0.08), rot = vec3(-50.0, -50.0, 0.0) },
			disable = { move = true, car = true, combat = true },
			usetime = 2500,
		}
	},

	['black_money'] = {
		label = 'Dinheiro Sujo',
	},

	['burger'] = {
		label = 'Hambúrguer',
		weight = 220,
		client = {
			status = { hunger = 200000 },
			anim = 'eating',
			prop = 'burger',
			usetime = 2500,
			notification = 'Você comeu um delicioso hambúrguer'
		},
	},

	['cola'] = {
		label = 'Coca Cola',
		weight = 350,
		client = {
			status = { thirst = 200000 },
			anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
			prop = { model = `prop_ecola_can`, pos = vec3(0.01, 0.01, 0.06), rot = vec3(5.0, 5.0, -180.5) },
			usetime = 2500,
			notification = 'Você matou sua sede com uma cola'
		}
	},

		['sprunk'] = {
		label = 'Sprite',
		weight = 350,
		client = {
			status = { thirst = 200000 },
			anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
			prop = { model = `prop_ld_can_01`, pos = vec3(0.01, 0.01, 0.06), rot = vec3(5.0, 5.0, -180.5) },
			usetime = 2500,
			notification = 'Você matou sua sede com uma sprite'
		}
	},

	['parachute'] = {
		label = 'Paraquedas',
		weight = 8000,
		stack = false,
		client = {
			anim = { dict = 'clothingshirt', clip = 'try_shirt_positive_d' },
			usetime = 1500
		}
	},

	['garbage'] = {
		label = 'Lixo',
	},

	['paperbag'] = {
		label = 'Saco de papel',
		weight = 1,
		stack = false,
		close = false,
		consume = 0
	},

	['identification'] = {
		label = 'Identificação',
		client = {
			image = 'card_id.png'
		}
	},

	['panties'] = {
		label = 'Calcinha',
		weight = 10,
		consume = 0,
		client = {
			status = { thirst = -100000, stress = -25000 },
			anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
			prop = { model = `prop_cs_panties_02`, pos = vec3(0.03, 0.0, 0.02), rot = vec3(0.0, -13.5, -1.5) },
			usetime = 2500,
		}
	},

	['lockpick'] = {
		label = 'Lockpick',
		weight = 160,
	},

	['phone'] = {
		label = 'Celular',
		weight = 190,
		stack = false,
		consume = 0,
		client = {
			add = function(total)
				if total > 0 then
					pcall(function() return exports.npwd:setPhoneDisabled(false) end)
				end
			end,

			remove = function(total)
				if total < 1 then
					pcall(function() return exports.npwd:setPhoneDisabled(true) end)
				end
			end
		}
	},

	['money'] = {
		label = 'Dinheiro',
	},

	['mustard'] = {
		label = 'Mostarda',
		weight = 500,
		client = {
			status = { hunger = 25000, thirst = 25000 },
			anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
			prop = { model = `prop_food_mustard`, pos = vec3(0.01, 0.0, -0.07), rot = vec3(1.0, 1.0, -1.5) },
			usetime = 2500,
			notification = 'You.. drank mustard'
		}
	},

	['water'] = {
		label = 'Água',
		weight = 500,
		client = {
			status = { thirst = 200000 },
			anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
			prop = { model = `prop_ld_flow_bottle`, pos = vec3(0.03, 0.03, 0.02), rot = vec3(0.0, 0.0, -1.5) },
			usetime = 2500,
			cancel = true,
			notification = 'You drank some refreshing water'
		}
	},

	['water_contaminat'] = {
        label = 'Água Contaminada',
        weight = 500,
        stack = true,
        close = true,
        cancel = true,
        description = 'Água contaminada, não beba isso!',

        client = {
            status = { thirst = -15 },
            anim = { dict = 'mp_player_intdrink', clip = 'loop_bottle' },
            prop = { model = 'prop_ld_flow_bottle', pos = vec3(0.03, 0.03, 0.02), rot = vec3(0.0, 0.0, -2.5) },
            image = 'np_water_contaminat.png',
            usetime = 2500,
			remove = function()
				lib.notify({
					title = 'Hidratação',
					message = 'Você bebeu água contaminada, não é bom para você!',
					icon = 'viruses',
					iconColor = '#5C940D'
				})
			end
        },
    },

	['radio'] = {
		label = 'Rádio',
		weight = 1000,
		stack = false,
		allowArmed = true
	},

	['armour'] = {
		label = 'Colete',
		weight = 3000,
		stack = false,
		client = {
			anim = { dict = 'clothingshirt', clip = 'try_shirt_positive_d' },
			usetime = 3500
		}
	},

	['clothing'] = {
		label = 'Roupas',
		consume = 0,
	},

	['mastercard'] = {
		label = 'Mastercard',
		stack = false,
		weight = 10,
		client = {
			image = 'card_bank.png'
		}
	},

	['scrapmetal'] = {
		label = 'Sucata',
		weight = 80,
	},

	["weed_ak47_seed"] = {
		label = "Semente de AK47",
		weight = 0,
		stack = true,
		close = true,
		description = "Uma semenete de AK47",
		client = {
			image = "weed_seed.png",
		}
	},

	["diamond"] = {
		label = "Diamante",
		weight = 1000,
		stack = true,
		close = true,
		description = "Um diamante parece o jackpot para mim!",
		client = {
			image = "diamond.png",
		}
	},

	["weed_og-kush_seed"] = {
		label = "Semente de OGKush",
		weight = 0,
		stack = true,
		close = true,
		description = "Uma semente de Og Kush",
		client = {
			image = "weed_seed.png",
		}
	},

	["stickynote"] = {
		label = "Post-it",
		weight = 0,
		stack = false,
		close = false,
		description = "Às vezes útil para lembrar de algo :)",
		client = {
			image = "stickynote.png",
		}
	},

	["rolling_paper"] = {
		label = "Seda",
		weight = 0,
		stack = true,
		close = true,
		description = "Papel feito especificamente para enrolar e fumar tabaco ou cannabis.",
		client = {
			image = "rolling_paper.png",
		}
	},

	["plastic"] = {
		label = "Plástico",
		weight = 100,
		stack = true,
		close = false,
		description = "RECYCLE! - Greta Thunberg 2019",
		client = {
			image = "plastic.png",
		}
	},

	["lawyerpass"] = {
		label = "Licença de Advogado",
		weight = 0,
		stack = false,
		close = false,
		description = "Passe exclusivo para advogados para mostrar que podem representar um suspeito",
		client = {
			image = "lawyerpass.png",
		}
	},

	["snikkel_candy"] = {
		label = "Snikkel",
		weight = 100,
		stack = true,
		close = true,
		description = "Um doce delicioso :O",
		client = {
			image = "snikkel_candy.png",
		}
	},

	["printerdocument"] = {
		label = "Documento",
		weight = 500,
		stack = false,
		close = true,
		description = "Um bom documento",
		client = {
			image = "printerdocument.png",
		}
	},

	["visa"] = {
		label = "Visa Card",
		weight = 0,
		stack = false,
		close = false,
		description = "Cartão para usar em algum ATM",
		client = {
			image = "visacard.png",
		}
	},

	["firework4"] = {
		label = "Weeping Willow",
		weight = 1000,
		stack = true,
		close = true,
		description = "Fireworks",
		client = {
			image = "firework4.png",
		}
	},

	["samsungphone"] = {
		label = "Samsung S10",
		weight = 1000,
		stack = true,
		close = true,
		description = "Um telefone bem caro.",
		client = {
			image = "samsungphone.png",
		}
	},

	["firstaid"] = {
		label = "Primeiros Socorros",
		weight = 2500,
		stack = true,
		close = true,
		description = "Você pode usar este kit de primeiros socorros para levantar as pessoas de volta.",
		client = {
			image = "firstaid.png",
		}
	},
	
	["weed_skunk_seed"] = {
		label = "Semente de Skunk",
		weight = 0,
		stack = true,
		close = true,
		description = "Uma semente de maconha Skunk.",
		client = {
			image = "weed_seed.png",
		}
	},
	
	["diving_gear"] = {
		label = "Equipamento de Mergulho",
		weight = 30000,
		stack = false,
		close = true,
		description = "Um tanque de oxigênio e um reinalador.",
		client = {
			image = "diving_gear.png",
		}
	},
	
	["id_card"] = {
		label = "Cartão de Identificação",
		weight = 0,
		stack = false,
		close = false,
		description = "Um cartão contendo todas as suas informações para se identificar.",
		client = {
			image = "id_card.png",
		}
	},
	
	["rubber"] = {
		label = "Borracha",
		weight = 100,
		stack = true,
		close = false,
		description = "Borracha, acredito que você possa fazer seu próprio patinho de borracha com ela :D",
		client = {
			image = "rubber.png",
		}
	},
	
	["binoculars"] = {
		label = "Binóculos",
		weight = 600,
		stack = true,
		close = true,
		description = "Furtivos...",
		client = {
			image = "binoculars.png",
		}
	},
	
	["casinochips"] = {
		label = "Fichas de Cassino",
		weight = 0,
		stack = true,
		close = false,
		description = "Fichas para apostas em cassinos.",
		client = {
			image = "casinochips.png",
		}
	},
	
	["metalscrap"] = {
		label = "Sucata de Metal",
		weight = 100,
		stack = true,
		close = false,
		description = "Você provavelmente pode fazer algo legal com isso.",
		client = {
			image = "metalscrap.png",
		}
	},
	
	["empty_weed_bag"] = {
		label = "Saco Vazio para Maconha",
		weight = 0,
		stack = true,
		close = true,
		description = "Um pequeno saco vazio.",
		client = {
			image = "weed_baggy_empty.png",
		}
	},
	
	["wine"] = {
		label = "Vinho",
		weight = 300,
		stack = true,
		close = false,
		description = "Um bom vinho para beber numa noite agradável.",
		client = {
			image = "wine.png",
		}
	},
	
	["cleaningkit"] = {
		label = "Kit de Limpeza",
		weight = 250,
		stack = true,
		close = true,
		description = "Um pano de microfibra com um pouco de sabão fará o seu carro brilhar novamente!",
		client = {
			image = "cleaningkit.png",
		}
	},
	
	["harness"] = {
		label = "Arnês de Corrida",
		weight = 1000,
		stack = false,
		close = true,
		description = "Arnês de corrida para que você permaneça no carro independentemente.",
		client = {
			image = "harness.png",
		}
	},
	
	["weaponlicense"] = {
		label = "Licença de Arma",
		weight = 0,
		stack = false,
		close = true,
		description = "Licença de arma.",
		client = {
			image = "weapon_license.png",
		}
	},
	
	["tosti"] = {
		label = "Sanduíche de Queijo Grelhado",
		weight = 200,
		stack = true,
		close = true,
		description = "Bom para comer.",
		client = {
			image = "tosti.png",
		}
	},
	
	["10kgoldchain"] = {
		label = "Corrente de Ouro 10k",
		weight = 2000,
		stack = true,
		close = true,
		description = "Corrente de ouro 10 quilates.",
		client = {
			image = "10kgoldchain.png",
		}
	},	

	["weed_nutrition"] = {
		label = "Adubo para Plantas",
		weight = 2000,
		stack = true,
		close = true,
		description = "Nutrição para plantas",
		client = {
			image = "weed_nutrition.png",
		}
	},
	
	["driver_license"] = {
		label = "Carteira de Motorista",
		weight = 0,
		stack = false,
		close = false,
		description = "Permissão para mostrar que você pode dirigir um veículo",
		client = {
			image = "driver_license.png",
		}
	},
	
	["weed_amnesia"] = {
		label = "Amnésia 2g",
		weight = 200,
		stack = true,
		close = false,
		description = "Um saco de maconha com 2g de Amnésia",
		client = {
			image = "weed_baggy.png",
		}
	},
	
	["grapejuice"] = {
		label = "Suco de Uva",
		weight = 200,
		stack = true,
		close = false,
		description = "Dizem que o suco de uva é saudável",
		client = {
			image = "grapejuice.png",
		}
	},
	
	["copper"] = {
		label = "Cobre",
		weight = 100,
		stack = true,
		close = false,
		description = "Belo pedaço de metal que você provavelmente pode usar para algo",
		client = {
			image = "copper.png",
		}
	},
	
	["markedbills"] = {
		label = "Dinheiro Marcado",
		weight = 1000,
		stack = false,
		close = true,
		description = "Dinheiro?",
		client = {
			image = "markedbills.png",
		}
	},
	
	["beer"] = {
		label = "Cerveja",
		weight = 500,
		stack = true,
		close = true,
		description = "Nada como uma boa cerveja gelada!",
		client = {
			image = "beer.png",
		}
	},
	
	["goldbar"] = {
		label = "Barra de Ouro",
		weight = 7000,
		stack = true,
		close = true,
		description = "Parece bem caro para mim",
		client = {
			image = "goldbar.png",
		}
	},
	
	["walkstick"] = {
		label = "Bengala",
		weight = 1000,
		stack = true,
		close = true,
		description = "Bengala para todas as vovós por aí... HAHA",
		client = {
			image = "walkstick.png",
		}
	},
	
	["weed_skunk"] = {
		label = "Skunk 2g",
		weight = 200,
		stack = true,
		close = false,
		description = "Um saco de maconha com 2g de Skunk",
		client = {
			image = "weed_baggy.png",
		}
	},
	
	["microwave"] = {
		label = "Micro-ondas",
		weight = 46000,
		stack = false,
		close = true,
		description = "Micro-ondas",
		client = {
			image = "placeholder.png",
		}
	},
	
	["weed_purple-haze_seed"] = {
		label = "Semente de Purple Haze",
		weight = 0,
		stack = true,
		close = true,
		description = "Uma semente de maconha de Purple Haze",
		client = {
			image = "weed_seed.png",
		}
	},
	
	["empty_evidence_bag"] = {
		label = "Saco de Evidências Vazio",
		weight = 0,
		stack = true,
		close = false,
		description = "Usado muito para guardar DNA de sangue, estojos de balas e mais",
		client = {
			image = "evidence.png",
		}
	},
	
	["lighter"] = {
		label = "Isqueiro",
		weight = 0,
		stack = true,
		close = true,
		description = "Na véspera de Ano Novo, um bom fogo para ficar ao lado",
		client = {
			image = "lighter.png",
		}
	},
	
	["goldchain"] = {
		label = "Corrente de Ouro",
		weight = 1500,
		stack = true,
		close = true,
		description = "Uma corrente de ouro parece ser o jackpot para mim!",
		client = {
			image = "goldchain.png",
		}
	},
	
	["weed_brick"] = {
		label = "Tijolo de Maconha",
		weight = 1000,
		stack = true,
		close = true,
		description = "Tijolo de maconha de 1 kg para vender para clientes grandes.",
		client = {
			image = "weed_brick.png",
		}
	},
	
	["small_tv"] = {
		label = "TV Pequena",
		weight = 30000,
		stack = false,
		close = true,
		description = "TV",
		client = {
			image = "placeholder.png",
		}
	},
	
	["jerry_can"] = {
		label = "Galão 20L",
		weight = 20000,
		stack = true,
		close = true,
		description = "Um galão cheio de combustível",
		client = {
			image = "jerry_can.png",
		}
	},	

	["dendrogyra_coral"] = {
		label = "Dendrogyra",
		weight = 1000,
		stack = true,
		close = true,
		description = "Também conhecido como coral pilar",
		client = {
			image = "dendrogyra_coral.png",
		}
	},
	
	["weed_amnesia_seed"] = {
		label = "Semente de Amnésia",
		weight = 0,
		stack = true,
		close = true,
		description = "Uma semente de maconha de Amnésia",
		client = {
			image = "weed_seed.png",
		}
	},
	
	["weed_og-kush"] = {
		label = "OG Kush 2g",
		weight = 200,
		stack = true,
		close = false,
		description = "Um saco de maconha com 2g de OG Kush",
		client = {
			image = "weed_baggy.png",
		}
	},
	
	["gatecrack"] = {
		label = "Gatecrack",
		weight = 0,
		stack = true,
		close = true,
		description = "Um software útil para derrubar algumas cercas",
		client = {
			image = "usb_device.png",
		}
	},
	
	["weed_white-widow_seed"] = {
		label = "Semente de White Widow",
		weight = 0,
		stack = true,
		close = false,
		description = "Uma semente de maconha de White Widow",
		client = {
			image = "weed_seed.png",
		}
	},
	
	["ironoxide"] = {
		label = "Pó de Ferro",
		weight = 100,
		stack = true,
		close = false,
		description = "Algum pó para misturar.",
		client = {
			image = "ironoxide.png",
		}
	},
	
	["iron"] = {
		label = "Ferro",
		weight = 100,
		stack = true,
		close = false,
		description = "Peça útil de metal que você provavelmente pode usar para algo",
		client = {
			image = "iron.png",
		}
	},
	
	["meth"] = {
		label = "Metanfetamina",
		weight = 100,
		stack = true,
		close = true,
		description = "Um saquinho de metanfetamina",
		client = {
			image = "meth_baggy.png",
		}
	},
	
	["security_card_02"] = {
		label = "Cartão de Segurança B",
		weight = 0,
		stack = true,
		close = true,
		description = "Um cartão de segurança... Me pergunto para o que serve",
		client = {
			image = "security_card_02.png",
		}
	},
	
	["handcuffs"] = {
		label = "Algemas",
		weight = 100,
		stack = true,
		close = true,
		description = "Útil quando as pessoas se comportam mal. Talvez possa ser usado para outra coisa?",
		client = {
			image = "handcuffs.png",
		}
	},
	
	["crack_baggy"] = {
		label = "Saco de Crack",
		weight = 0,
		stack = true,
		close = true,
		description = "Para ficar feliz mais rápido",
		client = {
			image = "crack_baggy.png",
		}
	},
	
	["moneybag"] = {
		label = "Saco de Dinheiro",
		weight = 0,
		stack = false,
		close = true,
		description = "Um saco com dinheiro",
		client = {
			image = "moneybag.png",
		}
	},
	
	["xtcbaggy"] = {
		label = "Saco de Ecstasy",
		weight = 0,
		stack = true,
		close = true,
		description = "Engole essas pílulas, baby",
		client = {
			image = "xtc_baggy.png",
		}
	},
	
	["sandwich"] = {
		label = "Sanduíche",
		weight = 200,
		stack = true,
		close = true,
		description = "Bom pão para o seu estômago",
		client = {
			image = "sandwich.png",
		}
	},
	
	["aluminumoxide"] = {
		label = "Pó de Alumínio",
		weight = 100,
		stack = true,
		close = false,
		description = "Algum pó para misturar",
		client = {
			image = "aluminumoxide.png",
		}
	},
	
	["radioscanner"] = {
		label = "Scanner de Rádio",
		weight = 1000,
		stack = true,
		close = true,
		description = "Com isso, você pode receber alguns alertas da polícia. Não é 100% eficaz, no entanto",
		client = {
			image = "radioscanner.png",
		}
	},
	
	["steel"] = {
		label = "Aço",
		weight = 100,
		stack = true,
		close = false,
		description = "Bela peça de metal que você provavelmente pode usar para algo",
		client = {
			image = "steel.png",
		}
	},
	
	["toaster"] = {
		label = "Torradeira",
		weight = 18000,
		stack = false,
		close = true,
		description = "Torrada",
		client = {
			image = "placeholder.png",
		}
	},
	
	["cryptostick"] = {
		label = "Crypto Stick",
		weight = 200,
		stack = false,
		close = true,
		description = "Por que alguém compraria dinheiro que não existe... Quantos conteria..?",
		client = {
			image = "cryptostick.png",
		}
	},
	
	["weed_purple-haze"] = {
		label = "Purple Haze 2g",
		weight = 200,
		stack = true,
		close = false,
		description = "Um saco de maconha com 2g de Purple Haze",
		client = {
			image = "weed_baggy.png",
		}
	},
	
	["vodka"] = {
		label = "Vodka",
		weight = 500,
		stack = true,
		close = true,
		description = "Para todos os sedentos por aí",
		client = {
			image = "vodka.png",
		}
	},
	
	["diamond_ring"] = {
		label = "Anel de Diamante",
		weight = 1500,
		stack = true,
		close = true,
		description = "Um anel de diamante parece ser o jackpot para mim!",
		client = {
			image = "diamond_ring.png",
		}
	},
	
	["twerks_candy"] = {
		label = "Twerks",
		weight = 100,
		stack = true,
		close = true,
		description = "Algumas deliciosas guloseimas :O",
		client = {
			image = "twerks_candy.png",
		}
	},	

	["cokebaggy"] = {
		label = "Saco de Cocaína",
		weight = 0,
		stack = true,
		close = true,
		description = "Para ficar feliz bem rápido",
		client = {
			image = "cocaine_baggy.png",
		}
	},
	
	["coke_brick"] = {
		label = "Tijolo de Cocaína",
		weight = 1000,
		stack = false,
		close = true,
		description = "Pacote pesado de cocaína, usado principalmente para transações e ocupa muito espaço",
		client = {
			image = "coke_brick.png",
		}
	},
	
	["advancedlockpick"] = {
		label = "Lockpick Avançado",
		weight = 500,
		stack = true,
		close = true,
		description = "Se você perde suas chaves com frequência, isso é muito útil... Também útil para abrir suas cervejas",
		client = {
			image = "advancedlockpick.png",
		}
	},
	
	["heavyarmor"] = {
		label = "Armadura Pesada",
		weight = 5000,
		stack = true,
		close = true,
		description = "Um pouco de proteção não faz mal... certo?",
		client = {
			image = "armor.png",
		}
	},
	
	["joint"] = {
		label = "Cigarro de Maconha",
		weight = 0,
		stack = true,
		close = true,
		description = "Sidney ficaria muito orgulhoso de você",
		client = {
			image = "joint.png",
		}
	},
	
	["advancedrepairkit"] = {
		label = "Kit de Reparo Avançado",
		weight = 4000,
		stack = true,
		close = true,
		description = "Uma caixa de ferramentas com coisas para reparar seu veículo",
		client = {
			image = "advancedkit.png",
		}
	},
	
	["police_stormram"] = {
		label = "Aríete de Choque",
		weight = 18000,
		stack = true,
		close = true,
		description = "Uma ferramenta legal para arrombar portas",
		client = {
			image = "police_stormram.png",
		}
	},
	
	["kurkakola"] = {
		label = "Cola",
		weight = 500,
		stack = true,
		close = true,
		description = "Para todos os sedentos por aí",
		client = {
			image = "cola.png",
		}
	},
	
	["labkey"] = {
		label = "Chave",
		weight = 500,
		stack = false,
		close = true,
		description = "Chave para uma fechadura...?",
		client = {
			image = "labkey.png",
		}
	},
	
	["water_bottle"] = {
		label = "Garrafa de Água",
		weight = 500,
		stack = true,
		close = true,
		description = "Para todos os sedentos por aí",
		client = {
			image = "water_bottle.png",
		}
	},
	
	["trojan_usb"] = {
		label = "USB Trojan",
		weight = 0,
		stack = true,
		close = true,
		description = "Software útil para desativar alguns sistemas",
		client = {
			image = "usb_device.png",
		}
	},
	
	["weed_white-widow"] = {
		label = "White Widow 2g",
		weight = 200,
		stack = true,
		close = false,
		description = "Um saco de maconha com 2g de White Widow",
		client = {
			image = "weed_baggy.png",
		}
	},
	
	["laptop"] = {
		label = "Laptop",
		weight = 4000,
		stack = true,
		close = true,
		description = "Laptop caro",
		client = {
			image = "laptop.png",
		}
	},
	
	["ifaks"] = {
		label = "Kit de Primeiros Socorros",
		weight = 200,
		stack = true,
		close = true,
		description = "Kits de primeiros socorros para curar e reduzir o estresse.",
		client = {
			image = "ifaks.png",
		}
	},
	
	["pinger"] = {
		label = "Localizador",
		weight = 1000,
		stack = true,
		close = true,
		description = "Com um localizador e seu telefone, você pode enviar sua localização",
		client = {
			image = "pinger.png",
		}
	},
	
	["aluminum"] = {
		label = "Alumínio",
		weight = 100,
		stack = true,
		close = false,
		description = "Belas peças de metal que você provavelmente pode usar para algo",
		client = {
			image = "aluminum.png",
		}
	},
	
	["tablet"] = {
		label = "Tablet",
		weight = 2000,
		stack = true,
		close = true,
		description = "Tablet caro",
		client = {
			image = "tablet.png",
		}
	},
	
	["painkillers"] = {
		label = "Analgésicos",
		weight = 0,
		stack = true,
		close = true,
		description = "Para a dor que você não aguenta mais, tome esta pílula que vai fazer você se sentir bem novamente",
		client = {
			image = "painkillers.png",
		}
	},
	
	["thermite"] = {
		label = "Termite",
		weight = 1000,
		stack = true,
		close = true,
		description = "Às vezes você deseja que tudo queime",
		client = {
			image = "thermite.png",
		}
	},
	
	["glass"] = {
		label = "Vidro",
		weight = 100,
		stack = true,
		close = false,
		description = "É muito frágil, cuidado",
		client = {
			image = "glass.png",
		}
	},
	
	["drill"] = {
		label = "Furadeira",
		weight = 20000,
		stack = true,
		close = false,
		description = "A verdadeira...",
		client = {
			image = "drill.png",
		}
	},
	
	["security_card_01"] = {
		label = "Cartão de Segurança A",
		weight = 0,
		stack = true,
		close = true,
		description = "Um cartão de segurança... Me pergunto para o que serve",
		client = {
			image = "security_card_01.png",
		}
	},
	
	["armor"] = {
		label = "Armadura",
		weight = 5000,
		stack = true,
		close = true,
		description = "Um pouco de proteção não faz mal... certo?",
		client = {
			image = "armor.png",
		}
	},
	
	["oxy"] = {
		label = "Oxy com Prescrição",
		weight = 0,
		stack = true,
		close = true,
		description = "O rótulo foi arrancado",
		client = {
			image = "oxy.png",
		}
	},
	
	["rolex"] = {
		label = "Relógio Dourado",
		weight = 1500,
		stack = true,
		close = true,
		description = "Um relógio de ouro parece ser o jackpot para mim!",
		client = {
			image = "rolex.png",
		}
	},
	
	["weed_ak47"] = {
		label = "AK47 2g",
		weight = 200,
		stack = true,
		close = false,
		description = "Um saco de maconha com 2g de AK47",
		client = {
			image = "weed_baggy.png",
		}
	},
	
	["screwdriverset"] = {
		label = "Kit de Ferramentas",
		weight = 1000,
		stack = true,
		close = false,
		description = "Muito útil para aparafusar... parafusos...",
		client = {
			image = "screwdriverset.png",
		}
	},
	
	["whiskey"] = {
		label = "Whiskey",
		weight = 500,
		stack = true,
		close = true,
		description = "Para todos os sedentos por aí",
		client = {
			image = "whiskey.png",
		}
	},
	
	["grape"] = {
		label = "Uva",
		weight = 100,
		stack = true,
		close = false,
		description = "Mmmmh deliciosas, uvas",
		client = {
			image = "grape.png",
		}
	},
	
	["nitrous"] = {
		label = "Óxido Nitroso",
		weight = 1000,
		stack = true,
		close = true,
		description = "Acelere, pedal do acelerador! :D",
		client = {
			image = "nitrous.png",
		}
	},
	
	["firework1"] = {
		label = "2 Irmãos",
		weight = 1000,
		stack = true,
		close = true,
		description = "Fogos de artifício",
		client = {
			image = "firework1.png",
		}
	},
	
	["repairkit"] = {
		label = "Kit de Reparo",
		weight = 2500,
		stack = true,
		close = true,
		description = "Uma caixa de ferramentas com coisas para reparar seu veículo",
		client = {
			image = "repairkit.png",
		}
	},
	
	["firework3"] = {
		label = "Apaga Tudo",
		weight = 1000,
		stack = true,
		close = true,
		description = "Fogos de artifício",
		client = {
			image = "firework3.png",
		}
	},
	
	["firework2"] = {
		label = "Estaladores",
		weight = 1000,
		stack = true,
		close = true,
		description = "Fogos de artifício",
		client = {
			image = "firework2.png",
		}
	},
	
	["iphone"] = {
		label = "iPhone",
		weight = 1000,
		stack = true,
		close = true,
		description = "Telefone muito caro",
		client = {
			image = "iphone.png",
		}
	},
	
	["antipatharia_coral"] = {
		label = "Antipatharia",
		weight = 1000,
		stack = true,
		close = true,
		description = "Também conhecido como corais negros ou corais espinhosos",
		client = {
			image = "antipatharia_coral.png",
		}
	},	

	["electronickit"] = {
		label = "Kit Eletrônico",
		weight = 100,
		stack = true,
		close = true,
		description = "Se você sempre quis construir um robô, talvez possa começar por aqui. Quem sabe você se torne o novo Elon Musk?",
		client = {
			image = "electronickit.png",
		}
	},
	
	["coffee"] = {
		label = "Café",
		weight = 200,
		stack = true,
		close = true,
		description = "Aumenta 4 de cafeína",
		client = {
			image = "coffee.png",
		}
	},
	
	["diving_fill"] = {
		label = "Tubo de Mergulho",
		weight = 3000,
		stack = false,
		close = true,
		client = {
			image = "diving_tube.png",
		}
	},
	
	["certificate"] = {
		label = "Certificado",
		weight = 0,
		stack = true,
		close = true,
		description = "Certificado que prova que você possui certas coisas",
		client = {
			image = "certificate.png",
		}
	},
	
	["filled_evidence_bag"] = {
		label = "Saco de Evidências",
		weight = 200,
		stack = false,
		close = false,
		description = "Um saco de evidências cheio para descobrir quem cometeu o crime >:(",
		client = {
			image = "evidence.png",
		}
	},
	
	["coke_small_brick"] = {
		label = "Pacote de Cocaína",
		weight = 350,
		stack = false,
		close = true,
		description = "Pequeno pacote de cocaína, usado principalmente para transações e ocupa muito espaço",
		client = {
			image = "coke_small_brick.png",
		}
	},
	
	["notepad"] = {
		label = "Bloco de Notas",
		weight = 0,
		stack = false,
		close = true,
		consume = 0,
		description = "Algumas vezes você precisa se lembrar de algo importante :)",
		server = {
			export = 'mri_Qnotes.notepad',
		},
	},
	
	["tornnote"] = {
		label = "Anotação",
		weight = 0,
		stack = false,
		close = false,
	},
	
	['camera'] = {
		label = 'Câmera',
		weight = 1500,
		stack = false,
		close = true,
		description = "Uma câmera profissional para tirar uma foto discreta da esposa do seu vizinho!"
	},
	
	['photo'] = {
		label = 'Foto',
		weight = 100,
		stack = true,
		close = true,
		buttons = {
			{
				label = 'Editar',
				action = function(slot)
					exports.qbx_camera:EditPicture(slot)
				end
			},
			{
				label = 'Obter Link',
				action = function(slot)
					exports.qbx_camera:CopyURL(slot)
				end
			}
		},
		description = "Uma foto tirada com uma câmera."
	},
	
	['wood'] = {
		label = 'Madeira',
		weight = 1,
		stack = true,
		close = true,
		description = nil
	},
	
	['metal'] = {
		label = 'Metal',
		weight = 1,
		stack = true,
		close = true,
		description = nil
	},
	
	['rope'] = {
		label = 'Corda',
		weight = 1,
		stack = true,
		close = true,
		description = nil
	},
	
	['shovel'] = {
		label = 'Pá',
		weight = 1,
		stack = true,
		close = true,
		description = nil
	},
	
	["bag"] = {
		label = "Bolsa",
		weight = 1000,
		stack = false,
		close = false,
		description = "Uma bolsa bem grande para carregar todo tipo de objeto",
		client = {
			image = "bag.png",
		}
	},	

	-- ND_Police
	["shield"] = {
		label = "Escudo Policial",
		weight = 8000,
		stack = false,
		consume = 0,
		client = {
			export = "ND_Police.useShield",
			add = function(total)
				if total > 0 then
					pcall(function() return exports["ND_Police"]:hasShield(true) end)
				end
			end,
			remove = function(total)
				if total < 1 then
					pcall(function() return exports["ND_Police"]:hasShield(false) end)
				end
			end
		}
	},
	["spikestrip"] = {
		label = "Fita de Espinho",
		weight = 500,
		client = {
			export = "ND_Police.deploySpikestrip"
		}
	},
	["cuffs"] = {
		label = "Algemas",
		weight = 150,
		client = {
			export = "ND_Police.cuff"
		}
	},
	["zipties"] = {
		label = "Abraçadeiras de Nylon",
		weight = 10,
		client = {
			export = "ND_Police.ziptie"
		}
	},
	["tools"] = {
		label = "Ferramentas",
		description = "Podem ser usadas para ligar veículos.",
		weight = 800,
		consume = 1,
		stack = true,
		close = true,
		client = {
			export = "ND_Core.hotwire",
			event = "ND_Police:unziptie"
		}
	},
	["handcuffkey"] = {
		label = "Chave de Algema",
		weight = 10,
		client = {
			export = "ND_Police.uncuff"
		}
	},
	["casing"] = {
		label = "Estojo de Bala"
	},
	["projectile"] = {
		label = "Projétil"
	},
	
	-- lunar_garages
	['contract'] = {
		label = 'Contrato',
		weight = 100,
		stack = true
	},
	
	-- ars_ambulancejob
	['medicalbag'] = {
		label = 'Bolsa de Primeiros Socorros',
		weight = 220,
		stack = true,
		description = "Um kit médico abrangente para tratar ferimentos e doenças.",
	},
	
	['bandage'] = {
		label = 'Bandagem',
		weight = 100,
		stack = true,
		description = "Uma simples bandagem usada para cobrir e proteger ferimentos.",
	},
	
	['defibrillator'] = {
		label = 'Desfibrilador',
		weight = 100,
		stack = true,
		description = "Usado para reviver pacientes.",
	},
	
	['tweezers'] = {
		label = 'Pinças',
		weight = 100,
		stack = true,
		description = "Pinças de precisão para remover objetos estranhos, como balas, de ferimentos com segurança.",
	},
	
	['burncream'] = {
		label = 'Creme para Queimaduras',
		weight = 100,
		stack = true,
		description = "Creme especializado para tratar e aliviar queimaduras leves e irritações na pele.",
	},
	
	['suturekit'] = {
		label = 'Kit de Sutura',
		weight = 100,
		stack = true,
		description = "Um kit contendo ferramentas cirúrgicas e materiais para suturar e fechar ferimentos.",
	},
	
	['icepack'] = {
		label = 'Pacote de Gelo',
		weight = 200,
		stack = true,
		description = "Um pacote de gelo usado para reduzir o inchaço e fornecer alívio da dor e inflamação.",
	},
	
	['stretcher'] = {
		label = 'Maca',
		weight = 200,
		stack = true,
		description = "Um maca usada para mover pacientes que precisam de cuidados médicos.",
	},
	
	['emstablet'] = {
		label = 'Tablet de EMS',
		weight = 200,
		stack = true,
		client = {
			export = 'ars_ambulancejob.openDistressCalls'
		}
	},

	--ars_hunting
	['animal_tracker'] = {
		label = 'Rastreador de Animais',
		weight = 200,
		allowArmed = true,
		stack = false,
	},
	['campfire'] = {
		label = 'Fogueira',
		weight = 200,
		allowArmed = true,
		stack = false,
	},
	
	['huntingbait'] = {
		label = 'Isca de Caça',
		weight = 100,
		allowArmed = true,
	},
	
	['cooked_meat'] = {
		label = 'Carne Cozida',
		weight = 200,
	},
	['raw_meat'] = {
		label = 'Carne Crua',
		weight = 200,
	},
	
	['skin_deer_ruined'] = {
		label = 'Pele de Veado Rasgada',
		weight = 200,
		stack = false,
	},
	['skin_deer_low'] = {
		label = 'Pele de Veado Desgastada',
		weight = 200,
	},
	['skin_deer_medium'] = {
		label = 'Pele de Veado Macia',
		weight = 200,
	},
	['skin_deer_good'] = {
		label = 'Pele de Veado de Qualidade',
		weight = 200,
	},
	['skin_deer_perfect'] = {
		label = 'Pele de Veado Impecável',
		weight = 200,
	},
	
	['deer_horn'] = {
		label = 'Chifre de Veado',
		weight = 1000,
	},
	
	["racing_gps"] = {
		label = "GPS de Corrida",
		weight = 500,
		stack = false,
		close = true,
		description = "Vrum vrum.",
		client = {
			image = "racing_gps.png",
		}
	},

	-- Alguns exemplos de mochila
	["backpack1"] = {
		label = "Mochila 1",
		weight = 15,
		stack = false,
		close = true,
		description = "Uma mochila estilosa"
	},
	["backpack2"] = {
		label = "Mochila 2",
		weight = 15,
		stack = false,
		close = true,
		description = "Uma mochila estilosa"
	},
	["duffle1"] = {
		label = "Bolsa de Viagem",
		weight = 15,
		stack = false,
		close = true,
		description = "Uma bolsa de viagem estilosa"
	},
	["briefcase"] = {
		label = "Maleta",
		weight = 10,
		stack = false,
		close = true,
		description = "Um estojo retangular portátil usado para transportar documentos importantes, arquivos ou outros pertences pessoais."
	},
	["paramedicbag"] = {
		label = "Bolsa de Paramédico",
		weight = 5,
		stack = false,
		close = true,
		description = "Uma bolsa médica usada por paramédicos, contendo suprimentos essenciais para atendimento de emergência."
	},
	["policepouches"] = {
		label = "Bolsa da Polícia",
		weight = 5,
		stack = false,
		close = true,
		description = "Uma bolsa usada por policiais para armazenar e transportar suprimentos essenciais, como algemas, spray de pimenta e outros equipamentos táticos."
	},
	["policepouches1"] = {
		label = "Bolsa da Polícia",
		weight = 5,
		stack = false,
		close = true,
		description = "Uma versão maior da bolsa da polícia usada para armazenar equipamentos e materiais táticos adicionais."
	},

	["briefcaselockpicker"] = {
		label = "Lockpick para Maleta",
		weight = 0.5,
		stack = true,
		close = true,
		description = "Lockpick para Maleta"
	},

	["syphoningkit"] = {
		label = "Kit de Sifonagem",
		weight = 5000,
		stack = false,
		close = false,
		description = "Um kit feito para sifonar gasolina de veículos.",
		client = {
			image = "syphoningkit.png",
		}
	},
	
	["jerrycan"] = {
		label = "Lata Jerry",
		weight = 15000,
		stack = false,
		close = false,
		description = "Uma lata Jerry feita para armazenar gasolina.",
		client = {
			image = "jerrycan.png",
		}
	},
	
	["notebook"] = {
		label = "Diário",
		weight = 15000,
		stack = false,
		close = false,
		description = "Um diário para escrever.",
		client = {
			image = "notebook.png",
		}
	},
	
	-- jim_mining
	
	["silverearring"] = {
		label = "Brincos de Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "silver_earring.png",
		}
	},
	
	["mininglaser"] = {
		label = "Laser de Mineração",
		weight = 900,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "mininglaser.png",
		}
	},
	
	["stone"] = {
		label = "Pedra",
		weight = 2000,
		stack = true,
		close = false,
		description = "Pedra woo",
		client = {
			image = "stone.png",
		}
	},
	
	["diamond_necklace"] = {
		label = "Colar de Diamante",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "diamond_necklace.png",
		}
	},
	
	["drillbit"] = {
		label = "Broca",
		weight = 10,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "drillbit.png",
		}
	},
	
	["silveringot"] = {
		label = "Lingote de Prata",
		weight = 1000,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "silveringot.png",
		}
	},
	
	["emerald_ring"] = {
		label = "Anel de Esmeralda",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "emerald_ring.png",
		}
	},
	
	["emerald_necklace_silver"] = {
		label = "Colar de Esmeralda Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "emerald_necklace_silver.png",
		}
	},
	
	["ruby_ring_silver"] = {
		label = "Anel de Rubi Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "ruby_ring_silver.png",
		}
	},
	
	["sapphire_necklace_silver"] = {
		label = "Colar de Safira Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "sapphire_necklace_silver.png",
		}
	},
	
	["emerald_earring_silver"] = {
		label = "Brincos de Esmeralda Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "emerald_earring_silver.png",
		}
	},
	
	["ruby"] = {
		label = "Rubi",
		weight = 100,
		stack = true,
		close = false,
		description = "Um Rubi que brilha",
		client = {
			image = "ruby.png",
		}
	},
	
	["ruby_ring"] = {
		label = "Anel de Rubi",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "ruby_ring.png",
		}
	},
	
	["miningdrill"] = {
		label = "Broca de Mineração",
		weight = 1000,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "miningdrill.png",
		}
	},
	
	["emerald"] = {
		label = "Esmeralda",
		weight = 100,
		stack = true,
		close = false,
		description = "Uma Esmeralda que brilha",
		client = {
			image = "emerald.png",
		}
	},
	
	["sapphire_earring_silver"] = {
		label = "Brincos de Safira Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "sapphire_earring_silver.png",
		}
	},
	
	["ruby_necklace_silver"] = {
		label = "Colar de Rubi Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "ruby_necklace_silver.png",
		}
	},
	
	["uncut_sapphire"] = {
		label = "Safira Bruta",
		weight = 100,
		stack = true,
		close = false,
		description = "Uma Safira bruta",
		client = {
			image = "uncut_sapphire.png",
		}
	},
	
	["can"] = {
		label = "Lata Vazia",
		weight = 10,
		stack = true,
		close = false,
		description = "Uma lata vazia, boa para reciclagem",
		client = {
			image = "can.png",
		}
	},
	
	["ruby_earring_silver"] = {
		label = "Brincos de Rubi Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "ruby_earring_silver.png",
		}
	},
	
	["uncut_ruby"] = {
		label = "Rubi Bruto",
		weight = 100,
		stack = true,
		close = false,
		description = "Um Rubi bruto",
		client = {
			image = "uncut_ruby.png",
		}
	},
	
	["ruby_earring"] = {
		label = "Brincos de Rubi",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "ruby_earring.png",
		}
	},
	
	["goldpan"] = {
		label = "Bandeja de Garimpagem de Ouro",
		weight = 10,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "goldpan.png",
		}
	},
	
	["emerald_ring_silver"] = {
		label = "Anel de Esmeralda Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "emerald_ring_silver.png",
		}
	},
	
	["ruby_necklace"] = {
		label = "Colar de Rubi",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "ruby_necklace.png",
		}
	},
	
	["diamond_earring_silver"] = {
		label = "Brincos de Diamante Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "diamond_earring_silver.png",
		}
	},
	
	["diamond_necklace_silver"] = {
		label = "Colar de Diamante Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "diamond_necklace_silver.png",
		}
	},
	
	["emerald_necklace"] = {
		label = "Colar de Esmeralda",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "emerald_necklace.png",
		}
	},
	
	["ironore"] = {
		label = "Minério de Ferro",
		weight = 1000,
		stack = true,
		close = false,
		description = "Ferro, um minério base.",
		client = {
			image = "ironore.png",
		}
	},
	
	["sapphire_earring"] = {
		label = "Brincos de Safira",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "sapphire_earring.png",
		}
	},
	
	["pickaxe"] = {
		label = "Picareta",
		weight = 1000,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "pickaxe.png",
		}
	},
	
	["diamond_earring"] = {
		label = "Brincos de Diamante",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "diamond_earring.png",
		}
	},
	
	["goldingot"] = {
		label = "Lingote de Ouro",
		weight = 1000,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "goldingot.png",
		}
	},
	
	["goldearring"] = {
		label = "Brincos de Ouro",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "gold_earring.png",
		}
	},
	
	["emerald_earring"] = {
		label = "Brincos de Esmeralda",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "emerald_earring.png",
		}
	},
	
	["carbon"] = {
		label = "Carbono",
		weight = 1000,
		stack = true,
		close = false,
		description = "Carbono, um minério base.",
		client = {
			image = "carbon.png",
		}
	},	

	["sapphire_necklace"] = {
		label = "Colar de Safira",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "sapphire_necklace.png",
		}
	},
	
	["bottle"] = {
		label = "Garrafa Vazia",
		weight = 10,
		stack = true,
		close = false,
		description = "Uma garrafa de vidro",
		client = {
			image = "bottle.png",
		}
	},
	
	["uncut_diamond"] = {
		label = "Diamante Bruto",
		weight = 100,
		stack = true,
		close = false,
		description = "Um diamante bruto",
		client = {
			image = "uncut_diamond.png",
		}
	},
	
	["goldore"] = {
		label = "Minério de Ouro",
		weight = 1000,
		stack = true,
		close = false,
		description = "Minério de Ouro",
		client = {
			image = "goldore.png",
		}
	},
	
	["silver_ring"] = {
		label = "Anel de Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "silver_ring.png",
		}
	},
	
	["sapphire_ring_silver"] = {
		label = "Anel de Safira Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "sapphire_ring_silver.png",
		}
	},
	
	["sapphire_ring"] = {
		label = "Anel de Safira",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "sapphire_ring.png",
		}
	},
	
	["gold_ring"] = {
		label = "Anel de Ouro",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "gold_ring.png",
		}
	},
	
	["silverore"] = {
		label = "Minério de Prata",
		weight = 1000,
		stack = true,
		close = false,
		description = "Minério de Prata",
		client = {
			image = "silverore.png",
		}
	},
	
	["uncut_emerald"] = {
		label = "Esmeralda Bruta",
		weight = 100,
		stack = true,
		close = false,
		description = "Uma esmeralda bruta",
		client = {
			image = "uncut_emerald.png",
		}
	},
	
	["silverchain"] = {
		label = "Corrente de Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "silverchain.png",
		}
	},
	
	["copperore"] = {
		label = "Minério de Cobre",
		weight = 1000,
		stack = true,
		close = false,
		description = "Cobre, um minério base.",
		client = {
			image = "copperore.png",
		}
	},
	
	["sapphire"] = {
		label = "Safira",
		weight = 100,
		stack = true,
		close = false,
		description = "Uma safira que brilha",
		client = {
			image = "sapphire.png",
		}
	},
	
	["diamond_ring_silver"] = {
		label = "Anel de Diamante Prata",
		weight = 200,
		stack = true,
		close = false,
		description = "",
		client = {
			image = "diamond_ring_silver.png",
		}
	},

	----- pickles farm
	['corn_seed'] = {
		label = 'Semente de Milho',
		weight = 1,
		stack = true,
		close = true,
		description = "Esta é uma semente que cresce milho."
	},
	
	['corn_raw'] = {
		label = 'Milho Cru',
		weight = 1,
		stack = true,
		close = true,
		description = "Você precisará processar isso."
	},
	
	['corn'] = {
		label = 'Milho',
		weight = 1,
		stack = true,
		close = true,
	},
	
	['tomato_seed'] = {
		label = 'Semente de Tomate',
		weight = 1,
		stack = true,
		close = true,
		description = "Esta é uma semente que cresce tomate."
	},
	
	['tomato_raw'] = {
		label = 'Tomate Cru',
		weight = 1,
		stack = true,
		close = true,
		description = "Você precisará processar isso."
	},
	
	['tomato'] = {
		label = 'Tomate',
		weight = 1,
		stack = true,
		close = true,
	},
	
	['wheat_seed'] = {
		label = 'Semente de Trigo',
		weight = 1,
		stack = true,
		close = true,
		description = "Esta é uma semente que cresce trigo."
	},
	
	['wheat_raw'] = {
		label = 'Trigo Cru',
		weight = 1,
		stack = true,
		close = true,
		description = "Você precisará processar isso."
	},
	
	['wheat'] = {
		label = 'Trigo',
		weight = 1,
		stack = true,
		close = true,
	},
	
	['broccoli_seed'] = {
		label = 'Semente de Brócolis',
		weight = 1,
		stack = true,
		close = true,
		description = "Esta é uma semente que cresce brócolis."
	},
	
	['broccoli_raw'] = {
		label = 'Brócolis Cru',
		weight = 1,
		stack = true,
		close = true,
		description = "Você precisará processar isso."
	},
	
	['broccoli'] = {
		label = 'Brócolis',
		weight = 1,
		stack = true,
		close = true,
	},
	
	['carrot_seed'] = {
		label = 'Semente de Cenoura',
		weight = 1,
		stack = true,
		close = true,
		description = "Esta é uma semente que cresce cenoura."
	},
	
	['carrot_raw'] = {
		label = 'Cenoura Crua',
		weight = 1,
		stack = true,
		close = true,
		description = "Você precisará processar isso."
	},
	
	['carrot'] = {
		label = 'Cenoura',
		weight = 1,
		stack = true,
		close = true,
	},
	
	['potato_seed'] = {
		label = 'Semente de Batata',
		weight = 1,
		stack = true,
		close = true,
		description = "Esta é uma semente que cresce batata."
	},
	
	['potato_raw'] = {
		label = 'Batata Crua',
		weight = 1,
		stack = true,
		close = true,
		description = "Você precisará processar isso."
	},
	
	['potato'] = {
		label = 'Batata',
		weight = 1,
		stack = true,
		close = true,
	},
	
	['pickle_seed'] = {
		label = 'Semente de Picles',
		weight = 1,
		stack = true,
		close = true,
		description = "Esta é uma semente que cresce picles."
	},
	
	['pickle_raw'] = {
		label = 'Picles Cru',
		weight = 1,
		stack = true,
		close = true,
		description = "Você precisará processar isso."
	},
	
	['pickle'] = {
		label = 'Picles',
		weight = 1,
		stack = true,
		close = true,
	},
	
	['weed_seed'] = {
		label = 'Semente de Erva Daninha',
		weight = 1,
		stack = true,
		close = true,
		description = "Esta é uma semente que cresce erva daninha."
	},
	
	['weed_raw'] = {
		label = 'Erva Daninha Crua',
		weight = 1,
		stack = true,
		close = true,
		description = "Você precisará processar isso."
	},
	
	['weed'] = {
		label = 'Erva Daninha',
		weight = 1,
		stack = true,
		close = true,
	},
	
	['cocaine_seed'] = {
		label = 'Semente de Cocaína',
		weight = 1,
		stack = true,
		close = true,
		description = "Esta é uma semente que cresce cocaína."
	},
	
	['cocaine_raw'] = {
		label = 'Cocaína Crua',
		weight = 1,
		stack = true,
		close = true,
		description = "Você precisará processar isso."
	},
	
	['cocaine'] = {
		label = 'Cocaína',
		weight = 1,
		stack = true,
		close = true,
	},
	
	['heroin_seed'] = {
		label = 'Semente de Heroína',
		weight = 1,
		stack = true,
		close = true,
		description = "Esta é uma semente que cresce heroína."
	},
	
	['heroin_raw'] = {
		label = 'Heroína Crua',
		weight = 1,
		stack = true,
		close = true,
		description = "Você precisará processar isso."
	},
	
	['heroin'] = {
		label = 'Heroína',
		weight = 1,
		stack = true,
		close = true,
	},
	
	['garden_pitcher'] = {
		label = 'Jarra de Jardim',
		weight = 1,
		stack = true,
		close = true,
	},
	
	['garden_shovel'] = {
		label = 'Pá de Jardim',
		weight = 1,
		stack = true,
		close = true,
	},	

	---- mm_carkeys
	["vehiclekey"] = {
		label = "Chave de Veículo",
		description = 'Esta é uma chave do carro, cuide bem, se você a perder, provavelmente não poderá usar seu carro',
		weight = 10,
		stack = false
	},
	
	["keybag"] = {
		label = "Bolsa de Chaves",
		description = 'Esta é uma bolsa de chaves, você pode armazenar todas as suas chaves',
		weight = 10,
		stack = false
	},

	---- lunar_fishing
	['basic_rod'] = { label = 'Vara de pesca', stack = false, weight = 250 },

	['graphite_rod'] = { label = 'Vara de grafite', stack = false, weight = 350 },
	
	['titanium_rod'] = { label = 'Vara de titânio', stack = false, weight = 450 },
	
	['worms'] = { label = 'Minhocas', weight = 10 },
	
	['artificial_bait'] = { label = 'Isca artificial', weight = 30 },
	
	['anchovy'] = { label = 'Anchova', weight = 20 },
	
	['grouper'] = { label = 'Garoupa', weight = 3500 },
	
	['haddock'] = { label = 'Haddock', weight = 500 },
	
	['mahi_mahi'] = { label = 'Dourado', weight = 3500 },
	
	['piranha'] = { label = 'Pirarucu', weight = 1500 },
	
	['red_snapper'] = { label = 'Pargo-vermelho', weight = 2500 },
	
	['salmon'] = { label = 'Salmão', weight = 1000 },
	
	['shark'] = { label = 'Tubarão', weight = 7500 },
	
	['trout'] = { label = 'Truta', weight = 750 },
	
	['tuna'] = { label = 'Atum', weight = 10000 },
	
	-- cw-driftchip
	["driftchip"] = {
		label = "Drift Chip",
		weight = 300,
		degade = 21000,
		stack = true,
		close = true,
		allowArmed = true,
		description = "Use isso para ajustar a ECU para ativar ou desativar o modo de drift",
	},
	["driftchipbox"] = {
		label = "Drift Chip Box",
		weight = 350,
		stack = true,
		close = true,
		allowArmed = true,
		description = "Contém um chip de drift",
	},

	-- lation sprays
	["recyclablematerial"] = {
		label = "Recycle Box",
		weight = 100,
		stack = true,
		close = false,
		description = "A box of Recyclable Materials",
		client = {
			image = "recyclablematerial.png",
		}
	},

	["blue_green_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Blue Green Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_monika"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Monika",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_hsw"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta HSW",
		client = {
			image = "exoticspray.png",
		}
	},

	["red_rainbo_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Red Rainbow Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["anod_green"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Anod Green",
		client = {
			image = "exoticspray.png",
		}
	},

	["anod_wine"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Anod Wine",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_bubblegum"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Bubblegum",
		client = {
			image = "exoticspray.png",
		}
	},

	["coppe_purp_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Copper Purple Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["darkbluepearl"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Dark Blue Pearl",
		client = {
			image = "exoticspray.png",
		}
	},

	["white_holo"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "White Holographic",
		client = {
			image = "exoticspray.png",
		}
	},

	["green_prisma"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Green Prismatic",
		client = {
			image = "exoticspray.png",
		}
	},

	["green_brow_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Green Brown Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["green_red_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Green Red Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["pink_pearl"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Pink Pearl",
		client = {
			image = "exoticspray.png",
		}
	},

	["orang_purp_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Orange Purple Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["white_prisma"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "White Prismatic",
		client = {
			image = "exoticspray.png",
		}
	},

	["oil_slic_prisma"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Oil Slick Prismatic",
		client = {
			image = "exoticspray.png",
		}
	},

	["purp_red_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Purple Red Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["yellow_pearl"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Yellow Pearl",
		client = {
			image = "exoticspray.png",
		}
	},

	["green_pearl"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Green Pearl",
		client = {
			image = "exoticspray.png",
		}
	},

	["anod_copper"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Anod Copper",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_four_seaso"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Four Seasons",
		client = {
			image = "exoticspray.png",
		}
	},

	["blue_pearl"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Blue Pearl",
		client = {
			image = "exoticspray.png",
		}
	},

	["lit_blue_pearl"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Luminous Blue Pearl",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_sunsets"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Sunsets",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_vice_city"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Vice City",
		client = {
			image = "exoticspray.png",
		}
	},

	["anod_red"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Anod Red",
		client = {
			image = "exoticspray.png",
		}
	},

	["darkpurpprisma"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Dark Purple Prismatic",
		client = {
			image = "exoticspray.png",
		}
	},

	["green_purp_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Green Purple Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["lit_green_pearl"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Luminous Green Pearl",
		client = {
			image = "exoticspray.png",
		}
	},

	["anod_lime"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Anod Lime",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_temperatur"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Temperature",
		client = {
			image = "exoticspray.png",
		}
	},

	["blue_pink_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Blue Pink Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["anod_blue"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Anod Blue",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_the_seven"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta The Seven",
		client = {
			image = "exoticspray.png",
		}
	},

	["hot_pink_prisma"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Hot Pink Prismatic",
		client = {
			image = "exoticspray.png",
		}
	},

	["orang_blue_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Orange Blue Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["blu_rainbo_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Blue Rainbow Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["darkblueprisma"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Dark Blue Prismatic",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_electro"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Electro",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_verlierer2"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Verlierer II",
		client = {
			image = "exoticspray.png",
		}
	},

	["green_blue_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Green Blue Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_sprunk_ex"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Sprunk Ex",
		client = {
			image = "exoticspray.png",
		}
	},

	["magen_oran_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Magenta Orange Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["magen_gree_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Magenta Green Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["graphite_prisma"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Graphite Prismatic",
		client = {
			image = "exoticspray.png",
		}
	},

	["turq_red_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Turquoise Red Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["red_prisma"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Red Prismatic",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_nite_day"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Nite & Day",
		client = {
			image = "exoticspray.png",
		}
	},

	["oil_slick_pearl"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Oil Slick Pearl",
		client = {
			image = "exoticspray.png",
		}
	},

	["teal_purp_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Teal Purple Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["magen_cyan_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Magenta Cyan Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["white_purp_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "White Purple Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_fubuki"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Fubuki",
		client = {
			image = "exoticspray.png",
		}
	},

	["anod_bronze"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Anod Bronze",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_kamenrider"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Kamen Rider",
		client = {
			image = "exoticspray.png",
		}
	},

	["burg_green_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Burgundy Green Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["cream_pearl"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Cream Pearl",
		client = {
			image = "exoticspray.png",
		}
	},

	["cyan_purp_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Cyan Purple Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["darkpurplepearl"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Dark Purple Pearl",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_christmas"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Christmas",
		client = {
			image = "exoticspray.png",
		}
	},

	["purp_green_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Purple Green Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["red_orangeflip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Red Orange Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["turq_purp_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Turquoise Purple Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["green_turq_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Green Turquoise Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_full_rbow"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Full Rainbow",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_m9_throwba"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta M9 Throwback",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_synthwave"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Synthwave",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_chromabera"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta ChromaBera",
		client = {
			image = "exoticspray.png",
		}
	},

	["black_holo"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Black Holographic",
		client = {
			image = "exoticspray.png",
		}
	},

	["magen_yell_flip"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Magenta Yellow Flip",
		client = {
			image = "exoticspray.png",
		}
	},

	["anod_gold"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Anod Gold",
		client = {
			image = "exoticspray.png",
		}
	},

	["ykta_monochrome"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Ykta Monochrome",
		client = {
			image = "exoticspray.png",
		}
	},

	["rainbow_prisma"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Rainbow Prismatic",
		client = {
			image = "exoticspray.png",
		}
	},

	["anod_champagne"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Anod Champagne",
		client = {
			image = "exoticspray.png",
		}
	},

	["black_prisma"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Black Prismatic",
		client = {
			image = "exoticspray.png",
		}
	},

	["anod_purple"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Anod Purple",
		client = {
			image = "exoticspray.png",
		}
	},

	["darktealpearl"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Dark Teal Pearl",
		client = {
			image = "exoticspray.png",
		}
	},

	["lit_purp_pearl"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Luminous Purple Pearl",
		client = {
			image = "exoticspray.png",
		}
	},

	["darkgreenpearl"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Dark Green Pearl",
		client = {
			image = "exoticspray.png",
		}
	},

	["lit_pink_pearl"] = {
		label = "Exotic Spray can",
		weight = 200,
		stack = true,
		close = true,
		description = "Luminous Pink Pearl",
		client = {
			image = "exoticspray.png",
		}
	},

	-- kloud-farmjob
	['trowel'] = {
		label = 'Trowel',
		weight = 500,
		decay = true,
		stack = false,
		close = false,
		description = 'Diggy Diggy Diggy?',
	},
	
	['shovel'] = {
		label = 'Shovel',
		weight = 1000,
		decay = true,
		stack = false,
		close = false,
		description = 'Diggy Diggy Diggy?',
	},
	
	['dirty_potato'] = {
		label = 'Dirty Potato',
		weight = 250,
		degrade = 7160,
		decay = true,
		stack = true,
		close = false,
		description = 'Potato potato but dirty dirty?',
	},
	
	['potato'] = {
		label = 'Potato',
		weight = 250,
		degrade = 7160,
		decay = true,
		stack = true,
		close = false,
		description = 'Potato potato?',
	},
	
	['dirty_cabbage'] = {
		label = 'Dirty Cabbage',
		weight = 250,
		degrade = 7160,
		decay = true,
		stack = true,
		close = false,
		description = 'Cabby cabby but dirty dirty?',
	},
	
	['cabbage'] = {
		label = 'Cabbage',
		weight = 250,
		degrade = 7160,
		decay = true,
		stack = true,
		close = false,
		description = 'Cabby cabby?',
	},
	
	['dirty_tomato'] = {
		label = 'Dirty Tomato',
		weight = 250,
		degrade = 7160,
		decay = true,
		stack = true,
		close = false,
		description = 'To-ma-to but dirty',
	},
	
	['tomato'] = {
		label = 'Tomato',
		weight = 250,
		degrade = 7160,
		decay = true,
		stack = true,
		close = false,
		description = 'To-ma-to',
	},
	
	['dirty_orange'] = {
		label = 'Dirty Orange',
		weight = 250,
		degrade = 7160,
		decay = true,
		stack = true,
		close = false,
		description = 'It talks!!!!',
	},
	
	['orange'] = {
		label = 'Orange',
		weight = 250,
		degrade = 7160,
		decay = true,
		stack = true,
		close = false,
		description = 'It talks!!!!',
	},
	
	['dirty_coffee_beans'] = {
		label = 'Dirty Coffee Beans',
		weight = 250,
		degrade = 7160,
		decay = true,
		stack = true,
		close = false,
		description = 'Ohh wakey wakey but dirty',
	},
	
	['coffee_beans'] = {
		label = 'Coffee Beans',
		weight = 250,
		degrade = 7160,
		decay = true,
		stack = true,
		close = false,
		description = 'Ohh wakey wakey but dirty',
	},

	--- kto-guidebook
	["guide"] = {
		label = "Guidebook",
		weight = 475,
		stack = true,
		close = true,
		description = 'Want to know the ins and outs of our server? Read our guidebook!',
	},	

	    -- ================ Keep-companion ================
		['keepcompanionhusky'] = {
			label = 'Husky',
			weight = 5000,
			stack = false,
			close = true,
			description = "Also the nickname everyone calls you behind your back."
		},
		['keepcompanionpoodle'] = {
			label = 'Poodle',
			weight = 5000,
			stack = false,
			close = true,
			description = "This dog's haircut is more expensive than your car."
		},
		['keepcompanionrottweiler'] = {
			label = 'Rottweiler',
			weight = 5000,
			stack = false,
			close = true,
			description = "A butcher's best friend."
		},
		['keepcompanionwesty'] = {
			label = 'Westie',
			weight = 5000,
			stack = false,
			close = true,
			description = "A great breed for hunting rats, and wearing cute sweaters."
		},
		['keepcompanioncat'] = {
			label = 'Cat',
			weight = 5000,
			stack = false,
			close = true,
			description = "What's new pussycat?"
		},
		['keepcompanionpug'] = {
			label = 'Pug',
			weight = 5000,
			stack = false,
			close = true,
			description = "The snorting haunts you in your sleep."
		},
		['keepcompanionretriever'] = {
			label = 'Retriever',
			weight = 5000,
			stack = false,
			close = true,
			description = "America's favorite dog."
		},
		['keepcompanionshepherd'] = {
			label = 'Border Collie',
			weight = 5000,
			stack = false,
			close = true,
			description = "Useful to heard your flock of sheep."
		},
		['keepcompanionrabbit'] = {
			label = 'Rabbit',
			weight = 5000,
			stack = false,
			close = true,
			description = "Boing boing boing boing."
		},
		['keepcompanionhen'] = {
			label = 'Hen',
			weight = 5000,
			stack = false,
			close = true,
			description = "A best friend AND lunch. Two for one!"
		},
		['keepcompanionrat'] = {
			label = 'Rat',
			weight = 5000,
			stack = false,
			close = true,
			description = "Snitches get stiches, but rats get scritches."
		},
		['keepcompanionk9unit'] = {
			label = 'K9 Unit Malinois',
			weight = 5000,
			stack = false,
			close = true,
			description = "LSPD exclusive K9."
		},
	
		---
	  --- pet items ----
		['petfood'] = {
			label = 'Pet Food',
			weight = 500,
			stack = true,
			close = true,
			description = "Nom nom for your pom pom."
		},
		['collarpet'] = {
			label = 'Pet Collar',
			weight = 500,
			stack = false,
			close = true,
			description = "Rename your pet."
		},
		['firstaidforpet'] = {
			label = 'Pet First-aid Kit',
			weight = 500,
			stack = true,
			close = true,
			description = "Bring your pet back from the dead again and again."
		},
		['petnametag'] = {
			label = 'Pet Name Tag',
			weight = 500,
			stack = true,
			close = true,
			description = "rename your pet."
		},
		['petwaterbottleportable'] = {
			label = 'Pet Water Bottle',
			weight = 500,
			stack = false,
			close = true,
			description = "Water for your pet. Stop trying to drink this."
		},
		['petgroomingkit'] = {
			label = 'Pet Grooming Kit',
			weight = 500,
			stack = false,
			close = true,
			description = "Now your pet can pass a wave check."
		},
}