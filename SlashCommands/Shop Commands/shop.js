const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    ApplicationCommandOptionType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder
} = require('discord.js');
const ee = require('../../botconfig/embed.json');
const emoji = require('../../botconfig/embed.json')
const prettyMilliseconds = require('pretty-ms');
const config = require('../../botconfig/config.json')
const shopData = require('../../schemas/shopData');
const userData = require('../../schemas/userData');

module.exports = {
    name: 'shop',
    description: 'Purchase items from our shop system',
    options: [{
        name: 'view',
        description: 'View every purchaseable thing in the shop',
        type: ApplicationCommandOptionType.Subcommand,
    }, {
        name: 'buy',
        description: 'Buy something from the shop, if you can afford it',
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'name',
            description: 'The name of the item you want to purchase',
            type: ApplicationCommandOptionType.String,
            required: true
        }]
    }],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {

        if (interaction.options.getSubcommand() === "view") {

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

            let currentPage = 0;

            const shopitems = await shopData.find()

            const user = await userData.findOne({
                OwnerID: parseInt(interaction.user.id)
            })

            const embeds = generateShopEmbed(shopitems, currentPage, user)

            if (shopitems > 6) {
                await interaction.reply({
                    embeds: [embeds[currentPage].setFooter({
                        text: `Page ${currentPage+1} of ${embeds.length}`
                    })],
                    components: [mainRow],
                    fetchReply: true
                })
            } else {
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
            })

            collector.on('end', async (collected) => {
                if (collected.size >= 1) {
                    return;
                } else {
                    interaction.deleteReply();
                }
            });
        }

        if (interaction.options.getSubcommand() === "buy") {

            const storeRow = new ActionRowBuilder()
            storeRow.addComponents([
                new ButtonBuilder()
                .setLabel('1x')
                .setCustomId('1x')
                .setStyle(ButtonStyle.Primary)
            ])
            storeRow.addComponents([
                new ButtonBuilder()
                .setLabel('2x')
                .setCustomId('2x')
                .setStyle(ButtonStyle.Primary)
            ])
            storeRow.addComponents([
                new ButtonBuilder()
                .setLabel('5x')
                .setCustomId('5x')
                .setStyle(ButtonStyle.Primary)
            ])
            storeRow.addComponents([
                new ButtonBuilder()
                .setLabel('10x')
                .setCustomId('10x')
                .setStyle(ButtonStyle.Primary)
            ])
            storeRow.addComponents([
                new ButtonBuilder()
                .setEmoji('❌')
                .setCustomId('exit')
                .setStyle(ButtonStyle.Primary)
            ])

            const itemname = interaction.options.getString('name');
            const lowercased = itemname.toLowerCase();
            const splitted = lowercased.split(' ');

            let makeCapital = s => s.replace(/./, c => c.toUpperCase())

            let name = [];
            splitted.forEach(constructor => {
                name.push(makeCapital(constructor))
            });

            const remadename = name.join(' ');

            const founditem = await shopData.findOne({
                ItemName: remadename
            });

            if (!founditem) {
                return interaction.reply({
                    content: ':x: The item you tried to purchase could not be found, please try again!',
                    ephemeral: true
                })
            }

            const founduser = await userData.findOne({
                OwnerID: parseInt(interaction.user.id)
            })

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`Shop - Purchase a product`)
                    .setDescription(`**Pokécoins**: ${parseInt(founduser.Pokecoins).toLocaleString('en-US')}\n**Pokétokens**: ${parseInt(founduser.Poketokens).toLocaleString('en-US')}\n\nYou have requested to purchase the product [\`${founditem.ItemName}\`] from the store.\n\nHow many of this product to you wish to purchase? Please choose a valid amount from the buttons down below in order to check out.`)
                ],
                components: [storeRow],
                fetchReply: true,
            })

            const newInteraction = await interaction.fetchReply()

            const filter = m => m.user.id === interaction.user.id;
            const collector = newInteraction.createMessageComponentCollector({
                filter,
                idle: 1000 * 60,
                time: 1000 * 120
            });

            collector.on('collect', async (interactionCollector) => {
                if (interactionCollector.customId === "1x") {
                    await interactionCollector.deferUpdate();
                    const amount = 1;

                    if (parseInt(founditem.CostType) === 1) {
                        if (founduser.Pokecoins < founditem.ItemCost * amount) {
                            return interactionCollector.editReply({
                                content: ':x: You do not have enough Pokécoins to finish this order.',
                                embeds: [],
                                components: []
                            })
                        }
                        const newprice = founduser.Pokecoins - founditem.ItemCost * amount;

                        await founduser.updateOne({
                            $set: {
                                Pokecoins: newprice
                            },
                        })

                        const findselected = await userData.findOne({
                            OwnerID: interaction.user.id,
                            "Items.ItemName": remadename
                        }, {
                            "Inventory.$": 1
                        })

                        if(findselected) {
                            await userData.findOneAndUpdate({
                                OwnerID: interaction.user.id,
                                "Items.ItemName": remadename
                            }, {
                                $inc: {
                                    'Items.$.ItemAmount': 1
                                }
                            })
                        } else {
                            await userData.findOneAndUpdate({
                                OwnerID: parseInt(interaction.user.id),
                            }, {
                                $push: {
                                    Items: {
                                        ItemName: remadename,
                                        ItemAmount: 1
                                    }
                                }
                            })
                        }
                    }

                    if (parseInt(founditem.CostType) === 2) {
                        if (founduser.Poketokens < founditem.ItemCost * amount) {
                            return interactionCollector.editReply({
                                content: ':x: You do not have enough Pokétokens to finish this order.',
                                embeds: [],
                                components: []
                            })
                        }
                        const newprice = founduser.Poketokens - founditem.ItemCost * amount;

                        await founduser.updateOne({
                            $set: {
                                Poketokens: newprice
                            },
                        })

                        const findselected = await userData.findOne({
                            OwnerID: interaction.user.id,
                            "Items.ItemName": remadename
                        }, {
                            "Inventory.$": 1
                        })

                        if(findselected) {
                            await userData.findOneAndUpdate({
                                OwnerID: interaction.user.id,
                                "Items.ItemName": remadename
                            }, {
                                $inc: {
                                    'Items.$.ItemAmount': 1
                                }
                            })
                        } else {
                            await userData.findOneAndUpdate({
                                OwnerID: parseInt(interaction.user.id),
                            }, {
                                $push: {
                                    Items: {
                                        ItemName: remadename,
                                        ItemAmount: 1
                                    }
                                }
                            })
                        }
                    }

                    interactionCollector.editReply({
                        content: `:white_check_mark: Successfully purchased 1x of product ${founditem.ItemName}!`,
                        embeds: [],
                        components: [],
                    })
                }

                if (interactionCollector.customId === "2x") {
                    await interactionCollector.deferUpdate();
                    const amount = 2;

                    if (parseInt(founditem.CostType) === 1) {
                        if (founduser.Pokecoins < founditem.ItemCost * amount) {
                            return interactionCollector.editReply({
                                content: ':x: You do not have enough Pokécoins to finish this order.',
                                embeds: [],
                                components: []
                            })
                        }
                        const newprice = founduser.Pokecoins - founditem.ItemCost * amount;

                        await founduser.updateOne({
                            $set: {
                                Pokecoins: newprice
                            }
                        })

                        const findselected = await userData.findOne({
                            OwnerID: interaction.user.id,
                            "Items.ItemName": remadename
                        }, {
                            "Inventory.$": 1
                        })

                        if(findselected) {
                            await userData.findOneAndUpdate({
                                OwnerID: interaction.user.id,
                                "Items.ItemName": remadename
                            }, {
                                $inc: {
                                    'Items.$.ItemAmount': 2
                                }
                            })
                        } else {
                            await userData.findOneAndUpdate({
                                OwnerID: parseInt(interaction.user.id),
                            }, {
                                $push: {
                                    Items: {
                                        ItemName: remadename,
                                        ItemAmount: 2
                                    }
                                }
                            })
                        }
                    }

                    if (parseInt(founditem.CostType) === 2) {
                        if (founduser.Poketokens < founditem.ItemCost * amount) {
                            return interactionCollector.editReply({
                                content: ':x: You do not have enough Pokétokens to finish this order.',
                                embeds: [],
                                components: []
                            })
                        }
                        const newprice = founduser.Poketokens - founditem.ItemCost * amount;

                        await founduser.updateOne({
                            $set: {
                                Poketokens: newprice
                            }
                        })

                        const findselected = await userData.findOne({
                            OwnerID: interaction.user.id,
                            "Items.ItemName": remadename
                        }, {
                            "Inventory.$": 1
                        })

                        if(findselected) {
                            await userData.findOneAndUpdate({
                                OwnerID: interaction.user.id,
                                "Items.ItemName": remadename
                            }, {
                                $inc: {
                                    'Items.$.ItemAmount': 2
                                }
                            })
                        } else {
                            await userData.findOneAndUpdate({
                                OwnerID: parseInt(interaction.user.id),
                            }, {
                                $push: {
                                    Items: {
                                        ItemName: remadename,
                                        ItemAmount: 2
                                    }
                                }
                            })
                        }
                    }

                    interactionCollector.editReply({
                        content: `:white_check_mark: Successfully purchased 2x of product ${founditem.ItemName}!`,
                        embeds: [],
                        components: [],
                    })
                }

                if (interactionCollector.customId === "5x") {
                    await interactionCollector.deferUpdate();
                    const amount = 5;

                    if (parseInt(founditem.CostType) === 1) {
                        if (founduser.Pokecoins < founditem.ItemCost * amount) {
                            return interactionCollector.editReply({
                                content: ':x: You do not have enough Pokécoins to finish this order.',
                                embeds: [],
                                components: []
                            })
                        }
                        const newprice = founduser.Pokecoins - founditem.ItemCost * amount;

                        await founduser.updateOne({
                            $set: {
                                Pokecoins: newprice
                            }
                        })

                        const findselected = await userData.findOne({
                            OwnerID: interaction.user.id,
                            "Items.ItemName": remadename
                        }, {
                            "Inventory.$": 1
                        })

                        if(findselected) {
                            await userData.findOneAndUpdate({
                                OwnerID: interaction.user.id,
                                "Items.ItemName": remadename
                            }, {
                                $inc: {
                                    'Items.$.ItemAmount': 5
                                }
                            })
                        } else {
                            await userData.findOneAndUpdate({
                                OwnerID: parseInt(interaction.user.id),
                            }, {
                                $push: {
                                    Items: {
                                        ItemName: remadename,
                                        ItemAmount: 5
                                    }
                                }
                            })
                        }
                    }

                    if (parseInt(founditem.CostType) === 2) {
                        if (founduser.Poketokens < founditem.ItemCost * amount) {
                            return interactionCollector.editReply({
                                content: ':x: You do not have enough Pokétokens to finish this order.',
                                embeds: [],
                                components: []
                            })
                        }
                        const newprice = founduser.Poketokens - founditem.ItemCost * amount;

                        await founduser.updateOne({
                            $set: {
                                Poketokens: newprice
                            }
                        })

                        const findselected = await userData.findOne({
                            OwnerID: interaction.user.id,
                            "Items.ItemName": remadename
                        }, {
                            "Inventory.$": 1
                        })

                        if(findselected) {
                            await userData.findOneAndUpdate({
                                OwnerID: interaction.user.id,
                                "Items.ItemName": remadename
                            }, {
                                $inc: {
                                    'Items.$.ItemAmount': 5
                                }
                            })
                        } else {
                            await userData.findOneAndUpdate({
                                OwnerID: parseInt(interaction.user.id),
                            }, {
                                $push: {
                                    Items: {
                                        ItemName: remadename,
                                        ItemAmount: 5
                                    }
                                }
                            })
                        }
                    }

                    interactionCollector.editReply({
                        content: `:white_check_mark: Successfully purchased 5x of product ${founditem.ItemName}!`,
                        embeds: [],
                        components: [],
                    })
                }

                if (interactionCollector.customId === "10x") {
                    await interactionCollector.deferUpdate();
                    const amount = 10;

                    if (parseInt(founditem.CostType) === 1) {
                        if (founduser.Pokecoins < founditem.ItemCost * amount) {
                            return interactionCollector.editReply({
                                content: ':x: You do not have enough Pokécoins to finish this order.',
                                embeds: [],
                                components: []
                            })
                        }
                        const newprice = founduser.Pokecoins - founditem.ItemCost * amount;

                        await founduser.updateOne({
                            $set: {
                                Pokecoins: newprice
                            }
                        })

                        const findselected = await userData.findOne({
                            OwnerID: interaction.user.id,
                            "Items.ItemName": remadename
                        }, {
                            "Inventory.$": 1
                        })

                        if(findselected) {
                            await userData.findOneAndUpdate({
                                OwnerID: interaction.user.id,
                                "Items.ItemName": remadename
                            }, {
                                $inc: {
                                    'Items.$.ItemAmount': 10
                                }
                            })
                        } else {
                            await userData.findOneAndUpdate({
                                OwnerID: parseInt(interaction.user.id),
                            }, {
                                $push: {
                                    Items: {
                                        ItemName: remadename,
                                        ItemAmount: 10
                                    }
                                }
                            })
                        }
                    }

                    if (parseInt(founditem.CostType) === 2) {
                        if (founduser.Poketokens < founditem.ItemCost * amount) {
                            return interactionCollector.editReply({
                                content: ':x: You do not have enough Pokétokens to finish this order.',
                                embeds: [],
                                components: []
                            })
                        }
                        const newprice = founduser.Poketokens - founditem.ItemCost * amount;

                        await founduser.updateOne({
                            $set: {
                                Poketokens: newprice
                            }
                        })

                        const findselected = await userData.findOne({
                            OwnerID: interaction.user.id,
                            "Items.ItemName": remadename
                        }, {
                            "Inventory.$": 1
                        })

                        if(findselected) {
                            await userData.findOneAndUpdate({
                                OwnerID: interaction.user.id,
                                "Items.ItemName": remadename
                            }, {
                                $inc: {
                                    'Items.$.ItemAmount': 10
                                }
                            })
                        } else {
                            await userData.findOneAndUpdate({
                                OwnerID: parseInt(interaction.user.id),
                            }, {
                                $push: {
                                    Items: {
                                        ItemName: remadename,
                                        ItemAmount: 10
                                    }
                                }
                            })
                        }
                    }

                    interactionCollector.editReply({
                        content: `:white_check_mark: Successfully purchased 10x of product ${founditem.ItemName}!`,
                        embeds: [],
                        components: [],
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

        function generateShopEmbed(ownedpokes, currentPage, user) {
            const embeds = []
            let k = 6;
            for (let i = 0; i < ownedpokes.length; i += 6) {
                const current = ownedpokes.slice(i, k);
                let j = i;
                k += 6;
                let costtype;

                if (parseInt(current[i].CostType) === 1) {
                    costtype = "Pokécoin(s)";
                } else if (parseInt(current[i].CostType) === 2) {
                    costtype = "Pokétoken(s)";
                }

                //const info = current.map(currentpokemon => `**${currentpokemon.ItemName}**\n**Cost:** \`${currentpokemon.ItemCost} ${costtype}\``).join('\n\n');
                const embed = new EmbedBuilder()

                current.map(item => {
                    embed.addFields([{
                        name: `**${item.ItemName}**`,
                        value: `**Cost:** \`${item.ItemCost.toLocaleString('en-US')} ${costtype}\``,
                        inline: true
                    }])
                })

                embed.setDescription(`**Pokécoins**: ${parseInt(user.Pokecoins).toLocaleString('en-US')}\n**Pokétokens**: ${parseInt(user.Poketokens).toLocaleString('en-US')}\n\nUse your buttons to flip pages and display more items!`)
                embed.setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                embed.setTitle(`Discmon Shop`)
                embed.setColor(ee.color)
                embeds.push(embed)
            }
            return embeds;
        }
    }
}