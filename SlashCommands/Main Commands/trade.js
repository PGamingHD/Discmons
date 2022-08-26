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
    const tradeData = require("../../schemas/Trades");

    module.exports = {
        name: 'trade',
        description: 'Trade Pokémons/Items with another trainer',
        options: [{
            name: 'start',
            description: 'Initiate a trade with another trainer',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'user',
                description: 'The user that you wish to initiate a trade with',
                type: ApplicationCommandOptionType.User,
                required: true
            }]
        }, {
            name: 'view',
            description: 'View your ongoing trade status',
            type: ApplicationCommandOptionType.Subcommand
        }, {
            name: 'decline',
            description: 'Decline your ongoing trade',
            type: ApplicationCommandOptionType.Subcommand
        }, {
            name: 'accept',
            description: 'Accept your ongoing trade',
            type: ApplicationCommandOptionType.Subcommand
        }, {
            name: 'add',
            description: 'Add something to your ongoing trade',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [{
                name: 'pokemon',
                description: 'The pokemon you want to add to the trade',
                type: ApplicationCommandOptionType.Subcommand,
                options: [{
                    name: 'pokemonid',
                    description: 'The ID of the pokemon in your inventory to add to the trade',
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }]
            }, {
                name: 'item',
                description: 'The item you want to add to the trade',
                type: ApplicationCommandOptionType.Subcommand,
                options: [{
                    name: 'itemname',
                    description: 'The item name you want to add to the trade',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }, {
                    name: 'amount',
                    description: 'How many of the specific item you want to add to the trade',
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }]
            }]
        }, {
            name: 'remove',
            description: 'Remove something from your ongoing trade',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [{
                name: 'pokemon',
                description: 'The pokemon you want to remove from the trade',
                type: ApplicationCommandOptionType.Subcommand,
                options: [{
                    name: 'pokemonid',
                    description: 'The ID of the pokemon in the trade to remove from the trade',
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }]
            }, {
                name: 'item',
                description: 'The item you want to remove from the trade',
                type: ApplicationCommandOptionType.Subcommand,
                options: [{
                    name: 'itemname',
                    description: 'The item name you want to remove from the trade',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }]
            }]
        }],
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            if (interaction.options.getSubcommand() === "start") {
                const target = interaction.options.getUser('user');

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

                if (target.id === interaction.user.id) {
                    return interaction.reply({
                        content: ':x: You may not initiate a trade with yourself, silly!',
                        ephemeral: true
                    });
                }

                if (target.bot) {
                    return interaction.reply({
                        content: ':x: You may not initiate a trade with a Bot, silly!',
                        ephemeral: true
                    });
                }

                const findTarget = await userData.findOne({
                    OwnerID: parseInt(target.id)
                });

                if (!findTarget) {
                    return interaction.reply({
                        content: ':x: Looks like the selected user has not registered yet!',
                        ephemeral: true
                    });
                }

                const findStatusInteractor = await tradeData.findOne({
                    $or: [{
                        initiatorID: interaction.user.id,
                    }, {
                        targetID: interaction.user.id
                    }]
                });

                if (findStatusInteractor) {
                    return interaction.reply({
                        content: ':x: It looks like you already have an ongoing trade, please finish that one before starting a new one!',
                        ephemeral: true
                    });
                }

                const findStatusTarget = await tradeData.findOne({
                    $or: [{
                        initiatorID: target.id
                    }, {
                        targetID: target.id
                    }]
                });

                if (findStatusTarget) {
                    return interaction.reply({
                        content: ':x: It looks like the person you are trying to trade already has an ongoing trade, please ask them to finish that one before starting a new one!',
                        ephemeral: true
                    });
                }

                const mainMsg = await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setTitle('Trade Request')
                        .setDescription(`Hello there ${target}, looks like ${interaction.user} is trying to trade with you.\nPlease Confirm/Deny this trade offer with the buttons below.`)
                        .setTimestamp()
                    ],
                    content: `${target}`,
                    components: [confirmRow]
                });

                const filter = m => m.user.id === target.id;
                const collector = mainMsg.createMessageComponentCollector({
                    filter,
                    idle: 1000 * 60,
                    time: 1000 * 120,
                    max: 1,
                });

                collector.on('collect', async (interactionCollector, reason) => {

                    if (interactionCollector.customId === "confirm") {
                        await interactionCollector.deferUpdate();

                        const tradeMsg = await interactionCollector.editReply({
                            components: [],
                            embeds: [
                                new EmbedBuilder()
                                .setColor(ee.color)
                                .setDescription(`Successfully initiated trade between **${interaction.user.tag}** & **${target.tag}** as requested!\n\n__**How to continue**__\n• /trade add - Add something to the trade!\n• /trade remove - Remove something from the trade!\n• /trade accept - Accept the trade whenever you both agree on the items!\n• /trade decline - Decline the trade, and get all items back!\n• /trade view - View the current trade, has it updated?\n\n**${interaction.user.tag}'s Offers:**\n\`\`\`• No Items Added\`\`\`\n\n**${target.tag}'s Offers:**\n\`\`\`• No Items Added\`\`\``)
                                .setTimestamp()
                            ],
                            content: ' '
                        });

                        await tradeData.create({
                            initiatorID: interaction.user.id,
                            initiatorTag: interaction.user.tag,
                            targetID: target.id,
                            targetTag: target.tag,
                            tradeMessage: tradeMsg.id,
                            tradeChannel: tradeMsg.channel.id,
                            inAcceptStage: false,
                            initiatorOffers: [],
                            targetOffers: []
                        });
                    }

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

            if (interaction.options.getSubcommand() === "view") {
                const findTrade = await tradeData.findOne({
                    $or: [{
                        initiatorID: interaction.user.id,
                    }, {
                        targetID: interaction.user.id,
                    }]
                });

                if (!findTrade) {
                    return interaction.reply({
                        content: ':x: No trade could be found, please start a trade before ending it!',
                        ephemeral: true
                    });
                }

                const findUpdatedInventory = await tradeData.findOne({
                    $or: [{
                        initiatorID: interaction.user.id,
                    }, {
                        targetID: interaction.user.id,
                    }]
                });

                let targetOffers = [];
                for (let i = 0; i < findUpdatedInventory.targetOffers.length; i++) {
                    if (findUpdatedInventory.initiatorOffers[i].itemType === "poke") {
                        targetOffers.push("[" + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonOrder + "] " + findUpdatedInventory.targetOffers[i].object.PokemonName + " • Lvl. " + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonLevel + " • IV " + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonIVs.TotalIV + "%")
                    } else if (findUpdatedInventory.initiatorOffers[i].itemType === "item") {
                        targetOffers.push(findUpdatedInventory.targetOffers[i].object.ItemAmount + "x • " + findUpdatedInventory.targetOffers[i].object.ItemName)
                    }
                }

                let initiatorOffers = [];
                for (let i = 0; i < findUpdatedInventory.initiatorOffers.length; i++) {
                    if (findUpdatedInventory.initiatorOffers[i].itemType === "poke") {
                        initiatorOffers.push("[" + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonOrder + "] " + findUpdatedInventory.initiatorOffers[i].object.PokemonName + " • Lvl. " + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonLevel + " • IV " + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonIVs.TotalIV + "%");
                    } else if (findUpdatedInventory.initiatorOffers[i].itemType === "item") {
                        initiatorOffers.push(findUpdatedInventory.initiatorOffers[i].object.ItemAmount + "x • " + findUpdatedInventory.initiatorOffers[i].object.ItemName);
                    }
                }

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setDescription(`__**How to continue**__\n• /trade add - Add something to the trade!\n• /trade remove - Remove something from the trade!\n• /trade accept - Accept the trade whenever you both agree on the items!\n• /trade decline - Decline the trade, and get all items back!\n• /trade view - View the current trade, has it updated?\n\n**${findUpdatedInventory.initiatorTag}'s Offers:**\n\`\`\`${initiatorOffers.length ? initiatorOffers.join('\n') : "• No Items Added"}\`\`\`\n\n**${findUpdatedInventory.targetTag}'s Offers:**\n\`\`\`${targetOffers.length ? targetOffers.join('\n') : "• No Items Added"}\`\`\``)
                        .setTimestamp()
                    ],
                    ephemeral: true
                });
            }

            if (interaction.options.getSubcommand() === "decline") {
                const findTrade = await tradeData.findOne({
                    $or: [{
                        initiatorID: interaction.user.id,
                    }, {
                        targetID: interaction.user.id,
                    }]
                });

                if (!findTrade) {
                    return interaction.reply({
                        content: ':x: No trade could be found, please start a trade before ending it!',
                        ephemeral: true
                    });
                }

                await tradeData.deleteOne({
                    $or: [{
                        initiatorID: interaction.user.id,
                    }, {
                        targetID: interaction.user.id,
                    }]
                });

                try {
                    const tradeChannel = await client.channels.fetch(`${findTrade.tradeChannel}`);
                    const tradeMessagef = await tradeChannel.messages.fetch(`${findTrade.tradeMessage}`);

                    await tradeMessagef.edit({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.wrongcolor)
                            .setDescription(`The trade was declined by ${interaction.user}, please start a new one of this was a mistake!`)
                        ],
                        content: ' ',
                        components: []
                    });
                } catch (error) {
                    if (error.message === "Unknown Message") {
                        return;
                    } else {
                        console.log(error);
                    }
                }

                return interaction.reply({
                    content: ':white_check_mark: You successfully declined and cancelled the trade!',
                    ephemeral: true
                })
            }

            if (interaction.options.getSubcommand() === "accept") {
                const acceptRow = new ActionRowBuilder()
                acceptRow.addComponents([
                    new ButtonBuilder()
                    .setLabel('Accept')
                    .setEmoji({
                        name: "✅"
                    })
                    .setCustomId('accept')
                    .setStyle(ButtonStyle.Success)
                ])
                acceptRow.addComponents([
                    new ButtonBuilder()
                    .setLabel('Decline')
                    .setEmoji({
                        name: "❌"
                    })
                    .setCustomId('decline')
                    .setStyle(ButtonStyle.Danger)
                ])

                const findTrade = await tradeData.findOne({
                    $or: [{
                        initiatorID: interaction.user.id,
                    }, {
                        targetID: interaction.user.id,
                    }]
                });

                if (!findTrade) {
                    return interaction.reply({
                        content: ':x: No trade could be found, please start a trade before accepting it!',
                        ephemeral: true
                    });
                }

                if (findTrade.inAcceptStage) {
                    return interaction.reply({
                        content: ':x: This trade has already been initiated into the accept stage, please accept or decline the trade!',
                        ephemeral: true
                    });
                }

                const findUpdatedInventory = await tradeData.findOne({
                    $or: [{
                        initiatorID: interaction.user.id,
                    }, {
                        targetID: interaction.user.id,
                    }]
                });

                let targetOffers = [];
                for (let i = 0; i < findUpdatedInventory.targetOffers.length; i++) {
                    if (findUpdatedInventory.targetOffers[i].itemType === "poke") {
                        targetOffers.push("[" + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonOrder + "] " + findUpdatedInventory.targetOffers[i].object.PokemonName + " • Lvl. " + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonLevel + " • IV " + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonIVs.TotalIV + "%")
                    } else if (findUpdatedInventory.targetOffers[i].itemType === "item") {
                        targetOffers.push(findUpdatedInventory.targetOffers[i].object.ItemAmount + "x • " + findUpdatedInventory.targetOffers[i].object.ItemName)
                    }
                }

                let initiatorOffers = [];
                for (let i = 0; i < findUpdatedInventory.initiatorOffers.length; i++) {
                    if (findUpdatedInventory.initiatorOffers[i].itemType === "poke") {
                        initiatorOffers.push("[" + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonOrder + "] " + findUpdatedInventory.initiatorOffers[i].object.PokemonName + " • Lvl. " + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonLevel + " • IV " + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonIVs.TotalIV + "%");
                    } else if (findUpdatedInventory.initiatorOffers[i].itemType === "item") {
                        initiatorOffers.push(findUpdatedInventory.initiatorOffers[i].object.ItemAmount + "x • " + findUpdatedInventory.initiatorOffers[i].object.ItemName);
                    }
                }

                let isInitiator = true;
                let filtersId = findUpdatedInventory.targetID;
                if (parseInt(findUpdatedInventory.initiatorID) !== parseInt(interaction.user.id)) {
                    isInitiator = false;
                    filtersId = findUpdatedInventory.initiatorID;
                }

                await tradeData.findOneAndUpdate({
                    $or: [{
                        initiatorID: interaction.user.id,
                    }, {
                        targetID: interaction.user.id,
                    }]
                }, {
                    inAcceptStage: true
                })

                const mainMsg = await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setDescription(`**${isInitiator ? findUpdatedInventory.initiatorTag : findUpdatedInventory.targetTag}** has just initiated the accept stage, **${isInitiator ? findUpdatedInventory.targetTag : findUpdatedInventory.initiatorTag}** please accept or decline this trade below!\n__**How to continue**__\n• /trade add - Add something to the trade!\n• /trade remove - Remove something from the trade!\n• /trade accept - Accept the trade whenever you both agree on the items!\n• /trade decline - Decline the trade, and get all items back!\n• /trade view - View the current trade, has it updated?\n\n**${findUpdatedInventory.initiatorTag}'s Offers:**\n\`\`\`${initiatorOffers.length ? initiatorOffers.join('\n') : "• No Items Added"}\`\`\`\n\n**${findUpdatedInventory.targetTag}'s Offers:**\n\`\`\`${targetOffers.length ? targetOffers.join('\n') : "• No Items Added"}\`\`\``)
                        .setTimestamp()
                    ],
                    components: [acceptRow]
                });

                const filter = m => parseInt(m.user.id) === parseInt(filtersId);
                const collector = mainMsg.createMessageComponentCollector({
                    filter,
                    idle: 1000 * 120,
                    time: 1000 * 120,
                    max: 1,
                });

                collector.on('collect', async (interactionCollector, reason) => {
                    if (interactionCollector.customId === "accept") {
                        await interactionCollector.deferUpdate();

                        const findTrade = await tradeData.findOne({
                            $or: [{
                                initiatorID: interaction.user.id,
                            }, {
                                targetID: interaction.user.id,
                            }]
                        });

                        let isInitiator = true;
                        if (parseInt(findTrade.initiatorID) !== parseInt(interaction.user.id)) {
                            isInitiator = false;
                        }

                        if (findTrade.initiatorOffers.length !== 0) {
                            for (let i = 0; i < findTrade.initiatorOffers.length; i++) {
                                if (findTrade.initiatorOffers[i].itemType === "poke") {
                                    const pokemon = findTrade.initiatorOffers[i].object;
                                    const findTarget = await userData.findOne({
                                        OwnerID: parseInt(findTrade.targetID)
                                    });
                                    const findMain = await userData.findOne({
                                        OwnerID: parseInt(findTrade.initiatorID)
                                    });

                                    const findtotal = await userData.aggregate([{
                                        $match: {
                                            OwnerID: parseInt(findTarget.OwnerID),
                                        }
                                    }, {
                                        $unwind: "$Inventory"
                                    }, {
                                        $sort: {
                                            "Inventory.PokemonData.PokemonOrder": -1
                                        }
                                    }]).limit(1);
                                    const incrementID = findtotal[0].Inventory.PokemonData.PokemonOrder + 1 || 1;

                                    await findMain.updateOne({
                                        $pull: {
                                            Inventory: {
                                                PokemonID: pokemon.PokemonID
                                            }
                                        }
                                    });

                                    await findTarget.updateOne({
                                        $push: {
                                            Inventory: {
                                                PokemonID: pokemon.PokemonID,
                                                PokemonName: pokemon.PokemonName,
                                                PokemonPicture: pokemon.PokemonPicture,
                                                PokemonSelected: false,
                                                PokemonOnMarket: false,
                                                PokemonData: {
                                                    PokemonOriginalOwner: pokemon.PokemonData.PokemonOriginalOwner,
                                                    PokemonLevel: pokemon.PokemonData.PokemonLevel,
                                                    PokemonXP: pokemon.PokemonData.PokemonXP,
                                                    PokemonOrder: incrementID,
                                                    PokemonIVs: {
                                                        HP: pokemon.PokemonData.PokemonIVs.HP,
                                                        Attack: pokemon.PokemonData.PokemonIVs.Attack,
                                                        Defense: pokemon.PokemonData.PokemonIVs.Defense,
                                                        SpecialAtk: pokemon.PokemonData.PokemonIVs.SpecialAtk,
                                                        SpecialDef: pokemon.PokemonData.PokemonIVs.SpecialDef,
                                                        Speed: pokemon.PokemonData.PokemonIVs.Speed,
                                                        TotalIV: pokemon.PokemonData.PokemonIVs.TotalIV
                                                    }
                                                }
                                            }
                                        }
                                    })

                                } else if (findTrade.initiatorOffers[i].itemType === "item") {
                                    const item = findTrade.initiatorOffers[i].object;
                                    const findTarget = await userData.findOne({
                                        OwnerID: parseInt(findTrade.targetID)
                                    });
                                    const findMain = await userData.findOne({
                                        OwnerID: parseInt(findTrade.initiatorID)
                                    });

                                    let targetAmountOfItem = 0;
                                    for (let i = 0; i < findTarget.Items.length; i++) {
                                        if (findTarget.Items[i].ItemName === item.ItemName) {
                                            targetAmountOfItem = findTarget.Items[i].ItemAmount;
                                        }
                                    }

                                    let mainAmountOfItem = 0;
                                    for (let i = 0; i < findMain.Items.length; i++) {
                                        if (findMain.Items[i].ItemName === item.ItemName) {
                                            mainAmountOfItem = findMain.Items[i].ItemAmount;
                                        }
                                    }

                                    const targetBalance = targetAmountOfItem + item.ItemAmount;
                                    const newMainBalance = mainAmountOfItem - item.ItemAmount;

                                    const findselected = await userData.findOne({
                                        OwnerID: parseInt(findTarget.OwnerID),
                                        "Items.ItemName": item.ItemName
                                    }, {
                                        "Inventory.$": 1
                                    });

                                    if (findselected) {
                                        await userData.findOneAndUpdate({
                                            OwnerID: parseInt(findTarget.OwnerID),
                                            "Items.ItemName": item.ItemName
                                        }, {
                                            $set: {
                                                'Items.$.ItemAmount': targetBalance
                                            }
                                        });
                                    } else {
                                        await findTarget.updateOne({
                                            $push: {
                                                Items: {
                                                    ItemName: item.ItemName,
                                                    ItemAmount: targetBalance
                                                }
                                            }
                                        })
                                    }

                                    if (newMainBalance > 0) {
                                        await userData.findOneAndUpdate({
                                            OwnerID: parseInt(findMain.OwnerID),
                                            "Items.ItemName": item.ItemName,
                                        }, {
                                            $set: {
                                                "Items.$.ItemAmount": newMainBalance
                                            }
                                        });
                                    } else {
                                        await findMain.updateOne({
                                            $pull: {
                                                Items: {
                                                    ItemName: item.ItemName
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        }

                        if (findTrade.targetOffers.length !== 0) {
                            for (let i = 0; i < findTrade.targetOffers.length; i++) {
                                if (findTrade.targetOffers[i].itemType === "poke") {
                                    const pokemon = findTrade.targetOffers[i].object;
                                    const findTarget = await userData.findOne({
                                        OwnerID: parseInt(findTrade.initiatorID)
                                    });
                                    const findMain = await userData.findOne({
                                        OwnerID: parseInt(findTrade.targetID)
                                    });

                                    const findtotal = await userData.aggregate([{
                                        $match: {
                                            OwnerID: parseInt(findTarget.OwnerID),
                                        }
                                    }, {
                                        $unwind: "$Inventory"
                                    }, {
                                        $sort: {
                                            "Inventory.PokemonData.PokemonOrder": -1
                                        }
                                    }]).limit(1);
                                    const incrementID = findtotal[0].Inventory.PokemonData.PokemonOrder + 1 || 1;

                                    await findMain.updateOne({
                                        $pull: {
                                            Inventory: {
                                                PokemonID: pokemon.PokemonID
                                            }
                                        }
                                    });

                                    await findTarget.updateOne({
                                        $push: {
                                            Inventory: {
                                                PokemonID: pokemon.PokemonID,
                                                PokemonName: pokemon.PokemonName,
                                                PokemonPicture: pokemon.PokemonPicture,
                                                PokemonSelected: false,
                                                PokemonOnMarket: false,
                                                PokemonData: {
                                                    PokemonOriginalOwner: pokemon.PokemonData.PokemonOriginalOwner,
                                                    PokemonLevel: pokemon.PokemonData.PokemonLevel,
                                                    PokemonXP: pokemon.PokemonData.PokemonXP,
                                                    PokemonOrder: incrementID,
                                                    PokemonIVs: {
                                                        HP: pokemon.PokemonData.PokemonIVs.HP,
                                                        Attack: pokemon.PokemonData.PokemonIVs.Attack,
                                                        Defense: pokemon.PokemonData.PokemonIVs.Defense,
                                                        SpecialAtk: pokemon.PokemonData.PokemonIVs.SpecialAtk,
                                                        SpecialDef: pokemon.PokemonData.PokemonIVs.SpecialDef,
                                                        Speed: pokemon.PokemonData.PokemonIVs.Speed,
                                                        TotalIV: pokemon.PokemonData.PokemonIVs.TotalIV
                                                    }
                                                }
                                            }
                                        }
                                    })
                                } else if (findTrade.targetOffers[i].itemType === "item") {
                                    const item = findTrade.targetOffers[i].object;
                                    const findTarget = await userData.findOne({
                                        OwnerID: parseInt(findTrade.initiatorID)
                                    });
                                    const findMain = await userData.findOne({
                                        OwnerID: parseInt(findTrade.targetID)
                                    });

                                    let targetAmountOfItem = 0;
                                    for (let i = 0; i < findTarget.Items.length; i++) {
                                        if (findTarget.Items[i].ItemName === item.ItemName) {
                                            targetAmountOfItem = findTarget.Items[i].ItemAmount;
                                        }
                                    }

                                    let mainAmountOfItem = 0;
                                    for (let i = 0; i < findMain.Items.length; i++) {
                                        if (findMain.Items[i].ItemName === item.ItemName) {
                                            mainAmountOfItem = findMain.Items[i].ItemAmount;
                                        }
                                    }

                                    const targetBalance = targetAmountOfItem + item.ItemAmount;
                                    const newMainBalance = mainAmountOfItem - item.ItemAmount;

                                    const findselected = await userData.findOne({
                                        OwnerID: parseInt(findTarget.OwnerID),
                                        "Items.ItemName": item.ItemName
                                    }, {
                                        "Inventory.$": 1
                                    });

                                    if (findselected) {
                                        await userData.findOneAndUpdate({
                                            OwnerID: parseInt(findTarget.OwnerID),
                                            "Items.ItemName": item.ItemName
                                        }, {
                                            $set: {
                                                'Items.$.ItemAmount': targetBalance
                                            }
                                        });
                                    } else {
                                        await findTarget.updateOne({
                                            $push: {
                                                Items: {
                                                    ItemName: item.ItemName,
                                                    ItemAmount: targetBalance
                                                }
                                            }
                                        })
                                    }

                                    if (newMainBalance > 0) {
                                        await userData.findOneAndUpdate({
                                            OwnerID: parseInt(findMain.OwnerID),
                                            "Items.ItemName": item.ItemName,
                                        }, {
                                            $set: {
                                                "Items.$.ItemAmount": newMainBalance
                                            }
                                        });
                                    } else {
                                        await findMain.updateOne({
                                            $pull: {
                                                Items: {
                                                    ItemName: item.ItemName
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        }

                        await tradeData.deleteOne({
                            $or: [{
                                initiatorID: interaction.user.id,
                            }, {
                                targetID: interaction.user.id,
                            }]
                        });

                        await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(ee.successcolor)
                                .setDescription(`The trade was accepted by both parts and all items have been transferred, thank you for using the Discmon services.`)
                            ],
                            components: [],
                            content: ' '
                        });
                    }

                    if (interactionCollector.customId === "decline") {
                        await interactionCollector.deferUpdate();

                        const findTrade = await tradeData.findOne({
                            $or: [{
                                initiatorID: interaction.user.id,
                            }, {
                                targetID: interaction.user.id,
                            }]
                        });

                        await tradeData.deleteOne({
                            $or: [{
                                initiatorID: interaction.user.id,
                            }, {
                                targetID: interaction.user.id,
                            }]
                        });

                        try {
                            const tradeChannel = await client.channels.fetch(`${findTrade.tradeChannel}`);
                            const tradeMessagef = await tradeChannel.messages.fetch(`${findTrade.tradeMessage}`);

                            await tradeMessagef.edit({
                                embeds: [
                                    new EmbedBuilder()
                                    .setColor(ee.wrongcolor)
                                    .setDescription(`The trade was declined by ${interaction.user}, please start a new one of this was a mistake!`)
                                ],
                                content: ' ',
                                components: []
                            });
                        } catch (error) {
                            if (error.message === "Unknown Message") {
                                return;
                            } else {
                                console.log(error);
                            }
                        }

                        return interaction.editReply({
                            content: ':white_check_mark: You successfully declined and cancelled the trade!',
                            ephemeral: true
                        })
                    }
                });

                collector.on('end', async (collected, reason) => {
                    try {
                        if (reason === "idle") {
                            await tradeData.findOneAndUpdate({
                                $or: [{
                                    initiatorID: interaction.user.id,
                                }, {
                                    targetID: interaction.user.id,
                                }]
                            }, {
                                inAcceptStage: false
                            });

                            await interaction.deleteReply();
                        }
                    } catch (error) {
                        if (error.message === "Unknown Message") {
                            return;
                        } else {
                            console.log(error)
                        }
                    }
                });
            }

            if (interaction.options.getSubcommandGroup() === "add") {
                if (interaction.options.getSubcommand() === "pokemon") {
                    const pokemonid = interaction.options.getInteger('pokemonid');

                    const findpoke = await userData.findOne({
                        OwnerID: parseInt(interaction.user.id),
                        "Inventory.PokemonData.PokemonOrder": pokemonid
                    }, {
                        "Inventory.$": 1
                    });

                    const findTrade = await tradeData.findOne({
                        $or: [{
                            initiatorID: interaction.user.id,
                        }, {
                            targetID: interaction.user.id,
                        }]
                    });


                    if (!findpoke) {
                        return interaction.reply({
                            content: ':x: The Pokémon with the specified ID could not be found, is the id valid?',
                            ephemeral: true
                        });
                    }

                    if (!findTrade) {
                        return interaction.reply({
                            content: ':x: No trade could be found, please start a trade before adding Pokémons!',
                            ephemeral: true
                        });
                    }

                    if (findTrade.inAcceptStage) {
                        return interaction.reply({
                            content: ':x: You may not Add or Remove items from the trade while in the accept stage!',
                            ephemeral: true
                        });
                    }

                    const findAlrAdded = await tradeData.findOne({
                        $or: [{
                            initiatorID: interaction.user.id,
                            "initiatorOffers.object.PokemonID": findpoke.Inventory[0].PokemonID
                        }, {
                            targetID: interaction.user.id,
                            "targetOffers.object.PokemonID": findpoke.Inventory[0].PokemonID
                        }]
                    });

                    if (findAlrAdded) {
                        return interaction.reply({
                            content: ':x: Looks like you have already added that Pokémon to the trade!',
                            ephemeral: true
                        })
                    }

                    let isInitiator = true;
                    if (parseInt(findTrade.initiatorID) !== parseInt(interaction.user.id)) {
                        isInitiator = false;
                    }

                    if (findpoke.Inventory[0].PokemonSelected) {
                        return interaction.reply({
                            content: ':x: That Pokémon is selected, please select another Pokémon before trading it away!',
                            ephemeral: true
                        });
                    }

                    if (findpoke.Inventory[0].PokemonOnMarket) {
                        return interaction.reply({
                            content: ':x: That Pokémon is currently listed on the market, please select another Pokémon to trade away!',
                            ephemeral: true
                        });
                    }

                    if (isInitiator) {
                        const findtotal = await tradeData.aggregate([{
                            $match: {
                                initiatorID: parseInt(interaction.user.id),
                                "initiatorOffers.itemType": "poke"
                            }
                        }, {
                            $unwind: "$initiatorOffers"
                        }, {
                            $sort: {
                                "initiatorOffers.object.PokemonData.PokemonOrder": -1
                            }
                        }]).limit(1);

                        let incrementID;
                        if (findtotal.length === 0) incrementID = 1;
                        if (findtotal.length > 0) incrementID = findtotal[0].initiatorOffers.object.PokemonData.PokemonOrder + 1;

                        await tradeData.findOneAndUpdate({
                            $or: [{
                                initiatorID: interaction.user.id,
                            }, {
                                targetID: interaction.user.id,
                            }]
                        }, {
                            $push: {
                                initiatorOffers: {
                                    itemType: "poke",
                                    object: {
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
                                                TotalIV: findpoke.Inventory[0].PokemonData.PokemonIVs.TotalIV
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    } else if (!isInitiator) {
                        const getTargetID = await tradeData.findOne({
                            targetID: interaction.user.id
                        });
                        const findtotal = await tradeData.aggregate([{
                            $match: {
                                targetID: getTargetID.targetID,
                                "targetOffers.itemType": "poke"
                            }
                        }, {
                            $unwind: "$targetOffers"
                        }, {
                            $sort: {
                                "targetOffers.object.PokemonData.PokemonOrder": -1
                            }
                        }]).limit(1);

                        let incrementID;
                        if (findtotal.length === 0) incrementID = 1;
                        if (findtotal.length > 0) incrementID = findtotal[0].targetOffers.object.PokemonData.PokemonOrder + 1;

                        await tradeData.findOneAndUpdate({
                            $or: [{
                                initiatorID: interaction.user.id,
                            }, {
                                targetID: interaction.user.id,
                            }]
                        }, {
                            $push: {
                                targetOffers: {
                                    itemType: "poke",
                                    object: {
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
                                                TotalIV: findpoke.Inventory[0].PokemonData.PokemonIVs.TotalIV
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    }

                    await interaction.reply({
                        content: ':white_check_mark: Successfully added pokemon to the trade!',
                        ephemeral: true
                    });

                    const findUpdatedInventory = await tradeData.findOne({
                        $or: [{
                            initiatorID: interaction.user.id,
                        }, {
                            targetID: interaction.user.id,
                        }]
                    });

                    let targetOffers = [];
                    for (let i = 0; i < findUpdatedInventory.targetOffers.length; i++) {
                        if (findUpdatedInventory.targetOffers[i].itemType === "poke") {
                            targetOffers.push("[" + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonOrder + "] " + findUpdatedInventory.targetOffers[i].object.PokemonName + " • Lvl. " + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonLevel + " • IV " + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonIVs.TotalIV + "%")
                        } else if (findUpdatedInventory.targetOffers[i].itemType === "item") {
                            targetOffers.push(findUpdatedInventory.targetOffers[i].object.ItemAmount + "x • " + findUpdatedInventory.targetOffers[i].object.ItemName)
                        }
                    }

                    let initiatorOffers = [];
                    for (let i = 0; i < findUpdatedInventory.initiatorOffers.length; i++) {
                        if (findUpdatedInventory.initiatorOffers[i].itemType === "poke") {
                            initiatorOffers.push("[" + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonOrder + "] " + findUpdatedInventory.initiatorOffers[i].object.PokemonName + " • Lvl. " + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonLevel + " • IV " + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonIVs.TotalIV + "%");
                        } else if (findUpdatedInventory.initiatorOffers[i].itemType === "item") {
                            initiatorOffers.push(findUpdatedInventory.initiatorOffers[i].object.ItemAmount + "x • " + findUpdatedInventory.initiatorOffers[i].object.ItemName);
                        }
                    }

                    try {

                        const tradeChannel = await client.channels.fetch(`${findTrade.tradeChannel}`);
                        const tradeMessagef = await tradeChannel.messages.fetch(`${findTrade.tradeMessage}`);

                        return tradeMessagef.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(ee.color)
                                .setDescription(`Successfully initiated trade between **${findUpdatedInventory.initiatorTag}** & **${findUpdatedInventory.targetTag}** as requested!\n\n__**How to continue**__\n• /trade add - Add something to the trade!\n• /trade remove - Remove something from the trade!\n• /trade accept - Accept the trade whenever you both agree on the items!\n• /trade decline - Decline the trade, and get all items back!\n• /trade view - View the current trade, has it updated?\n\n**${findUpdatedInventory.initiatorTag}'s Offers:**\n\`\`\`${initiatorOffers.length ? initiatorOffers.join('\n') : "• No Items Added"}\`\`\`\n\n**${findUpdatedInventory.targetTag}'s Offers:**\n\`\`\`${targetOffers.length ? targetOffers.join('\n') : "• No Items Added"}\`\`\``)
                                .setTimestamp()
                            ]
                        });

                    } catch (error) {
                        if (error.message === "Unknown Message") {
                            return;
                        } else {
                            console.log(error)
                        }
                    }
                }

                if (interaction.options.getSubcommand() === "item") {
                    const itemname = interaction.options.getString('itemname');
                    const amount = interaction.options.getInteger('amount');
                    const lowercased = itemname.toLowerCase();
                    const splitted = lowercased.split(' ');

                    let makeCapital = s => s.replace(/./, c => c.toUpperCase())

                    let name = [];
                    splitted.forEach(constructor => {
                        name.push(makeCapital(constructor))
                    });

                    const remadeName = name.join(' ');

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

                    if (amountOfItem < amount) {
                        return interaction.reply({
                            content: ':x: You are trying to give away items you do not have!',
                            ephemeral: true
                        });
                    }

                    const findTrade = await tradeData.findOne({
                        $or: [{
                            initiatorID: interaction.user.id,
                        }, {
                            targetID: interaction.user.id,
                        }]
                    });

                    if (!findTrade) {
                        return interaction.reply({
                            content: ':x: No trade could be found, please start a trade before adding Items!',
                            ephemeral: true
                        });
                    }

                    if (findTrade.inAcceptStage) {
                        return interaction.reply({
                            content: ':x: You may not Add or Remove items from the trade while in the accept stage!',
                            ephemeral: true
                        });
                    }

                    const findAlrAdded = await tradeData.findOne({
                        $or: [{
                            initiatorID: interaction.user.id,
                            "initiatorOffers.object.ItemName": remadeName
                        }, {
                            targetID: interaction.user.id,
                            "targetOffers.object.ItemName": remadeName
                        }]
                    });

                    if (findAlrAdded) {
                        return interaction.reply({
                            content: ':x: Looks like you have already added that Item to the trade!',
                            ephemeral: true
                        });
                    }

                    let isInitiator = true;
                    if (parseInt(findTrade.initiatorID) !== parseInt(interaction.user.id)) {
                        isInitiator = false;
                    }

                    if (isInitiator) {
                        await tradeData.findOneAndUpdate({
                            $or: [{
                                initiatorID: interaction.user.id,
                            }, {
                                targetID: interaction.user.id,
                            }]
                        }, {
                            $push: {
                                initiatorOffers: {
                                    itemType: "item",
                                    object: {
                                        ItemName: remadeName,
                                        ItemAmount: amount,
                                    }
                                }
                            }
                        })
                    } else if (!isInitiator) {
                        await tradeData.findOneAndUpdate({
                            $or: [{
                                initiatorID: interaction.user.id,
                            }, {
                                targetID: interaction.user.id,
                            }]
                        }, {
                            $push: {
                                targetOffers: {
                                    itemType: "item",
                                    object: {
                                        ItemName: remadeName,
                                        ItemAmount: amount,
                                    }
                                }
                            }
                        })
                    }

                    await interaction.reply({
                        content: ':white_check_mark: Successfully added item to the trade!',
                        ephemeral: true
                    });

                    const findUpdatedInventory = await tradeData.findOne({
                        $or: [{
                            initiatorID: interaction.user.id,
                        }, {
                            targetID: interaction.user.id,
                        }]
                    });

                    let targetOffers = [];
                    for (let i = 0; i < findUpdatedInventory.targetOffers.length; i++) {
                        if (findUpdatedInventory.targetOffers[i].itemType === "item") {
                            targetOffers.push(findUpdatedInventory.targetOffers[i].object.ItemAmount + "x • " + findUpdatedInventory.targetOffers[i].object.ItemName)
                        } else if (findUpdatedInventory.targetOffers[i].itemType === "poke") {
                            targetOffers.push("[" + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonOrder + "] " + findUpdatedInventory.targetOffers[i].object.PokemonName + " • Lvl. " + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonLevel + " • IV " + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonIVs.TotalIV + "%")
                        }
                    }

                    let initiatorOffers = [];
                    for (let i = 0; i < findUpdatedInventory.initiatorOffers.length; i++) {
                        if (findUpdatedInventory.initiatorOffers[i].itemType === "item") {
                            initiatorOffers.push(findUpdatedInventory.initiatorOffers[i].object.ItemAmount + "x • " + findUpdatedInventory.initiatorOffers[i].object.ItemName);
                        } else if (findUpdatedInventory.initiatorOffers[i].itemType === "poke") {
                            initiatorOffers.push("[" + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonOrder + "] " + findUpdatedInventory.initiatorOffers[i].object.PokemonName + " • Lvl. " + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonLevel + " • IV " + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonIVs.TotalIV + "%");
                        }
                    }

                    try {

                        const tradeChannel = await client.channels.fetch(`${findTrade.tradeChannel}`);
                        const tradeMessagef = await tradeChannel.messages.fetch(`${findTrade.tradeMessage}`);

                        return tradeMessagef.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(ee.color)
                                .setDescription(`Successfully initiated trade between **${findUpdatedInventory.initiatorTag}** & **${findUpdatedInventory.targetTag}** as requested!\n\n__**How to continue**__\n• /trade add - Add something to the trade!\n• /trade remove - Remove something from the trade!\n• /trade accept - Accept the trade whenever you both agree on the items!\n• /trade decline - Decline the trade, and get all items back!\n• /trade view - View the current trade, has it updated?\n\n**${findUpdatedInventory.initiatorTag}'s Offers:**\n\`\`\`${initiatorOffers.length ? initiatorOffers.join('\n') : "• No Items Added"}\`\`\`\n\n**${findUpdatedInventory.targetTag}'s Offers:**\n\`\`\`${targetOffers.length ? targetOffers.join('\n') : "• No Items Added"}\`\`\``)
                                .setTimestamp()
                            ]
                        });

                    } catch (error) {
                        if (error.message === "Unknown Message") {
                            return;
                        } else {
                            console.log(error)
                        }
                    }
                }
            }

            if (interaction.options.getSubcommandGroup() === "remove") {
                if (interaction.options.getSubcommand() === "pokemon") {
                    const pokemonid = interaction.options.getInteger('pokemonid');

                    const findTrade = await tradeData.findOne({
                        $or: [{
                            initiatorID: interaction.user.id,
                        }, {
                            targetID: interaction.user.id,
                        }]
                    });

                    if (!findTrade) {
                        return interaction.reply({
                            content: ':x: No trade could be found, please start a trade before adding Pokémons!',
                            ephemeral: true
                        });
                    }

                    if (findTrade.inAcceptStage) {
                        return interaction.reply({
                            content: ':x: You may not Add or Remove items from the trade while in the accept stage!',
                            ephemeral: true
                        });
                    }

                    let isInitiator = true;
                    if (parseInt(findTrade.initiatorID) !== parseInt(interaction.user.id)) {
                        isInitiator = false;
                    }

                    if (isInitiator) {
                        const findpoke = await tradeData.findOne({
                            initiatorID: interaction.user.id,
                            "initiatorOffers.object.PokemonData.PokemonOrder": pokemonid
                        }, {
                            "initiatorOffers.$": 1
                        });

                        if (!findpoke) {
                            return interaction.reply({
                                content: ':x: The supplied objectID was not found in the trade rooster, is the ID real?',
                                ephemeral: true
                            })
                        }

                        await tradeData.findOneAndUpdate({
                            initiatorID: interaction.user.id,
                        }, {
                            $pull: {
                                initiatorOffers: {
                                    "object.PokemonData.PokemonOrder": pokemonid,
                                }
                            }
                        });
                    } else {
                        const findpoke = await tradeData.findOne({
                            targetID: interaction.user.id,
                            "targetOffers.object.PokemonData.PokemonOrder": pokemonid
                        }, {
                            "targetOffers.$": 1
                        });

                        if (!findpoke) {
                            return interaction.reply({
                                content: ':x: The supplied objectID was not found in the trade rooster, is the ID real?',
                                ephemeral: true
                            });
                        }

                        await tradeData.findOneAndUpdate({
                            targetID: interaction.user.id,
                        }, {
                            $pull: {
                                targetOffers: {
                                    "object.PokemonData.PokemonOrder": pokemonid,
                                }
                            }
                        });
                    }

                    await interaction.reply({
                        content: ':white_check_mark: Successfully removed the item from the trade!',
                    });

                    const findUpdatedInventory = await tradeData.findOne({
                        $or: [{
                            initiatorID: interaction.user.id,
                        }, {
                            targetID: interaction.user.id,
                        }]
                    });

                    let targetOffers = [];
                    for (let i = 0; i < findUpdatedInventory.targetOffers.length; i++) {
                        if (findUpdatedInventory.targetOffers[i].itemType === "poke") {
                            targetOffers.push("[" + findUpdatedInventory.targetOffers[i].object.PokemonOrder + "] " + findUpdatedInventory.targetOffers[i].object.PokemonName + " • Lvl. " + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonLevel + " • IV " + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonIVs.TotalIV + "%")
                        } else if (findUpdatedInventory.targetOffers[i].itemType === "item") {
                            targetOffers.push(findUpdatedInventory.targetOffers[i].object.ItemAmount + "x • " + findUpdatedInventory.targetOffers[i].object.ItemName);
                        }
                    }

                    let initiatorOffers = [];
                    for (let i = 0; i < findUpdatedInventory.initiatorOffers.length; i++) {
                        if (findUpdatedInventory.initiatorOffers[i].itemType === "poke") {
                            initiatorOffers.push("[" + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonOrder + "] " + findUpdatedInventory.initiatorOffers[i].object.PokemonName + " • Lvl. " + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonLevel + " • IV " + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonIVs.TotalIV + "%");
                        } else if (findUpdatedInventory.initiatorOffers[i].itemType === "item") {
                            initiatorOffers.push(findUpdatedInventory.initiatorOffers[i].object.ItemAmount + "x • " + findUpdatedInventory.initiatorOffers[i].object.ItemName);
                        }
                    }

                    try {

                        const tradeChannel = await client.channels.fetch(`${findTrade.tradeChannel}`);
                        const tradeMessagef = await tradeChannel.messages.fetch(`${findTrade.tradeMessage}`);

                        return tradeMessagef.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(ee.color)
                                .setDescription(`Successfully initiated trade between **${findUpdatedInventory.initiatorTag}** & **${findUpdatedInventory.targetTag}** as requested!\n\n__**How to continue**__\n• /trade add - Add something to the trade, make sure it is valid!\n• /trade accept - Accept the trade whenever you both agree on the items!\n• /trade decline - Decline the trade, and get all items back!\n• /trade view - View the current trade, has it updated?\n\n**${findUpdatedInventory.initiatorTag}'s Offers:**\n\`\`\`${initiatorOffers.length ? initiatorOffers.join('\n') : "• No Items Added"}\`\`\`\n\n**${findUpdatedInventory.targetTag}'s Offers:**\n\`\`\`${targetOffers.length ? targetOffers.join('\n') : "• No Items Added"}\`\`\``)
                                .setTimestamp()
                            ]
                        });

                    } catch (error) {
                        if (error.message === "Unknown Message") {
                            return;
                        } else {
                            console.log(error)
                        }
                    }
                }

                if (interaction.options.getSubcommand() === "item") {
                    const itemname = interaction.options.getString('itemname');
                    const lowercased = itemname.toLowerCase();
                    const splitted = lowercased.split(' ');

                    let makeCapital = s => s.replace(/./, c => c.toUpperCase())

                    let name = [];
                    splitted.forEach(constructor => {
                        name.push(makeCapital(constructor))
                    });

                    const remadeName = name.join(' ');

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

                    const findTrade = await tradeData.findOne({
                        $or: [{
                            initiatorID: interaction.user.id,
                        }, {
                            targetID: interaction.user.id,
                        }]
                    });

                    if (!findTrade) {
                        return interaction.reply({
                            content: ':x: No trade could be found, please start a trade before adding Items!',
                            ephemeral: true
                        });
                    }

                    if (findTrade.inAcceptStage) {
                        return interaction.reply({
                            content: ':x: You may not Add or Remove items from the trade while in the accept stage!',
                            ephemeral: true
                        });
                    }

                    const findAlrAdded = await tradeData.findOne({
                        $or: [{
                            initiatorID: interaction.user.id,
                            "initiatorOffers.object.ItemName": remadeName
                        }, {
                            targetID: interaction.user.id,
                            "targetOffers.object.ItemName": remadeName
                        }]
                    });

                    if (!findAlrAdded) {
                        return interaction.reply({
                            content: ':x: Looks like that item is not added to the trade!',
                            ephemeral: true
                        });
                    }

                    let isInitiator = true;
                    if (parseInt(findTrade.initiatorID) !== parseInt(interaction.user.id)) {
                        isInitiator = false;
                    }

                    if (isInitiator) {
                        await tradeData.findOneAndUpdate({
                            $or: [{
                                initiatorID: interaction.user.id,
                            }, {
                                targetID: interaction.user.id,
                            }]
                        }, {
                            $pull: {
                                initiatorOffers: {
                                    "object.ItemName": remadeName
                                }
                            }
                        })
                    } else if (!isInitiator) {
                        await tradeData.findOneAndUpdate({
                            $or: [{
                                initiatorID: interaction.user.id,
                            }, {
                                targetID: interaction.user.id,
                            }]
                        }, {
                            $pull: {
                                targetOffers: {
                                    "object.ItemName": remadeName
                                }
                            }
                        })
                    }

                    await interaction.reply({
                        content: ':white_check_mark: Successfully removed item from the trade!',
                        ephemeral: true
                    });

                    const findUpdatedInventory = await tradeData.findOne({
                        $or: [{
                            initiatorID: interaction.user.id,
                        }, {
                            targetID: interaction.user.id,
                        }]
                    });

                    let targetOffers = [];
                    for (let i = 0; i < findUpdatedInventory.targetOffers.length; i++) {
                        if (findUpdatedInventory.targetOffers[i].itemType === "item") {
                            targetOffers.push(findUpdatedInventory.targetOffers[i].object.ItemAmount + "x • " + findUpdatedInventory.targetOffers[i].object.ItemName)
                        } else if (findUpdatedInventory.targetOffers[i].itemType === "poke") {
                            targetOffers.push("[" + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonOrder + "] " + findUpdatedInventory.targetOffers[i].object.PokemonName + " • Lvl. " + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonLevel + " • IV " + findUpdatedInventory.targetOffers[i].object.PokemonData.PokemonIVs.TotalIV + "%")
                        }
                    }

                    let initiatorOffers = [];
                    for (let i = 0; i < findUpdatedInventory.initiatorOffers.length; i++) {
                        if (findUpdatedInventory.initiatorOffers[i].itemType === "item") {
                            initiatorOffers.push(findUpdatedInventory.initiatorOffers[i].object.ItemAmount + "x • " + findUpdatedInventory.initiatorOffers[i].object.ItemName);
                        } else if (findUpdatedInventory.initiatorOffers[i].itemType === "poke") {
                            initiatorOffers.push("[" + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonOrder + "] " + findUpdatedInventory.initiatorOffers[i].object.PokemonName + " • Lvl. " + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonLevel + " • IV " + findUpdatedInventory.initiatorOffers[i].object.PokemonData.PokemonIVs.TotalIV + "%");
                        }
                    }

                    try {

                        const tradeChannel = await client.channels.fetch(`${findTrade.tradeChannel}`);
                        const tradeMessagef = await tradeChannel.messages.fetch(`${findTrade.tradeMessage}`);

                        return tradeMessagef.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(ee.color)
                                .setDescription(`Successfully initiated trade between **${findUpdatedInventory.initiatorTag}** & **${findUpdatedInventory.targetTag}** as requested!\n\n__**How to continue**__\n• /trade add (type) (value) (amount) - Add something to the trade, make sure it is valid!\n• /trade accept - Accept the trade whenever you both agree on the items!\n• /trade decline - Decline the trade, and get all items back!\n• /trade view - View the current trade, has it updated?\n\n**${findUpdatedInventory.initiatorTag}'s Offers:**\n\`\`\`${initiatorOffers.length ? initiatorOffers.join('\n') : "• No Items Added"}\`\`\`\n\n**${findUpdatedInventory.targetTag}'s Offers:**\n\`\`\`${targetOffers.length ? targetOffers.join('\n') : "• No Items Added"}\`\`\``)
                                .setTimestamp()
                            ]
                        });

                    } catch (error) {
                        if (error.message === "Unknown Message") {
                            return;
                        } else {
                            console.log(error)
                        }
                    }
                }
            }
        }
    }