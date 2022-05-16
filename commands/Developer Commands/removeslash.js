const {
    Message,
    Client,
    MessageEmbed
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const config = require("../../botconfig/config.json")

module.exports = {
    name: "removeslash", //userMoney, userBank, userBitcoin, userID (ALL USERVALUES)
    aliases: ['removeslashcmd', 'removeslashcmds'],
    cooldown: 1,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (!config.ownerID.includes(message.author.id)) return;
        client.application?.commands.set([]); // REMOVE ALL SLASH COMMANDS FROM ALL GUILDS! (WILL BE REINSTATED UPON RESTART)

        message.reply({
            embeds: [
                new MessageEmbed()
                .setColor("AA00FF")
                .setDescription(`Global slash commands removed upon request.`),
            ],
        });
    },
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/