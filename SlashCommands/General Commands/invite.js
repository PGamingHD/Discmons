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
                    .setDescription(`**Invite Me**\n[Invite](https://discord.com/api/oauth2/authorize?client_id=968900553168015361&permissions=137439341640&scope=applications.commands%20bot)\n\n**Support Server**\n[Support](https://discord.gg/discmon)`)
                ]
            })
        }
    }