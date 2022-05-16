const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const config = require("../../botconfig/config.json");
const {
    evaluate
} = require("mathjs");

module.exports = {
    name: "ping", //userMoney, userBank, userBitcoin, userID (ALL USERVALUES)
    aliases: ['latency', 'pingbot'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, con) => {
        try {
            //GET DB PING!
            const timeBefore = new Date().getTime();
            con.query(`SELECT 1`);
            const timeAfter = new Date().getTime();
            const evaled = evaluate(`${timeAfter} - ${timeBefore}`);
            //GOT DB PING!

            let embed = new MessageEmbed()
            await message.reply({
                    content: `***${emoji.loading} PINGING***`,
                    //ephemeral: true
                })
                .then(newMsg => newMsg.edit({
                    content: `***${emoji.success} PINGED***`,
                    embeds: [
                        embed.setColor(ee.color)
                        .setAuthor(`Pong`, client.user.displayAvatarURL())
                        .addField(`Bot Latency`, `\`\`\`re\n[ ${Math.floor((Date.now() - message.createdTimestamp) - 2 * Math.floor(client.ws.ping))}ms ]\`\`\``, true)
                        .addField(`API Latency`, `\`\`\`re\n[ ${Math.floor(client.ws.ping)}ms ]\`\`\``, true).setTimestamp()
                        .addField(`Database Latency`, `\`\`\`re\n[ ${evaled}ms ]\`\`\``)
                        .setFooter(`Requested by ${message.author.username}`, `${message.author.displayAvatarURL()}`)
                    ],
                    // embeds: [embed.setColor(ee.color).setTitle(`${emoji.loading} | Bot Ping: \`${Math.floor((Date.now() - message.createdTimestamp) - 2 * Math.floor(client.ws.ping))} ms\`\n\n${emoji.loading} | Api Ping: \`${Math.floor(client.ws.ping)} ms\``)],
                    //ephemeral: true
                }).catch(e => {
                    return console.log(e)
                }))
                .catch(e => {
                    console.log(e)
                })

        } catch (e) {
            console.log(String(e.stack))
        }
    },
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/