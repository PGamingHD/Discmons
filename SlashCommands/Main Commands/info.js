    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        ActionRowBuilder,
        ButtonBuilder,
        ButtonStyle,
        EmbedBuilder
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json')
    const userdata = require("../../schemas/userData");

    module.exports = {
        name: 'info',
        description: 'Get information about the currently selected pokemon!',
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

            /*const findselected = await userdata.findOne({
                OwnerID: parseInt(interaction.user.id),
                "Inventory.PokemonSelected": true
            }, {
                "Inventory.$": 1
            });*/

            let selectedNum;
            for (let i = 0; i < ownedpokemons.Inventory.length; i++) {
                if (ownedpokemons.Inventory[i].PokemonSelected) {
                    selectedNum = ownedpokemons.Inventory[i].PokemonData.PokemonOrder;
                }
            }

            let currentPage = selectedNum - 1;
            const embeds = generateInfoEmbed(pokemons, currentPage)

            if (pokemons.length > 1) {
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
                        currentPage = 0;
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
                        currentPage = embeds.length - 1;
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
            });

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

            function generateInfoEmbed(ownedpokes, currentPage) {
                const embeds = []
                let k = 1;
                for (let i = 0; i < ownedpokes.length; i += 1) {
                    const current = ownedpokes.slice(i, k);
                    let j = i;
                    k += 1;
                    const embed = new EmbedBuilder()
                        .setColor(ee.color)
                        .setImage(ownedpokes[i].PokemonPicture)
                        .setTitle(`${ownedpokes[i].PokemonFavorited ? "⭐" : ""}Level. ${ownedpokes[i].PokemonData.PokemonLevel} ${ownedpokes[i].PokemonName}`)
                        .setDescription(`__**Details**__\n**XP**: ${ownedpokes[i].PokemonData.PokemonXP}/${ownedpokes[i].PokemonData.PokemonLevel * 750}\n**Gender**: NOT ADDED YET\n**Nature**: NOT ADDED YET\n\n__**Stats**__\n**HP**: ${ownedpokes[i].PokemonData.PokemonIVs.HP}/31\n**Attack**: ${ownedpokes[i].PokemonData.PokemonIVs.Attack}/31\n**Defense**: ${ownedpokes[i].PokemonData.PokemonIVs.Defense}/31\n**Special Attack**: ${ownedpokes[i].PokemonData.PokemonIVs.SpecialAtk}/31\n**Special Defense**: ${ownedpokes[i].PokemonData.PokemonIVs.SpecialDef}/31\n**Speed**: ${ownedpokes[i].PokemonData.PokemonIVs.Speed}/31\n**Total IVs**: ${ownedpokes[i].PokemonData.PokemonIVs.TotalIV}%\n\n__**Extras**__\n**ID**: ${ownedpokes[i].PokemonData.PokemonOrder}\n**Pokémon ID**: ${ownedpokes[i].PokemonID}\n**Original Trainer ID:** ${ownedpokes[i].PokemonData.PokemonOriginalOwner}`)
                        .setFooter({
                            text: `ID: ${ownedpokes[i].PokemonData.PokemonOrder}\nPokémon ID: ${ownedpokes[i].PokemonID}`
                        })
                    embeds.push(embed)
                }
                return embeds;
            }
        }
    }