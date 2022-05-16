const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const emoji = require('../../botconfig/emojis.json')
const ee = require('../../botconfig/embed.json');
const config = require('../../botconfig/config.json');
const prettyMilliseconds = require('pretty-ms')
const {
    evaluate
} = require('mathjs');

module.exports = {
    name: 'devinfo',
    aliases: ['devi', 'devinf'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (!config.ownerID.includes(message.author.id)) return;

        const guilds = client.guilds.cache.map(guild => "- " + guild.name).join("\n");
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                .setColor(ee.color)
                .setTitle(`🤖 Total Servers 🤖`)
                .setDescription(`\`\`\`yaml\n${guilds.substr(0, 2048)}\`\`\``)
                .setFooter(message.author.tag, message.author.displayAvatarURL({
                    dynamic: true
                }))
            ]
        })
    },
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/