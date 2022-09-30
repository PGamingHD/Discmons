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
 
    module.exports = {
        name: 'invite',
        description: 'Interested in inviting me, or maybe joining our support server?',
        startCmd: true,
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`Want to join our Support Server or Invite me?`)
                    .setDescription(`**Invite Me**\n[Invite](${config.mainInvite})\n\n**Support Server**\n[Support](https://discord.gg/xQFFRzhJu2)`)
                ]
            })
        }
    }