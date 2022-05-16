const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    EmbedBuilder
} = require("discord.js");
const ee = require("../../botconfig/embed.json");
const emoji = require("../../botconfig/emojis.json");
const {
    evaluate
} = require("mathjs");

module.exports = {
    name: 'ping',
    description: 'Get the current Bot & Api ping!',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        try {
            const embed = new EmbedBuilder()
            const footerOptions = {
                text: `Requested by ${interaction.user.tag}`, // Author = name || footer = text
                iconURL: `${interaction.member.displayAvatarURL()}`
            }
            await interaction.reply({
                embeds: [
                    embed.setColor(ee.color)
                    .addFields([{
                        name: 'Bot Latency',
                        value: `\`\`\`re\n[ ${Math.floor((Date.now() - interaction.createdTimestamp) - 2 * Math.floor(client.ws.ping))}ms ]\`\`\``,
                        inline: true
                    }, {
                        name: 'API Latency',
                        value: `\`\`\`re\n[ ${Math.floor(client.ws.ping)}ms ]\`\`\``,
                        inline: true
                    }, ])
                    .setFooter(footerOptions)
                ]
            })
        } catch (e) {
            console.log(String(e.stack))
        }
    }
}

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/