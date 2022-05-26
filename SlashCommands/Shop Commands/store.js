    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        ActionRowBuilder,
        ButtonBuilder,
        ButtonStyle
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    const {
        EmbedBuilder
    } = require('@discordjs/builders');
    const paypal = require('paypal-rest-sdk');

    module.exports = {
        name: 'store',
        description: 'View our epic integrated Store!',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {

            paypal.configure({
                'mode': 'sandbox', //sandbox or live
                'client_id': 'ARpPxx2G6K_vpO7Pju2RjgJrPh2t5iwCI6sfHX3LiAK7qOv_TQ4QAR6Yb8T6eBctmdgshRhLa6udqoOu',
                'client_secret': 'EOSJg-PMtceyZ1vdKA3OUFgmSPOWJWMJ2XUQ-WyVVDhflZs2saTOJ6TdR3Jz-yPCtdCdOcI_-69K72x9'
            });

            //BUTTON CONSTRUCTORS
            const storeRow = new ActionRowBuilder()
            storeRow.addComponents([
                new ButtonBuilder()
                .setLabel('Poke Roles')
                .setCustomId('pokeroles')
                .setStyle(ButtonStyle.Primary)
            ])
            storeRow.addComponents([
                new ButtonBuilder()
                .setLabel('Poketokens')
                .setCustomId('poketokens')
                .setStyle(ButtonStyle.Primary)
            ])
            storeRow.addComponents([
                new ButtonBuilder()
                .setLabel('Pokecoins')
                .setCustomId('pokecoins')
                .setStyle(ButtonStyle.Primary)
            ])
            storeRow.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "❌"
                })
                .setLabel('Exit')
                .setCustomId('exit')
                .setStyle(ButtonStyle.Primary)
            ])

            const rolesRow = new ActionRowBuilder()
            rolesRow.addComponents([
                new ButtonBuilder()
                .setLabel('Bronze Trainer')
                .setCustomId('bronze')
                .setStyle(ButtonStyle.Success)
            ])
            rolesRow.addComponents([
                new ButtonBuilder()
                .setLabel('Silver Trainer')
                .setCustomId('silver')
                .setStyle(ButtonStyle.Success)
            ])
            rolesRow.addComponents([
                new ButtonBuilder()
                .setLabel('Gold Trainer')
                .setCustomId('gold')
                .setStyle(ButtonStyle.Success)
            ])
            rolesRow.addComponents([
                new ButtonBuilder()
                .setLabel('Platinum Trainer')
                .setCustomId('platinum')
                .setStyle(ButtonStyle.Success)
            ])
            rolesRow.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "❌"
                })
                .setLabel('Main Page')
                .setCustomId('Mainpage')
                .setStyle(ButtonStyle.Danger)
            ])

            const tokensRow = new ActionRowBuilder()
            tokensRow.addComponents([
                new ButtonBuilder()
                .setLabel('100 Tokens')
                .setCustomId('tokens1')
                .setStyle(ButtonStyle.Success)
            ])
            tokensRow.addComponents([
                new ButtonBuilder()
                .setLabel('550 Tokens')
                .setCustomId('tokens2')
                .setStyle(ButtonStyle.Success)
            ])
            tokensRow.addComponents([
                new ButtonBuilder()
                .setLabel('1250 Tokens')
                .setCustomId('tokens3')
                .setStyle(ButtonStyle.Success)
            ])
            tokensRow.addComponents([
                new ButtonBuilder()
                .setLabel('2750 Tokens')
                .setCustomId('tokens4')
                .setStyle(ButtonStyle.Success)
            ])
            tokensRow.addComponents([
                new ButtonBuilder()
                .setLabel('4150 Tokens')
                .setCustomId('tokens5')
                .setStyle(ButtonStyle.Success)
            ])
            const tokens2Row = new ActionRowBuilder()
            tokens2Row.addComponents([
                new ButtonBuilder()
                .setLabel('9000 Tokens')
                .setCustomId('tokens6')
                .setStyle(ButtonStyle.Success)
            ])
            tokens2Row.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "❌"
                })
                .setLabel('Main Page')
                .setCustomId('Mainpage')
                .setStyle(ButtonStyle.Danger)
            ])

            const coinsRow = new ActionRowBuilder()
            coinsRow.addComponents([
                new ButtonBuilder() //0.99
                .setLabel('25000 Coins')
                .setCustomId('coins1')
                .setStyle(ButtonStyle.Success)
            ])
            coinsRow.addComponents([
                new ButtonBuilder() //4.99
                .setLabel('115000 Coins')
                .setCustomId('coins2')
                .setStyle(ButtonStyle.Success)
            ])
            coinsRow.addComponents([
                new ButtonBuilder() //9.99
                .setLabel('250000 Coins')
                .setCustomId('coins3')
                .setStyle(ButtonStyle.Success)
            ])
            coinsRow.addComponents([
                new ButtonBuilder() //19.99
                .setLabel('600000 Coins')
                .setCustomId('coins4')
                .setStyle(ButtonStyle.Success)
            ])
            coinsRow.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "❌"
                })
                .setLabel('Main Page')
                .setCustomId('Mainpage')
                .setStyle(ButtonStyle.Danger)
            ])


            //EMBED CONSTRUCTORS
            const mainEmbed = new EmbedBuilder()
            mainEmbed.setColor(ee.color)
            mainEmbed.setTitle(`Discmon • Storepage`)
            mainEmbed.setDescription(`Welcome to the Discmon Storepage! This is where you can buy digital goods, and boost your account on the way to become the best trainer of them all!\nPlease select a category by clicking on one of the buttons below.\n\n***Poke Roles*** • Buy yourself a Role that will boost your account in the future, this role will contain discounts and also different boosts on your adventure.\n***Poketokens*** • Poketokens is the premium currency of Discmon, this will allow you to purchase redeems and so much more from our shop. Make sure not to waste all of them, you never know what'll be added!\n***Pokecoins*** • The main currency, this is what you use to pay for everything, gotta make sure not to waste it all!`)
            mainEmbed.setAuthor({
                name: "Discmon • Store",
                iconURL: client.user.displayAvatarURL()
            })

            const rolesEmbed = new EmbedBuilder()
            rolesEmbed.setColor(ee.color)
            rolesEmbed.setTitle(`Discmon • Purchase Roles`)
            rolesEmbed.setDescription(`Click the correct Button to purchase something from us, please have your DMs open to complete this!\n\n***Bronze Trainer*** • $0.99\n***Silver Trainer*** • $4.99\n***Gold Trainer*** • $9.99\n***Platinum Trainer*** • $19.99`)
            rolesEmbed.setAuthor({
                name: "Discmon • Roles",
                iconURL: client.user.displayAvatarURL()
            })

            const tokensEmbed = new EmbedBuilder()
            tokensEmbed.setColor(ee.color)
            tokensEmbed.setTitle(`Discmon • Purchase Tokens`)
            tokensEmbed.setDescription(`Click the correct Button to purchase something from us, please have your DMs open to complete this!\n\n***100 Tokens*** • $0.99\n***550 Tokens*** • $4.99\n***1250 Tokens*** • $9.99\n***2750 Tokens*** • $14.99\n***4150 Tokens*** • $24.99\n***9000 Tokens*** • $49.99`)
            rolesEmbed.setAuthor({
                name: "Discmon • Tokens",
                iconURL: client.user.displayAvatarURL()
            })

            const coinsEmbed = new EmbedBuilder()
            coinsEmbed.setColor(ee.color)
            coinsEmbed.setTitle(`Discmon • Purchase Coins`)
            coinsEmbed.setDescription(`Click the correct Button to purchase something from us, please have your DMs open to complete this!\n\n***25,000 Coins*** • $0.99\n***115,000 Coins*** • $4.99\n***250,000 Coins*** • $9.99\n***600,000 Coins*** • $19.99`)
            coinsEmbed.setAuthor({
                name: "Discmon • Coins",
                iconURL: client.user.displayAvatarURL()
            })


            await interaction.reply({
                embeds: [mainEmbed],
                components: [storeRow],
                fetchReply: true
            })

            const newInteraction = await interaction.fetchReply()

            let filter = m => m.user.id === interaction.user.id;

            const collector = newInteraction.createMessageComponentCollector({
                filter,
                idle: 1000 * 60,
                time: 1000 * 120
            });

            collector.on('collect', async (interactionCollector) => {
                if (interactionCollector.customId === "pokeroles") {
                    await interactionCollector.deferUpdate();
                    await interactionCollector.editReply({
                        embeds: [rolesEmbed],
                        components: [rolesRow],
                        fetchReply: true
                    })
                }

                if (interactionCollector.customId === "poketokens") {
                    await interactionCollector.deferUpdate()
                    await interactionCollector.editReply({
                        embeds: [tokensEmbed],
                        components: [tokensRow, tokens2Row],
                        fetchReply: true
                    })
                }

                if (interactionCollector.customId === "pokecoins") {
                    await interactionCollector.deferUpdate()
                    await interactionCollector.editReply({
                        embeds: [coinsEmbed],
                        components: [coinsRow],
                        fetchReply: true
                    })
                }

                if (interactionCollector.customId === "Mainpage") {
                    await interactionCollector.deferUpdate();
                    await interactionCollector.editReply({
                        embeds: [mainEmbed],
                        components: [storeRow],
                        fetchReply: true
                    })
                }

                //ROLES

                if (interactionCollector.customId === "bronze") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!'
                    })

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3500/success/roles/bronze",
                            "cancel_url": "http://localhost:3500/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "Bronze Donator",
                                    "sku": `item`,
                                    "price": "0.99",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "0.99"
                            },
                            "description": `Product paid by: ${interaction.user.id}`
                        }]
                    };

                    paypal.payment.create(create_payment_json, async function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    try {
                                        await interaction.user.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor(ee.color)
                                                .setAuthor({
                                                    name: 'Discmon • Bronze Trainer',
                                                    iconURL: client.user.displayAvatarURL()
                                                })
                                                .setTitle(`Discmon • Order Created`)
                                                .setFooter({
                                                    text: 'The product will be automatically added to your inventory after purchase!'
                                                })
                                                .setDescription(`Successfully created order for **Bronze Trainer**.\n[**Click Here**](${payment.links[i].href}) in order to pay for the item(s) that you have ordered.\n\n***WARNING: Purchasing a lower rank than you already have will overwrite your current one with the new one!***`)
                                            ]
                                        })
                                    } catch (error) {
                                        if (error.rawError.message === "Cannot send messages to this user") {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: Failed to send message, please open your DMs before using this command again.'
                                            })
                                        } else {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if (interactionCollector.customId === "silver") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!'
                    })

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3500/success/roles/silver",
                            "cancel_url": "http://localhost:3500/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "Silver Donator",
                                    "sku": `item`,
                                    "price": "4.99",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "4.99"
                            },
                            "description": `Product paid by: ${interaction.user.id}`
                        }]
                    };

                    paypal.payment.create(create_payment_json, async function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    try {
                                        await interaction.user.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor(ee.color)
                                                .setAuthor({
                                                    name: 'Discmon • Silver Trainer',
                                                    iconURL: client.user.displayAvatarURL()
                                                })
                                                .setTitle(`Discmon • Order Created`)
                                                .setFooter({
                                                    text: 'The product will be automatically added to your inventory after purchase!'
                                                })
                                                .setDescription(`Successfully created order for **Silver Trainer**.\n[**Click Here**](${payment.links[i].href}) in order to pay for the item(s) that you have ordered.\n\n***WARNING: Purchasing a lower rank than you already have will overwrite your current one with the new one!***`)
                                            ]
                                        })
                                    } catch (error) {
                                        if (error.rawError.message === "Cannot send messages to this user") {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: Failed to send message, please open your DMs before using this command again.'
                                            })
                                        } else {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if (interactionCollector.customId === "gold") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!'
                    })

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3500/success/roles/gold",
                            "cancel_url": "http://localhost:3500/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "Gold Donator",
                                    "sku": `item`,
                                    "price": "9.99",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "9.99"
                            },
                            "description": `Product paid by: ${interaction.user.id}`
                        }]
                    };

                    paypal.payment.create(create_payment_json, async function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    try {
                                        await interaction.user.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor(ee.color)
                                                .setAuthor({
                                                    name: 'Discmon • Gold Trainer',
                                                    iconURL: client.user.displayAvatarURL()
                                                })
                                                .setTitle(`Discmon • Order Created`)
                                                .setFooter({
                                                    text: 'The product will be automatically added to your inventory after purchase!'
                                                })
                                                .setDescription(`Successfully created order for **Gold Trainer**.\n[**Click Here**](${payment.links[i].href}) in order to pay for the item(s) that you have ordered.\n\n***WARNING: Purchasing a lower rank than you already have will overwrite your current one with the new one!***`)
                                            ]
                                        })
                                    } catch (error) {
                                        if (error.rawError.message === "Cannot send messages to this user") {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: Failed to send message, please open your DMs before using this command again.'
                                            })
                                        } else {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if (interactionCollector.customId === "platinum") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!'
                    })

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3500/success/roles/platinum",
                            "cancel_url": "http://localhost:3500/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "Platinum Donator",
                                    "sku": `item`,
                                    "price": "19.99",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "19.99"
                            },
                            "description": `Product paid by: ${interaction.user.id}`
                        }]
                    };

                    paypal.payment.create(create_payment_json, async function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    try {
                                        await interaction.user.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor(ee.color)
                                                .setAuthor({
                                                    name: 'Discmon • Platinum Trainer',
                                                    iconURL: client.user.displayAvatarURL()
                                                })
                                                .setTitle(`Discmon • Order Created`)
                                                .setFooter({
                                                    text: 'The product will be automatically added to your inventory after purchase!'
                                                })
                                                .setDescription(`Successfully created order for **Platinum Trainer**.\n[**Click Here**](${payment.links[i].href}) in order to pay for the item(s) that you have ordered.\n\n***WARNING: Purchasing a lower rank than you already have will overwrite your current one with the new one!***`)
                                            ]
                                        })
                                    } catch (error) {
                                        if (error.rawError.message === "Cannot send messages to this user") {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: Failed to send message, please open your DMs before using this command again.'
                                            })
                                        } else {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                //TOKENS

                if (interactionCollector.customId === "tokens1") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!'
                    })

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3500/success/tokens/t1",
                            "cancel_url": "http://localhost:3500/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "100 Tokens",
                                    "sku": `item`,
                                    "price": "0.99",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "0.99"
                            },
                            "description": `Product paid by: ${interaction.user.id}`
                        }]
                    };

                    paypal.payment.create(create_payment_json, async function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    try {
                                        await interaction.user.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor(ee.color)
                                                .setAuthor({
                                                    name: 'Discmon • 100 Tokens',
                                                    iconURL: client.user.displayAvatarURL()
                                                })
                                                .setTitle(`Discmon • Order Created`)
                                                .setFooter({
                                                    text: 'The product will be automatically added to your inventory after purchase!'
                                                })
                                                .setDescription(`Successfully created order for **100 Tokens**.\n[**Click Here**](${payment.links[i].href}) in order to pay for the item(s) that you have ordered.`)
                                            ]
                                        })
                                    } catch (error) {
                                        if (error.rawError.message === "Cannot send messages to this user") {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: Failed to send message, please open your DMs before using this command again.'
                                            })
                                        } else {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if (interactionCollector.customId === "tokens2") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!'
                    })

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3500/success/tokens/t2",
                            "cancel_url": "http://localhost:3500/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "550 Tokens",
                                    "sku": `item`,
                                    "price": "4.99",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "4.99"
                            },
                            "description": `Product paid by: ${interaction.user.id}`
                        }]
                    };

                    paypal.payment.create(create_payment_json, async function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    try {
                                        await interaction.user.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor(ee.color)
                                                .setAuthor({
                                                    name: 'Discmon • 550 Tokens',
                                                    iconURL: client.user.displayAvatarURL()
                                                })
                                                .setTitle(`Discmon • Order Created`)
                                                .setFooter({
                                                    text: 'The product will be automatically added to your inventory after purchase!'
                                                })
                                                .setDescription(`Successfully created order for **550 Tokens**.\n[**Click Here**](${payment.links[i].href}) in order to pay for the item(s) that you have ordered.`)
                                            ]
                                        })
                                    } catch (error) {
                                        if (error.rawError.message === "Cannot send messages to this user") {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: Failed to send message, please open your DMs before using this command again.'
                                            })
                                        } else {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if (interactionCollector.customId === "tokens3") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!'
                    })

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3500/success/tokens/t3",
                            "cancel_url": "http://localhost:3500/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "1250 Tokens",
                                    "sku": `item`,
                                    "price": "9.99",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "9.99"
                            },
                            "description": `Product paid by: ${interaction.user.id}`
                        }]
                    };

                    paypal.payment.create(create_payment_json, async function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    try {
                                        await interaction.user.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor(ee.color)
                                                .setAuthor({
                                                    name: 'Discmon • 1250 Tokens',
                                                    iconURL: client.user.displayAvatarURL()
                                                })
                                                .setTitle(`Discmon • Order Created`)
                                                .setFooter({
                                                    text: 'The product will be automatically added to your inventory after purchase!'
                                                })
                                                .setDescription(`Successfully created order for **1250 Tokens**.\n[**Click Here**](${payment.links[i].href}) in order to pay for the item(s) that you have ordered.`)
                                            ]
                                        })
                                    } catch (error) {
                                        if (error.rawError.message === "Cannot send messages to this user") {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: Failed to send message, please open your DMs before using this command again.'
                                            })
                                        } else {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if (interactionCollector.customId === "tokens4") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!'
                    })

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3500/success/tokens/t4",
                            "cancel_url": "http://localhost:3500/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "2750 Tokens",
                                    "sku": `item`,
                                    "price": "14.99",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "14.99"
                            },
                            "description": `Product paid by: ${interaction.user.id}`
                        }]
                    };

                    paypal.payment.create(create_payment_json, async function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    try {
                                        await interaction.user.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor(ee.color)
                                                .setAuthor({
                                                    name: 'Discmon • 2750 Tokens',
                                                    iconURL: client.user.displayAvatarURL()
                                                })
                                                .setTitle(`Discmon • Order Created`)
                                                .setFooter({
                                                    text: 'The product will be automatically added to your inventory after purchase!'
                                                })
                                                .setDescription(`Successfully created order for **2750 Tokens**.\n[**Click Here**](${payment.links[i].href}) in order to pay for the item(s) that you have ordered.`)
                                            ]
                                        })
                                    } catch (error) {
                                        if (error.rawError.message === "Cannot send messages to this user") {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: Failed to send message, please open your DMs before using this command again.'
                                            })
                                        } else {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if (interactionCollector.customId === "tokens5") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!'
                    })

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3500/success/tokens/t5",
                            "cancel_url": "http://localhost:3500/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "4150 Tokens",
                                    "sku": `item`,
                                    "price": "24.99",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "24.99"
                            },
                            "description": `Product paid by: ${interaction.user.id}`
                        }]
                    };

                    paypal.payment.create(create_payment_json, async function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    try {
                                        await interaction.user.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor(ee.color)
                                                .setAuthor({
                                                    name: 'Discmon • 4150 Tokens',
                                                    iconURL: client.user.displayAvatarURL()
                                                })
                                                .setTitle(`Discmon • Order Created`)
                                                .setFooter({
                                                    text: 'The product will be automatically added to your inventory after purchase!'
                                                })
                                                .setDescription(`Successfully created order for **4150 Tokens**.\n[**Click Here**](${payment.links[i].href}) in order to pay for the item(s) that you have ordered.`)
                                            ]
                                        })
                                    } catch (error) {
                                        if (error.rawError.message === "Cannot send messages to this user") {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: Failed to send message, please open your DMs before using this command again.'
                                            })
                                        } else {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if (interactionCollector.customId === "tokens6") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!'
                    })

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3500/success/tokens/t6",
                            "cancel_url": "http://localhost:3500/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "9000 Tokens",
                                    "sku": `item`,
                                    "price": "49.99",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "49.99"
                            },
                            "description": `Product paid by: ${interaction.user.id}`
                        }]
                    };

                    paypal.payment.create(create_payment_json, async function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    try {
                                        await interaction.user.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor(ee.color)
                                                .setAuthor({
                                                    name: 'Discmon • 9000 Tokens',
                                                    iconURL: client.user.displayAvatarURL()
                                                })
                                                .setTitle(`Discmon • Order Created`)
                                                .setFooter({
                                                    text: 'The product will be automatically added to your inventory after purchase!'
                                                })
                                                .setDescription(`Successfully created order for **9000 Tokens**.\n[**Click Here**](${payment.links[i].href}) in order to pay for the item(s) that you have ordered.`)
                                            ]
                                        })
                                    } catch (error) {
                                        if (error.rawError.message === "Cannot send messages to this user") {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: Failed to send message, please open your DMs before using this command again.'
                                            })
                                        } else {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                //COINS

                if (interactionCollector.customId === "coins1") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!'
                    })

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3500/success/coins/c1",
                            "cancel_url": "http://localhost:3500/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "25000 Coins",
                                    "sku": `item`,
                                    "price": "0.99",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "0.99"
                            },
                            "description": `Product paid by: ${interaction.user.id}`
                        }]
                    };

                    paypal.payment.create(create_payment_json, async function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    try {
                                        await interaction.user.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor(ee.color)
                                                .setAuthor({
                                                    name: 'Discmon • 25000 Coins',
                                                    iconURL: client.user.displayAvatarURL()
                                                })
                                                .setTitle(`Discmon • Order Created`)
                                                .setFooter({
                                                    text: 'The product will be automatically added to your inventory after purchase!'
                                                })
                                                .setDescription(`Successfully created order for **25000 Coins**.\n[**Click Here**](${payment.links[i].href}) in order to pay for the item(s) that you have ordered.`)
                                            ]
                                        })
                                    } catch (error) {
                                        if (error.rawError.message === "Cannot send messages to this user") {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: Failed to send message, please open your DMs before using this command again.'
                                            })
                                        } else {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if (interactionCollector.customId === "coins2") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!'
                    })

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3500/success/coins/c2",
                            "cancel_url": "http://localhost:3500/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "115000 Coins",
                                    "sku": `item`,
                                    "price": "4.99",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "4.99"
                            },
                            "description": `Product paid by: ${interaction.user.id}`
                        }]
                    };

                    paypal.payment.create(create_payment_json, async function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    try {
                                        await interaction.user.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor(ee.color)
                                                .setAuthor({
                                                    name: 'Discmon • 115000 Coins',
                                                    iconURL: client.user.displayAvatarURL()
                                                })
                                                .setTitle(`Discmon • Order Created`)
                                                .setFooter({
                                                    text: 'The product will be automatically added to your inventory after purchase!'
                                                })
                                                .setDescription(`Successfully created order for **115000 Coins**.\n[**Click Here**](${payment.links[i].href}) in order to pay for the item(s) that you have ordered.`)
                                            ]
                                        })
                                    } catch (error) {
                                        if (error.rawError.message === "Cannot send messages to this user") {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: Failed to send message, please open your DMs before using this command again.'
                                            })
                                        } else {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if (interactionCollector.customId === "coins3") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!'
                    })

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3500/success/coins/c3",
                            "cancel_url": "http://localhost:3500/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "250000 Coins",
                                    "sku": `item`,
                                    "price": "9.99",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "9.99"
                            },
                            "description": `Product paid by: ${interaction.user.id}`
                        }]
                    };

                    paypal.payment.create(create_payment_json, async function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    try {
                                        await interaction.user.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor(ee.color)
                                                .setAuthor({
                                                    name: 'Discmon • 250000 Coins',
                                                    iconURL: client.user.displayAvatarURL()
                                                })
                                                .setTitle(`Discmon • Order Created`)
                                                .setFooter({
                                                    text: 'The product will be automatically added to your inventory after purchase!'
                                                })
                                                .setDescription(`Successfully created order for **250000 Coins**.\n[**Click Here**](${payment.links[i].href}) in order to pay for the item(s) that you have ordered.`)
                                            ]
                                        })
                                    } catch (error) {
                                        if (error.rawError.message === "Cannot send messages to this user") {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: Failed to send message, please open your DMs before using this command again.'
                                            })
                                        } else {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if (interactionCollector.customId === "coins4") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!'
                    })

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:3500/success/coins/c4",
                            "cancel_url": "http://localhost:3500/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "600000 Coins",
                                    "sku": `item`,
                                    "price": "19.99",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "19.99"
                            },
                            "description": `Product paid by: ${interaction.user.id}`
                        }]
                    };

                    paypal.payment.create(create_payment_json, async function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === "approval_url") {
                                    try {
                                        await interaction.user.send({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor(ee.color)
                                                .setAuthor({
                                                    name: 'Discmon • 600000 Coins',
                                                    iconURL: client.user.displayAvatarURL()
                                                })
                                                .setTitle(`Discmon • Order Created`)
                                                .setFooter({
                                                    text: 'The product will be automatically added to your inventory after purchase!'
                                                })
                                                .setDescription(`Successfully created order for **600000 Coins**.\n[**Click Here**](${payment.links[i].href}) in order to pay for the item(s) that you have ordered.`)
                                            ]
                                        })
                                    } catch (error) {
                                        if (error.rawError.message === "Cannot send messages to this user") {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: Failed to send message, please open your DMs before using this command again.'
                                            })
                                        } else {
                                            await interactionCollector.editReply({
                                                embeds: [],
                                                components: [],
                                                content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                //OTHERS

                if (interactionCollector.customId === "exit") {
                    await interactionCollector.deferUpdate();

                    await interactionCollector.deleteReply();

                    await collector.stop();
                }
            });

            collector.on('end', async (interactionCollected) => {
                if (interactionCollected.size === 0) {
                    for (let i = 0; i < storeRow.components.length; i++) {
                        storeRow.components[i].setDisabled(true);
                    }

                    await interaction.editReply({
                        components: [storeRow]
                    });
                } else {
                    const lastregistered = interactionCollected.last();

                    if (lastregistered.customId === 'pokecoins') {
                        if (interactionCollected.content === ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!') {
                            return;
                        }

                        for (let i = 0; i < coinsRow.components.length; i++) {
                            coinsRow.components[i].setDisabled(true);
                        }

                        await interaction.editReply({
                            components: [coinsRow]
                        });
                    }

                    if (lastregistered.customId === 'pokeroles') {
                        if (interactionCollected.content === ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!') {
                            return;
                        }

                        for (let i = 0; i < rolesRow.components.length; i++) {
                            rolesRow.components[i].setDisabled(true);
                        }

                        await interaction.editReply({
                            components: [rolesRow]
                        });
                    }

                    if (lastregistered.customId === 'poketokens') {
                        if (interactionCollected.content === ':white_check_mark: Successfully have sent you a DM containing all the information, please continue from there!') {
                            return;
                        }

                        for (let i = 0; i < tokensRow.components.length; i++) {
                            tokensRow.components[i].setDisabled(true);
                        }
                        for (let i = 0; i < tokens2Row.components.length; i++) {
                            tokens2Row.components[i].setDisabled(true);
                        }

                        await interaction.editReply({
                            components: [tokensRow, tokens2Row]
                        });
                    }

                    if (lastregistered.customId === 'exit') {
                        return;
                    }
                }
            })
        }
    }