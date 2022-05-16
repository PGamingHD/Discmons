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
    name: "shards", //userMoney, userBank, userBitcoin, userID (ALL USERVALUES)
    aliases: ['shardstatus', 'shardinfo'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, con) => {
        return message.reply({
            embeds: [
                new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(
                    `This feature is currently disabled, check back later.`
                ),
            ],
        });
        client.shard
            .broadcastEval((client) => [
                client.shard.ids,
                client.uptime,
                client.ws.ping,
                client.guilds.cache.size,
                client.shard.mode,
                client.users.cache.size,
                client.user.presence.status,
            ])
            .then((results) => {
                const embed = new MessageEmbed()
                    .setTitle(`:robot: Shard information - [${client.shard.count}]`)
                    .setDescription(
                        `This guild is managed by shard: **${message.guild.shardId}**`
                    )
                    .setColor(client.embedColor);
                results.map((data) => {
                    embed.addField(
                        `📡 Shard ${data[0]}`,
                        `**Uptime:** ${prettyMilliseconds(data[1])}\n**Ping:** ${
            data[2]
          }ms\n**Guilds:** ${data[3]}\n**Users:** ${data[5]}\n**Mode:** ${
            data[4]
          }`,
                        true
                    );
                });
                message.reply({
                    embeds: [embed]
                });
            })
            .catch((error) => {
                console.error(error);
                message.reply(`❌ Error.`);
            });
    }
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/