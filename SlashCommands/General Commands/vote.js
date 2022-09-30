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
    const {
        EmbedBuilder
    } = require('@discordjs/builders');
    const {
        findUser
    } = require("../../handler/functions");

    module.exports = {
        name: 'vote',
        description: 'Vote for the Pokémon bot and gain some special benefits!',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            const user = await findUser(interaction.user.id);

            const votedcooldown = parseInt(user.VotedCooldown);

            let cooldown = 43201000;
            if (Date.now() >= votedcooldown + cooldown || votedcooldown === 0) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setTitle(`Voting Rewards`)
                        .setDescription(`Vote for us on [top.gg](https://top.gg/bot/1011002384064970944/vote) to recieve tokens that can then be spent in the Shop. You can vote once per 12 hours!`)
                        .addFields([{
                            name: 'Voting Timer',
                            value: `Your vote seems to be ready, vote and get your rewards now!`
                        }])
                        .setFooter({
                            text: 'Voting rewards will be automatically added to you after a vote has been successfully sent.'
                        })
                    ]
                })
            } else {
                let cooldown = 43201000;
                const timetobe = votedcooldown + cooldown;
                const timenow = Date.now();
                const timeleft = timetobe - timenow

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setTitle(`Voting Rewards`)
                        .setDescription(`Vote for us on [top.gg](https://top.gg/bot/1011002384064970944/vote) to recieve tokens that can then be spent in the Shop. You can vote once per 12 hours!`)
                        .addFields([{
                            name: 'Voting Timer',
                            value: `You can vote again in **${prettyMilliseconds(timeleft, {verbose: true})}**!`
                        }])
                        .setFooter({
                            text: 'Voting rewards will be automatically added to you after a vote has been successfully sent.'
                        })
                    ]
                })
            }
        }
    }