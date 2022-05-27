    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        ApplicationCommandOptionType
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    const userData = require("../../schemas/userData");
    const pokemon = require("../../schemas/Pokemons");
    const {
        redeemSpawn
    } = require("../../handler/functions");

    module.exports = {
        name: 'redeem',
        description: 'View and use your available redeems you have purchased, redeem a pokémon of your own.',
        options: [{
            name: 'name',
            description: 'Spawn a pokémon from a redeem, watch out as anyone can catch this!',
            type: ApplicationCommandOptionType.String,
            required: true
        }],
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            const name = interaction.options.getString('name');

            let makeCapital = s => s.replace(/./, c => c.toUpperCase())
            const pokename = makeCapital(name);

            const pokemonfound = await pokemon.findOne({
                PokemonName: pokename
            })

            if (!pokemonfound) {
                return interaction.reply({
                    content: ':x: The Pokémon you tried to redeem spawn does not exist, please use a valid Pokémon to spawn.',
                    ephemeral: true
                })
            }

            const user = await userData.findOne({
                OwnerID: parseInt(interaction.user.id)
            });

            let arrayOfItems = [];
            for (let i = 0; i < user.Items.length; i++) {
                if (user.Items[i].ItemName === 'Redeem') {
                    arrayOfItems.push(user.Items[i])
                }
            }

            if (arrayOfItems.length === 1) {
                const redeems = arrayOfItems[0].ItemAmount;

                redeemSpawn(interaction, pokename);

                const newredeems = redeems - 1;


                if (newredeems > 0) {
                    await userData.findOneAndUpdate({
                        OwnerID: parseInt(interaction.user.id),
                        "Items.ItemName": "Redeem",
                    }, {
                        $set: {
                            "Items.$.ItemAmount": newredeems
                        }
                    })
                } else {
                    await userData.findOneAndUpdate({
                        OwnerID: parseInt(interaction.user.id),
                    }, {
                        $pull: {
                            Items: {
                                ItemName: "Redeem"
                            }
                        }
                    })
                }

                return interaction.reply({
                    content: `:white_check_mark: Successfully redeem spawned Pokémon ${pokename} and used **1** redeem. (Please note that anyone can catch the Pokémon so catch it quickly)`,
                    ephemeral: true
                })
            } else {
                return interaction.reply({
                    content: ':x: You do not have any redeems left in your inventory, purchase more from the shop.',
                    ephemeral: true
                })
            }
        }
    }