    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        EmbedBuilder,
        ActionRowBuilder,
        ButtonStyle,
        ButtonBuilder
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/emojis.json');
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    const userData = require('../../schemas/userData');
 
    module.exports = {
        name: 'leaderboard',
        description: "Display various leaderboards, maybe one day you'll be on there?",
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            const lbTypes = new ActionRowBuilder()
            lbTypes.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "🪙"
                })
                .setLabel('Pokécoins')
                .setCustomId('pokecoins')
                .setStyle(ButtonStyle.Primary)
            ])
            lbTypes.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "🏦"
                })
                .setLabel('Pokétokens')
                .setCustomId('poketokens')
                .setStyle(ButtonStyle.Primary)
            ])
            lbTypes.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "🧺"
                })
                .setLabel('Caught')
                .setCustomId('caught')
                .setStyle(ButtonStyle.Primary)
            ])
            lbTypes.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "✉️"
                })
                .setLabel('Votes')
                .setCustomId('votes')
                .setStyle(ButtonStyle.Primary)
            ])

            const initialReply = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`Please choose a leaderboard type below!`)
                    .setTimestamp()
                ],
                components: [lbTypes]
            });

            let filter = m => m.user.id === interaction.user.id;
            const collector = initialReply.createMessageComponentCollector({
                filter,
                idle: 1000 * 60,
                time: 1000 * 120
            });

            collector.on('collect', async (interactionCollector) => {
                if (interactionCollector.customId === "pokecoins") {
                    await interactionCollector.deferUpdate();
                    const vals = await userData.find({}).sort({
                        Pokecoins: -1
                    }).limit(12);

                    const newArray = [];
                    for (let i = 0; i < vals.length; i++) {
                        const getUser = await client.users.fetch(`${vals[i].OwnerID}`, {
                            force: true
                        });
                        newArray.push({
                            name: `${getUser.tag}`,
                            value: `${emoji.pokecoin} ${parseInt(vals[i].Pokecoins).toLocaleString('en-US')}`,
                            inline: true
                        });
                    }
                    
                    return interactionCollector.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setTitle(`Pokécoins Leaderboard`)
                            .setFields(newArray)
                            .setTimestamp()
                            .setFooter({
                                text: 'Pokécoins Leaderboard'
                            })
                        ],
                    });
                }

                if (interactionCollector.customId === "poketokens") {
                    await interactionCollector.deferUpdate();
                    const vals = await userData.find({}).sort({
                        Poketokens: -1
                    }).limit(12);

                    const newArray = [];
                    for (let i = 0; i < vals.length; i++) {
                        const getUser = await client.users.fetch(`${vals[i].OwnerID}`, {
                            force: true
                        });
                        newArray.push({
                            name: `${getUser.tag}`,
                            value: `${emoji.token} ${parseInt(vals[i].Poketokens).toLocaleString('en-US')}`,
                            inline: true
                        });
                    }
                    
                    return interactionCollector.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setTitle(`Pokétokens Leaderboard`)
                            .setFields(newArray)
                            .setTimestamp()
                            .setFooter({
                                text: 'Pokétokens Leaderboard'
                            })
                        ],
                    });
                }

                if (interactionCollector.customId === "caught") {
                    await interactionCollector.deferUpdate();
                    return interactionCollector.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setTitle(`Caught Leaderboard`)
                            .setDescription(`COMING SOON!`)
                            //.setFields(newArray)
                            .setTimestamp()
                            .setFooter({
                                text: 'Caught Leaderboard'
                            })
                        ],
                    });
                }

                if (interactionCollector.customId === "votes") {
                    await interactionCollector.deferUpdate();
                    return interactionCollector.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setTitle(`Votes Leaderboard`)
                            .setDescription(`COMING SOON!`)
                            //.setFields(newArray)
                            .setTimestamp()
                            .setFooter({
                                text: 'Votes Leaderboard'
                            })
                        ],
                    });
                }
            });
        }
    }