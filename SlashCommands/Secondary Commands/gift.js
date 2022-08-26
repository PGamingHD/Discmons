    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        ApplicationCommandOptionType,
        EmbedBuilder,
        ActionRowBuilder,
        ButtonBuilder,
        ButtonStyle
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json');
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    const userData = require("../../schemas/userData");

    module.exports = {
        name: 'gift',
        description: 'Gift something over to another Trainer, very sweet of you',
        options: [{
            name: 'tokens',
            description: 'Gift Pokétokens to another trainer, very generous',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'trainerid',
                description: 'The trainerid you want to transfer X amount of tokens to!',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }, {
                name: 'amount',
                description: 'The token amount you want to transfer to the trainer',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }]
        }, {
            name: 'coins',
            description: 'Gift Pokécoins to another trainer, very generous',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'trainerid',
                description: 'The trainerid you want to transfer X amount of tokens to!',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }, {
                name: 'amount',
                description: 'The coin amount you want to transfer to the trainer',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }]
        }, {
            name: 'pokemon',
            description: 'Gift a Pokémon to another trainer, very generous',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'trainerid',
                description: 'The trainerid you want to transfer X amount of tokens to!',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }, {
                name: 'pokemonid',
                description: 'The pokemon you want to transfer to the trainer, by id',
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
            if (interaction.options.getSubcommand() === "tokens") {
                const confirmRow = new ActionRowBuilder()
                confirmRow.addComponents([
                    new ButtonBuilder()
                    .setLabel('Confirm')
                    .setEmoji({
                        name: "✅"
                    })
                    .setCustomId('confirm')
                    .setStyle(ButtonStyle.Success)
                ])
                confirmRow.addComponents([
                    new ButtonBuilder()
                    .setLabel('Deny')
                    .setEmoji({
                        name: "❌"
                    })
                    .setCustomId('deny')
                    .setStyle(ButtonStyle.Danger)
                ])
                const amount = interaction.options.getInteger('amount');
                const trainerid = interaction.options.getInteger('trainerid');

                const findTarget = await userData.findOne({
                    TrainerNumber: parseInt(trainerid)
                });

                const findMain = await userData.findOne({
                    OwnerID: parseInt(interaction.user.id)
                })

                if (!findTarget) {
                    return interaction.reply({
                        content: ':x: The trainer with that ID could not be found, is the ID correct?',
                        ephemeral: true
                    });
                }

                if (parseInt(findTarget.OwnerID) === parseInt(interaction.user.id)) {
                    return interaction.reply({
                        content: ':x: You may not send gifts to yourself, try sending it to someone else!',
                        ephemeral: true
                    });
                }

                if (parseInt(findMain.Poketokens) < amount || amount < 0) {
                    return interaction.reply({
                        content: ':x: You may not transfer Tokens you do not currently own!',
                        ephemeral: true
                    });
                }

                const newMainBal = parseInt(findMain.Poketokens) - parseInt(amount);
                const newTargetBal = parseInt(findTarget.Poketokens) + parseInt(amount);

                const mainMsg = await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setDescription(`You are about to send **${amount}x** Tokens over to the Trainer with ID **${trainerid}**, are you sure you want to continue with this action?`)
                    ],
                    components: [confirmRow]
                })
                const filter = m => m.user.id === interaction.user.id;
                const collector = mainMsg.createMessageComponentCollector({
                    filter,
                    idle: 1000 * 60,
                    time: 1000 * 120,
                    max: 1,
                });

                collector.on('collect', async (interactionCollector) => {
                    if (interactionCollector.customId === "confirm") {
                        await interactionCollector.deferUpdate();

                        await userData.findOneAndUpdate({
                            OwnerID: parseInt(interaction.user.id)
                        }, {
                            $set: {
                                Poketokens: newMainBal
                            }
                        });

                        await userData.findOneAndUpdate({
                            TrainerNumber: parseInt(trainerid)
                        }, {
                            $set: {
                                Poketokens: newTargetBal
                            }
                        });

                        return interactionCollector.editReply({
                            embeds: [],
                            components: [],
                            content: `:white_check_mark: Successfully sent **${amount}x** tokens to Trainer ID **${trainerid}**!`
                        });
                    };

                    if (interactionCollector.customId === "deny") {
                        await interactionCollector.deferUpdate();
                        return;
                    };
                });

                collector.on('end', async (collected) => {
                    try {
                        for (let i = 0; i < confirmRow.components.length; i++) {
                            confirmRow.components[i].setDisabled(true);
                        }

                        await interaction.editReply({
                            components: [confirmRow]
                        });
                    } catch (error) {
                        if (error.message === "Unknown Message") {
                            return;
                        } else {
                            console.log(error)
                        }
                    }
                });
            }

            if (interaction.options.getSubcommand() === "coins") {
                const confirmRow = new ActionRowBuilder()
                confirmRow.addComponents([
                    new ButtonBuilder()
                    .setLabel('Confirm')
                    .setEmoji({
                        name: "✅"
                    })
                    .setCustomId('confirm')
                    .setStyle(ButtonStyle.Success)
                ])
                confirmRow.addComponents([
                    new ButtonBuilder()
                    .setLabel('Deny')
                    .setEmoji({
                        name: "❌"
                    })
                    .setCustomId('deny')
                    .setStyle(ButtonStyle.Danger)
                ])
                const amount = interaction.options.getInteger('amount');
                const trainerid = interaction.options.getInteger('trainerid');

                const findTarget = await userData.findOne({
                    TrainerNumber: parseInt(trainerid)
                });

                const findMain = await userData.findOne({
                    OwnerID: parseInt(interaction.user.id)
                })

                if (!findTarget) {
                    return interaction.reply({
                        content: ':x: The trainer with that ID could not be found, is the ID correct?',
                        ephemeral: true
                    });
                }

                if (parseInt(findTarget.OwnerID) === parseInt(interaction.user.id)) {
                    return interaction.reply({
                        content: ':x: You may not send gifts to yourself, try sending it to someone else!',
                        ephemeral: true
                    });
                }

                if (parseInt(findMain.Pokecoins) < amount || amount < 0) {
                    return interaction.reply({
                        content: ':x: You may not transfer Coins you do not currently own!',
                        ephemeral: true
                    });
                }

                const newMainBal = parseInt(findMain.Pokecoins) - parseInt(amount);
                const newTargetBal = parseInt(findTarget.Pokecoins) + parseInt(amount);

                const mainMsg = await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setDescription(`You are about to send **${amount}x** Coins over to the Trainer with ID **${trainerid}**, are you sure you want to continue with this action?`)
                    ],
                    components: [confirmRow]
                });

                const filter = m => m.user.id === interaction.user.id;
                const collector = mainMsg.createMessageComponentCollector({
                    filter,
                    idle: 1000 * 60,
                    time: 1000 * 120,
                    max: 1,
                });

                collector.on('collect', async (interactionCollector) => {
                    if (interactionCollector.customId === "confirm") {
                        await interactionCollector.deferUpdate();

                        await userData.findOneAndUpdate({
                            OwnerID: parseInt(interaction.user.id)
                        }, {
                            $set: {
                                Pokecoins: newMainBal
                            }
                        });

                        await userData.findOneAndUpdate({
                            TrainerNumber: parseInt(trainerid)
                        }, {
                            $set: {
                                Pokecoins: newTargetBal
                            }
                        });

                        return interactionCollector.editReply({
                            embeds: [],
                            components: [],
                            content: `:white_check_mark: Successfully sent **${amount}x** Coins to Trainer ID **${trainerid}**!`
                        });
                    };

                    if (interactionCollector.customId === "deny") {
                        await interactionCollector.deferUpdate();
                        return;
                    };
                });

                collector.on('end', async (collected) => {
                    try {
                        for (let i = 0; i < confirmRow.components.length; i++) {
                            confirmRow.components[i].setDisabled(true);
                        }

                        await interaction.editReply({
                            components: [confirmRow]
                        });
                    } catch (error) {
                        if (error.message === "Unknown Message") {
                            return;
                        } else {
                            console.log(error)
                        }
                    }
                });
            }

            if (interaction.options.getSubcommand() === "pokemon") {
                const confirmRow = new ActionRowBuilder()
                confirmRow.addComponents([
                    new ButtonBuilder()
                    .setLabel('Confirm')
                    .setEmoji({
                        name: "✅"
                    })
                    .setCustomId('confirm')
                    .setStyle(ButtonStyle.Success)
                ])
                confirmRow.addComponents([
                    new ButtonBuilder()
                    .setLabel('Deny')
                    .setEmoji({
                        name: "❌"
                    })
                    .setCustomId('deny')
                    .setStyle(ButtonStyle.Danger)
                ])
                const pokemonid = interaction.options.getInteger('pokemonid');
                const trainerid = interaction.options.getInteger('trainerid');

                const findTarget = await userData.findOne({
                    TrainerNumber: parseInt(trainerid)
                });

                const findpoke = await userData.findOne({
                    OwnerID: parseInt(interaction.user.id),
                    "Inventory.PokemonData.PokemonOrder": pokemonid
                }, {
                    "Inventory.$": 1
                });

                if (!findTarget) {
                    return interaction.reply({
                        content: ':x: The trainer with that ID could not be found, is the ID correct?',
                        ephemeral: true
                    });
                }

                if (!findpoke) {
                    return interaction.reply({
                        content: ':x: The Pokémon with the specified ID could not be found, is the id valid?',
                        ephemeral: true
                    });
                }

                if (findpoke.Inventory[0].PokemonSelected) {
                    return interaction.reply({
                        content: ':x: That Pokémon is selected, please select another Pokémon before gifting it!',
                        ephemeral: true
                    });
                }

                if (findpoke.Inventory[0].PokemonOnMarket) {
                    return interaction.reply({
                        content: ':x: That Pokémon is currently listed on the market, please select another Pokémon before gifting it!',
                        ephemeral: true
                    });
                }

                if (parseInt(findTarget.OwnerID) === parseInt(interaction.user.id)) {
                    return interaction.reply({
                        content: ':x: You may not send gifts to yourself, try sending it to someone else!',
                        ephemeral: true
                    });
                }

                const mainMsg = await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setDescription(`You are about to send your Level **${findpoke.Inventory[0].PokemonData.PokemonLevel}** **${findpoke.Inventory[0].PokemonName}** over to the trainer with the ID **${trainerid}**, are you sure you want do this action?`)
                    ],
                    components: [confirmRow]
                });

                const filter = m => m.user.id === interaction.user.id;
                const collector = mainMsg.createMessageComponentCollector({
                    filter,
                    idle: 1000 * 60,
                    time: 1000 * 120,
                    max: 1,
                });

                collector.on('collect', async (interactionCollector) => {
                    if (interactionCollector.customId === "confirm") {
                        await interactionCollector.deferUpdate();

                        await userData.findOneAndUpdate({
                            OwnerID: parseInt(interaction.user.id),
                        }, {
                            $pull: {
                                Inventory: {
                                    "PokemonData.PokemonOrder": pokemonid,
                                }
                            }
                        });

                        const findtotal = await userData.aggregate([{
                            $match: {
                                TrainerNumber: parseInt(trainerid),
                            }
                        }, {
                            $unwind: "$Inventory"
                        }, {
                            $sort: {
                                "Inventory.PokemonData.PokemonOrder": -1
                            }
                        }]).limit(1);

                        const incrementID = findtotal[0].Inventory.PokemonData.PokemonOrder + 1 || 1;

                        await userData.findOneAndUpdate({
                            TrainerNumber: parseInt(trainerid),
                        }, {
                            $push: {
                                Inventory: {
                                    PokemonID: findpoke.Inventory[0].PokemonID,
                                    PokemonName: findpoke.Inventory[0].PokemonName,
                                    PokemonPicture: findpoke.Inventory[0].PokemonPicture,
                                    PokemonSelected: false,
                                    PokemonOnMarket: false,
                                    PokemonData: {
                                        PokemonOriginalOwner: findpoke.Inventory[0].PokemonData.PokemonOriginalOwner,
                                        PokemonLevel: findpoke.Inventory[0].PokemonData.PokemonLevel,
                                        PokemonXP: findpoke.Inventory[0].PokemonData.PokemonXP,
                                        PokemonOrder: incrementID,
                                        PokemonIVs: {
                                            HP: findpoke.Inventory[0].PokemonData.PokemonIVs.HP,
                                            Attack: findpoke.Inventory[0].PokemonData.PokemonIVs.Attack,
                                            Defense: findpoke.Inventory[0].PokemonData.PokemonIVs.Defense,
                                            SpecialAtk: findpoke.Inventory[0].PokemonData.PokemonIVs.SpecialAtk,
                                            SpecialDef: findpoke.Inventory[0].PokemonData.PokemonIVs.SpecialDef,
                                            Speed: findpoke.Inventory[0].PokemonData.PokemonIVs.Speed,
                                            TotalIV: findpoke.Inventory[0].PokemonData.PokemonIVs.TotalIV,
                                        }
                                    }
                                }
                            }
                        });

                        await interactionCollector.editReply({
                            embeds: [],
                            components: [],
                            content: `:white_check_mark: Successfully sent Pokémon **${findpoke.Inventory[0].PokemonName}** at level **${findpoke.Inventory[0].PokemonData.PokemonLevel}** to Trainer with ID **${trainerid}**!`
                        });

                        try {
                            const user = await client.users.fetch(`${parseInt(findTarget.OwnerID)}`, {
                                force: true
                            });

                            await user.send({
                                embeds: [
                                    new EmbedBuilder()
                                    .setColor(ee.color)
                                    .setDescription(`:warning: You have been gifted a Level **${findpoke.Inventory[0].PokemonData.PokemonLevel}** **${findpoke.Inventory[0].PokemonName}** by user **${interaction.user.tag}**!`)
                                ]
                            })
                        } catch (error) {
                            if (error.message !== "Unknown User") {
                                console.log(error)
                            } else {
                                return;
                            }
                        }
                    };

                    if (interactionCollector.customId === "deny") {
                        await interactionCollector.deferUpdate();
                        return;
                    };
                });

                collector.on('end', async (collected) => {
                    try {
                        for (let i = 0; i < confirmRow.components.length; i++) {
                            confirmRow.components[i].setDisabled(true);
                        }

                        await interaction.editReply({
                            components: [confirmRow]
                        });
                    } catch (error) {
                        if (error.message === "Unknown Message") {
                            return;
                        } else {
                            console.log(error)
                        }
                    }
                });
            }
        }
    }