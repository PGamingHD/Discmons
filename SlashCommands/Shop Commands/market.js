    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        ApplicationCommandOptionType,
        ActionRowBuilder,
        ButtonStyle,
        ButtonBuilder,
        EmbedBuilder
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json');
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    const market = require('../../schemas/globalMarket');
    const user = require('../../schemas/userData');
    const globalData = require("../../schemas/globalData");

    module.exports = {
        name: 'market',
        description: 'Want to put a pokemon up to the market, or maybe purchase one? This is the place for you!',
        options: [{
            name: 'add',
            description: 'Add a pokemon to the market!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'id',
                description: 'The ID of the pokemon you want to add to the market',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }, {
                name: 'price',
                description: 'The price you want to put up the pokemon on the market for',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }],
        }, {
            name: 'buy',
            description: 'Purchase a pokemon from the market',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'id',
                description: 'The MarketID of the pokemon you want to buy from the market',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }],
        }, {
            name: 'delete',
            description: 'Delete a pokemon from the market',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'id',
                description: 'The MarketID of the pokemon you want to delete from the market',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }],
        }, {
            name: 'info',
            description: 'Get information on a pokemon from the market',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'id',
                description: 'The MarketID of the pokemon you want to get info on',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }],
        }, {
            name: 'view',
            description: 'View the current Market',
            type: ApplicationCommandOptionType.Subcommand,
        }],
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            if (interaction.options.getSubcommand() === 'add') {
                const id = interaction.options.getInteger('id');
                const price = interaction.options.getInteger('price');

                const findpoke = await user.findOne({
                    OwnerID: parseInt(interaction.user.id),
                    "Inventory.PokemonData.PokemonOrder": id
                }, {
                    "Inventory.$": 1
                })

                const findNextId = await globalData.findOne({
                    accessString: "accessingGlobalDataFromString"
                });

                if (!findpoke) {
                    return interaction.reply({
                        content: ':x: That Pokémon could not be found in your inventory, do you own a Pokémon with this ID?',
                        ephemeral: true
                    })
                }

                if (findpoke.Inventory[0].PokemonSelected) {
                    return interaction.reply({
                        content: ':x: You may not put your selected Pokémon up for sale!',
                        ephemeral: true
                    })
                }

                if (findpoke.Inventory[0].PokemonOnMarket) {
                    return interaction.reply({
                        content: ':x: This Pokémon has already been added to the market!',
                        ephemeral: true
                    })
                }

                if (price < 0 || price > 2000000000) {
                    return interaction.reply({
                        content: ':x: You may only use a price set between 0 and 2,000,000,000 at max!',
                        ephemeral: true
                    })
                }

                const findorder = await user.findOne({
                    OwnerID: interaction.user.id,
                    "Inventory.PokemonData.PokemonOrder": id
                }, {
                    "Inventory.$": 1
                })

                await market.create({
                    MarketID: findNextId.NextMarketID,
                    MarketPrice: price,
                    PokemonID: findpoke.Inventory[0].PokemonID,
                    PokemonName: findpoke.Inventory[0].PokemonName,
                    PokemonLevel: findpoke.Inventory[0].PokemonData.PokemonLevel,
                    PokemonPicture: findpoke.Inventory[0].PokemonPicture,
                    PokemonOwner: interaction.user.id,
                    PokemonOriginalOwner: findpoke.Inventory[0].PokemonData.PokemonOriginalOwner,
                    PokemonXP: findpoke.Inventory[0].PokemonData.PokemonXP
                });

                await findNextId.updateOne({
                    $inc: {
                        NextMarketID: 1
                    }
                });

                await user.findOneAndUpdate({
                    OwnerID: parseInt(interaction.user.id),
                    "Inventory.PokemonData.PokemonOrder": id
                }, {
                    $set: {
                        'Inventory.$.PokemonOnMarket': true
                    }
                })

                return interaction.reply({
                    content: `:white_check_mark: Successfully added your Lvl. ${findpoke.Inventory[0].PokemonData.PokemonLevel} ${findpoke.Inventory[0].PokemonName} to the market for \`${price}\` Pokécoins! [ID: ${findNextId.NextMarketID}]`,
                    ephemeral: true
                })
            }

            if (interaction.options.getSubcommand() === 'buy') {
                const id = interaction.options.getInteger('id');

                const pokeinfo = await market.findOne({
                    MarketID: id
                });

                if (!pokeinfo) {
                    return interaction.reply({
                        content: ':x: No Pokémon on the market could be found with the provided ID.',
                        ephemeral: true
                    })
                }

                const interactionTarget = await client.users.fetch(`${pokeinfo.PokemonOwner}`);

                const userdata = await user.findOne({
                    OwnerID: parseInt(interaction.user.id)
                });
                const ownerdata = await user.findOne({
                    OwnerID: parseInt(pokeinfo.PokemonOwner)
                });

                if (userdata.Pokecoins < pokeinfo.MarketPrice) {
                    return interaction.reply({
                        content: ':x: It looks like you cannot afford this Pokémon!',
                        ephemeral: true
                    })
                }

                if (parseInt(interaction.user.id) === parseInt(pokeinfo.PokemonOwner)) {
                    return interaction.reply({
                        content: ':x: You may not purchase your own Pokémon from the market, please remove it if you wish to keep it!',
                        ephemeral: true
                    })
                }

                await user.findOneAndUpdate({
                    OwnerID: parseInt(ownerdata.OwnerID),
                }, {
                    $pull: {
                        Inventory: {
                            PokemonID: pokeinfo.PokemonID,
                        }
                    },
                    $inc: {
                        Pokecoins: pokeinfo.MarketPrice
                    }
                });

                const findtotal = await user.aggregate([{
                    $match: {
                        OwnerID: parseInt(interaction.user.id),
                    }
                }, {
                    $unwind: "$Inventory"
                }, {
                    $sort: {
                        "Inventory.PokemonData.PokemonOrder": -1
                    }
                }]).limit(1);
    
                const incrementID = findtotal[0].Inventory.PokemonData.PokemonOrder + 1

                const newMoney = userdata.Pokecoins - pokeinfo.MarketPrice;

                await user.findOneAndUpdate({
                    OwnerID: parseInt(userdata.OwnerID)
                }, {
                    $push: {
                        Inventory: {
                            PokemonID: pokeinfo.PokemonID,
                            PokemonName: pokeinfo.PokemonName,
                            PokemonPicture: pokeinfo.PokemonPicture,
                            PokemonSelected: false,
                            PokemonOnMarket: false,
                            PokemonData: {
                                PokemonOriginalOwner: pokeinfo.PokemonOriginalOwner,
                                PokemonLevel: pokeinfo.PokemonLevel,
                                PokemonXP: pokeinfo.PokemonXP,
                                PokemonOrder: incrementID
                            }
                        }
                    },
                    $set: {
                        Pokecoins: newMoney
                    }
                })

                await market.findOneAndDelete({
                    PokemonID: pokeinfo.PokemonID
                });

                await interaction.reply({
                    content: `:white_check_mark: You successfully purchased the pokémon with the listing ID of \`${pokeinfo.MarketID}\` for a total of \`${pokeinfo.MarketPrice}\` Pokécoins!`,
                    ephemeral: true
                })

                try {
                    await interactionTarget.send({
                        content: `:white_check_mark: Your Pokemon listing with ID \`${pokeinfo.MarketID}\` has been successfully sold for \`${pokeinfo.MarketPrice}\` Pokécoins!`
                    });
                } catch (error) {
                    if (error.rawError.message === "Cannot send messages to this user") {
                        await interaction.editReply({
                            embeds: [],
                            components: [],
                            content: ':x: Failed to send a message to the user due to DMs being closed.'
                        })
                    } else {
                        await interaction.editReply({
                            embeds: [],
                            components: [],
                            content: ':x: I ran into an error when sending a message to the user.'
                        })
                    }
                }
            }

            if (interaction.options.getSubcommand() === 'delete') {
                const id = interaction.options.getInteger('id');

                const pokeinfo = await market.findOne({
                    MarketID: id
                });

                if (!pokeinfo) {
                    return interaction.reply({
                        content: ':x: No Pokémon on the market could be found with the provided ID.',
                        ephemeral: true
                    })
                }

                if (parseInt(interaction.user.id) !== parseInt(pokeinfo.PokemonOwner)) {
                    return interaction.reply({
                        content: ':x: You are not the Owner of this listing and may therefore not remove it.',
                        ephemeral: true
                    })
                }

                const findininventory = await user.findOne({
                    OwnerID: parseInt(interaction.user.id),
                    "Inventory.PokemonID": pokeinfo.PokemonID
                }, {
                    "Inventory.$": 1
                });

                await market.deleteOne({
                    PokemonID: pokeinfo.PokemonID
                })

                await user.findOneAndUpdate({
                    OwnerID: parseInt(interaction.user.id),
                    "Inventory.PokemonData.PokemonOrder": id
                }, {
                    $set: {
                        'Inventory.$.PokemonOnMarket': false
                    }
                })

                return interaction.reply({
                    content: `:white_check_mark: Successfully removed your Market listing for your Lvl. ${pokeinfo.PokemonLevel} ${pokeinfo.PokemonName} as requested!`,
                    ephemeral: true
                })
            }

            if (interaction.options.getSubcommand() === 'info') {
                const id = interaction.options.getInteger('id');

                const pokeinfo = await market.findOne({
                    MarketID: id
                });

                if (!pokeinfo) {
                    return interaction.reply({
                        content: ':x: No Pokémon on the market could be found with the provided ID.',
                        ephemeral: true
                    })
                }

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setImage(pokeinfo.PokemonPicture)
                        .setTitle(`${pokeinfo.MarketID} | Level. ${pokeinfo.PokemonLevel} ${pokeinfo.PokemonName}`)
                    ]
                })
            }

            if (interaction.options.getSubcommand() === 'view') {

                const mainRow = new ActionRowBuilder()
                mainRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji('⏪')
                    .setCustomId('fastbackward')
                    .setStyle(ButtonStyle.Primary)
                ])
                mainRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji('⬅️')
                    .setCustomId('backward')
                    .setStyle(ButtonStyle.Primary)
                ])
                mainRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji('➡️')
                    .setCustomId('forward')
                    .setStyle(ButtonStyle.Primary)
                ])
                mainRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji('⏩')
                    .setCustomId('fastforward')
                    .setStyle(ButtonStyle.Primary)
                ])
                mainRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji('❌')
                    .setCustomId('exit')
                    .setStyle(ButtonStyle.Primary)
                ])

                const marketpokes = await market.find();

                let currentPage = 0;
                const embeds = generateMarketEmbed(marketpokes, currentPage)

                if (marketpokes.length === 0) {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`**No Pokémons have been added to the market yet.**`)
                            .setTitle(`🛒 Discmon Market`)
                            .setColor(ee.color)
                            .setFooter({
                                text: `Page 1 of 1`
                            })
                        ],
                        fetchReply: true
                    })
                }
                if (marketpokes.length > 20) {
                    await interaction.reply({
                        embeds: [embeds[currentPage].setFooter({
                            text: `Page ${currentPage+1} of ${embeds.length}`
                        })],
                        components: [mainRow],
                        fetchReply: true
                    })
                } else if (marketpokes.length >= 1 && marketpokes.length < 20) {
                    await interaction.reply({
                        embeds: [embeds[currentPage].setFooter({
                            text: `Page ${currentPage+1} of ${embeds.length}`
                        })],
                        fetchReply: true
                    })
                }

                const newInteraction = await interaction.fetchReply()

                const filter = m => m.user.id === interaction.user.id;
                const collector = newInteraction.createMessageComponentCollector({
                    filter,
                    idle: 1000 * 60,
                    time: 1000 * 120
                });

                collector.on('collect', async (interactionCollector) => {
                    if (interactionCollector.customId === "forward") {
                        await interactionCollector.deferUpdate();
                        if (currentPage < embeds.length - 1) {
                            currentPage++;
                            interactionCollector.editReply({
                                embeds: [embeds[currentPage].setFooter({
                                    text: `Page ${currentPage+1} of ${embeds.length}`
                                })]
                            })
                        } else {
                            --currentPage;
                            interactionCollector.editReply({
                                embeds: [embeds[currentPage].setFooter({
                                    text: `Page ${currentPage+1} of ${embeds.length}`
                                })]
                            })
                        }
                    }

                    if (interactionCollector.customId === "backward") {
                        await interactionCollector.deferUpdate();
                        if (currentPage !== 0) {
                            --currentPage;
                            interactionCollector.editReply({
                                embeds: [embeds[currentPage].setFooter({
                                    text: `Page ${currentPage+1} of ${embeds.length}`
                                })]
                            })
                        } else {
                            currentPage++;
                            interactionCollector.editReply({
                                embeds: [embeds[currentPage].setFooter({
                                    text: `Page ${currentPage+1} of ${embeds.length}`
                                })]
                            })
                        }
                    }

                    if (interactionCollector.customId === "fastforward") {
                        await interactionCollector.deferUpdate();
                        if (currentPage < embeds.length - 1) {
                            currentPage = embeds.length - 1;
                            interactionCollector.editReply({
                                embeds: [embeds[currentPage].setFooter({
                                    text: `Page ${currentPage+1} of ${embeds.length}`
                                })]
                            })
                        }
                    }

                    if (interactionCollector.customId === "fastbackward") {
                        await interactionCollector.deferUpdate();
                        currentPage = 0;
                        interactionCollector.editReply({
                            embeds: [embeds[currentPage].setFooter({
                                text: `Page ${currentPage+1} of ${embeds.length}`
                            })]
                        })
                    }

                    if (interactionCollector.customId === "exit") {
                        await interactionCollector.deferUpdate();
                        collector.stop();
                        interaction.deleteReply();
                    }
                });

                collector.on('end', async (collected) => {
                    if (collected.size >= 1) {
                        return;
                    } else {
                        interaction.deleteReply();
                    }
                });
            }

            function generateMarketEmbed(marketpokes, currentPage) {
                const embeds = []
                let k = 20;
                for (let i = 0; i < marketpokes.length; i += 20) {
                    const current = marketpokes.slice(i, k);
                    let j = i;
                    k += 20;
                    const info = current.map(currentpokemon => `\`${currentpokemon.MarketID}\` **${currentpokemon.PokemonName}**　•　Lvl. ${currentpokemon.PokemonLevel}　•　**$**${currentpokemon.MarketPrice.toLocaleString('en-US')}`).join('\n');
                    const embed = new EmbedBuilder()
                        .setDescription(`${info}`)
                        .setTitle(`🛒 Discmon Market`)
                        .setColor(ee.color)
                    embeds.push(embed)
                }
                return embeds;
            }
        }
    }