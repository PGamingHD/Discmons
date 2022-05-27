    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        EmbedBuilder
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    const dev = require("../../schemas/developerData");

    module.exports = {
        name: 'ping',
        description: 'Get the current Client & API ping.',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {

            const timeBefore = new Date().getTime();
            await dev.findOne({
                developerAccess: "accessStringforDeveloperOnly"
            })
            const timeAfter = new Date().getTime();
            const evaled = timeAfter - timeBefore;

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setAuthor({
                        name: `Pong`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .addFields([{
                        name: 'Bot Latency',
                        value: `\`\`\`re\n[ ${Math.floor((Date.now() - interaction.createdTimestamp) - 2 * Math.floor(client.ws.ping))}ms ]\`\`\``,
                        inline: true
                    }, {
                        name: 'API Latency',
                        value: `\`\`\`re\n[ ${Math.floor(client.ws.ping)}ms ]\`\`\``,
                        inline: true
                    }, {
                        name: 'Database Latency',
                        value: `\`\`\`re\n[ ${evaled}ms ]\`\`\``
                    }])
                    .setTimestamp()
                    .setFooter({
                        text: `Requested by ${interaction.user.username}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                ]
            })
        }
    }