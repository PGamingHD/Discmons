    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json')
    const axios = require('axios');
    const userData = require('../../schemas/userData');
    const {
        EmbedBuilder
    } = require('@discordjs/builders');

    module.exports = {
        name: 'vote',
        description: 'Vote for the Pokémon bot and gain some special benefits!',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            const user = await userData.findOne({
                OwnerID: parseInt(interaction.user.id)
            })

            let cooldown = 43201000;
            if (Math.floor(Date.now() / 1000) >= user.VotedCooldown + cooldown || user.VotedCooldown === 0) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setTitle(`Voting Rewards`)
                        .setDescription(`Vote for us on [top.gg](https://top.gg/bot/904757023797813339/vote) to recieve tokens that can then be spent in the Shop. You can vote once per 12 hours!`)
                        .addFields([{
                            name: 'Voting Timer',
                            value: `Your vote seems to be ready, vote and get your rewards now!`
                        }])
                    ],
                    ephemeral: true
                })
            } else {
                let cooldown = 43201000;
                const timetobe = user.VotedCooldown + cooldown;
                const timenow = Math.floor(Date.now() / 1000);
                const timeleft = timetobe - timenow

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setTitle(`Voting Rewards`)
                        .setDescription(`Vote for us on [top.gg](https://top.gg/bot/904757023797813339/vote) to recieve tokens that can then be spent in the Shop. You can vote once per 12 hours!`)
                        .addFields([{
                            name: 'Voting Timer',
                            value: `You can vote again in **${prettyMilliseconds(timeleft, {verbose: true})}**!`
                        }])
                    ],
                    ephemeral: true
                })
            }
        }
    }