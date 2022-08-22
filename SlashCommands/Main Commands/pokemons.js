    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        ButtonBuilder,
        ActionRowBuilder,
        ButtonStyle
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    const {
        EmbedBuilder
    } = require('@discordjs/builders');
    const {
        calculatePercentage
    } = require('../../handler/functions');
    const userdata = require("../../schemas/userData");

    module.exports = {
        name: 'pokemons',
        description: 'View all your Pokémons in one list!',
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

            const ownedpokemons = await userdata.findOne({
                OwnerID: parseInt(interaction.user.id),
            })

            const pokemons = ownedpokemons.Inventory;

            let currentPage = 0;
            const embeds = generatePokemonEmbed(pokemons, currentPage)

            if (pokemons.length > 20) {
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
                }
            })

            collector.on('end', async (collected) => {
                if (collected.size > 0) {
                    for (let i = 0; i < mainRow.components.length; i++) {
                        mainRow.components[i].setDisabled(true);
                    }

                    await interaction.editReply({
                        components: [mainRow]
                    });
                }
            })

            function generatePokemonEmbed(ownedpokes, currentPage) {
                const embeds = [];
                let k = 20;
                for (let i = 0; i < ownedpokes.length; i += 20) {
                    const current = ownedpokes.slice(i, k);
                    let j = i;
                    k += 20;
                    const info = current.map(currentpokemon => `\`${currentpokemon.PokemonData.PokemonOrder}\` **${currentpokemon.PokemonName}**　•　Lvl. ${currentpokemon.PokemonData.PokemonLevel}　•　IV ${currentpokemon.PokemonData.PokemonIVs.TotalIV}%`).join('\n');
                    const embed = new EmbedBuilder()
                        .setDescription(`${info}`)
                        .setTitle(`Your Pokémons`)
                        .setColor(ee.color)
                    embeds.push(embed)
                }
                return embeds;
            }
        }
    }