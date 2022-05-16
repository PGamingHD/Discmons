const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const {
    api
} = require("../../index");
let cpuStat = require("cpu-stat");
let os = require("os");
const prettyMilliseconds = require("pretty-ms");
const config = require("../../botconfig/config.json")

module.exports = {
    name: "information", //userMoney, userBank, userBitcoin, userID (ALL USERVALUES)
    aliases: ['info', 'botinfo'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, con, prefix) => {
        const buttonrow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setURL(
                    "https://discord.com/api/oauth2/authorize?client_id=904757023797813339&permissions=517543939136&scope=bot%20applications.commands"
                )
                .setStyle("LINK")
                .setLabel("Invite")
            )
            .addComponents(
                new MessageButton()
                .setURL("https://www.discord.gg/pxySje4GPC")
                .setStyle("LINK")
                .setLabel("Support")
            )
        return message.reply({
            embeds: [
                new MessageEmbed()
                .setColor(ee.color)
                .setTitle(`PizzaParadise Information`)
                .setDescription(`Hello, my name is PizzaParadise. I am a bot developed by \`@PGamingHD#0666\` and I am currently serving over **${client.guilds.cache.reduce((a, g) => a + g.memberCount,0).toLocaleString('en-US')}** users.\n\nNeed help? Use the \`${prefix}help\` command to get started!\n\nHave any further questions? Join our Support Server to ask for further questions.`)
                .setThumbnail(ee.footericon)
            ],
            components: [buttonrow]
        })
    }
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/