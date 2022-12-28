    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        ActionRowBuilder,
        ButtonStyle,
        ButtonBuilder,
        EmbedBuilder
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json')
    const userData = require('../../schemas/userData');

    module.exports = {
        name: 'bag',
        description: 'View your purchased items from your bag.',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {

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

            const bagitems = await userData.findOne({
                OwnerID: interaction.user.id
            })

            const user = bagitems;
            const ownedbagitems = bagitems.Items;

            if(ownedbagitems.length === 0) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`***You do not have any owned items in your bag at the moment.***`)
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTitle(`Your Item Bag`)
                        .setColor(ee.color)
                        .setFooter({
                            text: 'Page 1 of 1'
                        })
                    ]
                })
            }

            let currentPage = 0;
            const embeds = generateShopEmbed(ownedbagitems, currentPage, user)

            if (ownedbagitems.length > 6) {
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
                if(ownedbagitems.length > 6){
                    for (let i = 0; i < mainRow.components.length; i++) {
                        mainRow.components[i].setDisabled(true);
                    }
    
                    await interaction.editReply({
                        components: [mainRow]
                    });
                }
            })

            function generateShopEmbed(ownedpokes, currentPage, user) {
                const embeds = []
                let k = 6;
                for (let i = 0; i < ownedpokes.length; i += 6) {
                    const current = ownedpokes.slice(i, k);
                    let j = i;
                    k += 6;

                    const embed = new EmbedBuilder()

                    current.map(item => {
                        embed.addFields([{
                            name: `**${item.ItemName}**`,
                            value: `**Owned:** x${item.ItemAmount.toLocaleString('en-US')}`,
                            inline: true
                        }])
                    })

                    embed.setDescription(`**Pokécoins**: ${parseInt(user.Pokecoins).toLocaleString('en-US')}\n**Pokétokens**: ${parseInt(user.Poketokens).toLocaleString('en-US')}\n\nUse your buttons to flip pages and display more items!`)
                    embed.setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    embed.setTitle(`Your Item Bag`)
                    embed.setColor(ee.color)
                    embeds.push(embed)
                }
                return embeds;
            }
        }
    }