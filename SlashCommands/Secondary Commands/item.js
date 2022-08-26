    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        ApplicationCommandOptionType,
        Application
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json');
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    const userData = require("../../schemas/userData");
 
    module.exports = {
        name: 'item',
        description: 'Utilize your items you have in your bag!',
        options: [{
            name: 'use',
            description: 'Use something in your bag',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'itemname',
                description: 'The item you wish to use from your bag',
                type: ApplicationCommandOptionType.String,
                required: true
            }, {
                name: 'pokemonid',
                description: 'If the item requires a PokémonID then please enter it here!',
                type: ApplicationCommandOptionType.Integer
            }]
        }, {
            name: 'give',
            description: 'Give something in your bag to someone else',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'trainerid',
                description: 'The trainers id that you wish to transfer the item over to',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }, {
                name: 'itemname',
                description: 'The item name you wish to give someone from your bag',
                type: ApplicationCommandOptionType.String,
                required: true
            }, {
                name: 'itemamount',
                description: 'The amount of items you wish to give over to the trainer',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }]
        }],
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            if (interaction.options.getSubcommand() === "use") {
                const itemname = interaction.options.getString('itemname');
                const lowercased = itemname.toLowerCase();
                const splitted = lowercased.split(' ');
    
                let makeCapital = s => s.replace(/./, c => c.toUpperCase())
    
                let name = [];
                await splitted.forEach(constructor => {
                    name.push(makeCapital(constructor))
                });
    
                const remadeName = name.join(' ');

                const user = await userData.findOne({
                    OwnerID: parseInt(interaction.user.id)
                });

                let amountOfItem = 0;
                for (let i = 0; i < user.Items.length; i++) {
                    if (user.Items[i].ItemName === remadeName) {
                        amountOfItem = user.Items[i].ItemAmount;
                    }
                }

                const itemNames = [
                    "Rare Candy"
                ]

                if (!itemNames.includes(remadeName)) {
                    return interaction.reply({
                        content: ':x: No item with that name could be found, is that a valid item name?',
                        ephemeral: true
                    })
                }

                if (remadeName === "Rare Candy") {
                    const findSelected = await userData.findOne({
                        OwnerID: parseInt(interaction.user.id),
                        "Inventory.PokemonSelected": true
                    }, {
                        "Inventory.$": 1
                    })

                    if (amountOfItem < 1) {
                        return interaction.reply({
                            content: ':x: Looks like you do not have enough Rare Candies to do this action!',
                            ephemeral: true
                        });
                    }

                    if (findSelected.Inventory[0].PokemonData.PokemonLevel >= 100) {
                        return interaction.reply({
                            content: ':x: Your selected Pokémon might not be leveled up any further, it reached its max level!',
                            ephemeral: true
                        });
                    }

                    const newcandies = amountOfItem - 1;

                    if (newcandies > 0) {
                        await userData.findOneAndUpdate({
                            OwnerID: parseInt(interaction.user.id),
                            "Items.ItemName": "Rare Candy",
                        }, {
                            $set: {
                                "Items.$.ItemAmount": newcandies
                            }
                        })

                        await userData.findOneAndUpdate({
                            OwnerID: parseInt(interaction.user.id),
                            "Inventory.PokemonSelected": true
                        }, {
                            $inc: {
                                "Inventory.$.PokemonData.PokemonLevel": 1
                            },
                        });
                    } else {
                        await userData.findOneAndUpdate({
                            OwnerID: parseInt(interaction.user.id),
                        }, {
                            $pull: {
                                Items: {
                                    ItemName: "Rare Candy"
                                }
                            }
                        })

                        await userData.findOneAndUpdate({
                            OwnerID: parseInt(interaction.user.id),
                            "Inventory.PokemonSelected": true
                        }, {
                            $inc: {
                                "Inventory.$.PokemonData.PokemonLevel": 1
                            },
                        });
                    }

                    return interaction.reply({
                        content: `:white_check_mark: Successfully leveled up your \`${findSelected.Inventory[0].PokemonName}\` to level \`${findSelected.Inventory[0].PokemonData.PokemonLevel + 1}\`, consuming one Rare Candy as a cost! [**${newcandies}** left]`,
                        ephemeral: true
                    })
                }
            }

            if (interaction.options.getSubcommand() === "give") {
                const trainerid = interaction.options.getInteger('trainerid');
                const itemname = interaction.options.getString('itemname');
                const itemsamount = interaction.options.getInteger('itemamount');
                const lowercased = itemname.toLowerCase();
                const splitted = lowercased.split(' ');
    
                let makeCapital = s => s.replace(/./, c => c.toUpperCase())
    
                let name = [];
                splitted.forEach(constructor => {
                    name.push(makeCapital(constructor))
                });
    
                const remadeName = name.join(' ');

                const finduser = await userData.findOne({
                    TrainerNumber: parseInt(trainerid)
                });

                if (!finduser) {
                    return interaction.reply({
                        content: ':x: Could not find the user with the supplied trainer ID!',
                        ephemeral: true
                    });
                }

                if (parseInt(finduser.OwnerID) === parseInt(interaction.user.id)) {
                    return interaction.reply({
                        content: ':x: You may not send items over to yourself!',
                        ephemeral: true
                    })
                }

                const mainuser = await userData.findOne({
                    OwnerID: parseInt(interaction.user.id)
                });

                let amountOfItem = 0;
                for (let i = 0; i < mainuser.Items.length; i++) {
                    if (mainuser.Items[i].ItemName === remadeName) {
                        amountOfItem = mainuser.Items[i].ItemAmount;
                    }
                }

                const itemNames = [
                    "Rare Candy",
                    "Redeem"
                ]

                if (!itemNames.includes(remadeName)) {
                    return interaction.reply({
                        content: ':x: No item with that name could be found, is that a valid item name?',
                        ephemeral: true
                    })
                }

                if (amountOfItem < itemsamount) {
                    return interaction.reply({
                        content: ':x: You are trying to give away items you do not have!',
                        ephemeral: true
                    });
                }

                const targetUser = await userData.findOne({
                    TrainerNumber: parseInt(trainerid)
                });

                let targetAmountOfItem = 0;
                for (let i = 0; i < targetUser.Items.length; i++) {
                    if (targetUser.Items[i].ItemName === remadeName) {
                        targetAmountOfItem = targetUser.Items[i].ItemAmount;
                    }
                }

                const targetBalance = targetAmountOfItem + itemsamount;
                const newMainBalance = amountOfItem - itemsamount;

                const findselected = await userData.findOne({
                    TrainerNumber: parseInt(trainerid),
                    "Items.ItemName": remadeName
                }, {
                    "Inventory.$": 1
                });

                if(findselected) {
                    await userData.findOneAndUpdate({
                        TrainerNumber: parseInt(trainerid),
                        "Items.ItemName": remadeName
                    }, {
                        $set: {
                            'Items.$.ItemAmount': targetBalance
                        }
                    });
                } else {
                    await userData.findOneAndUpdate({
                        TrainerNumber: parseInt(trainerid),
                    }, {
                        $push: {
                            Items: {
                                ItemName: remadeName,
                                ItemAmount: targetBalance
                            }
                        }
                    })
                }

                if (newMainBalance > 0) {
                    await userData.findOneAndUpdate({
                        OwnerID: parseInt(interaction.user.id),
                        "Items.ItemName": remadeName,
                    }, {
                        $set: {
                            "Items.$.ItemAmount": newMainBalance
                        }
                    });
                } else {
                    await userData.findOneAndUpdate({
                        OwnerID: parseInt(interaction.user.id),
                    }, {
                        $pull: {
                            Items: {
                                ItemName: remadeName
                            }
                        }
                    });
                }

                return interaction.reply({
                    content: `:white_check_mark: Successfully sent over **${itemsamount}x** **${remadeName}s** to trainer with ID \`${trainerid}\`!`
                })
            }
        }
    }