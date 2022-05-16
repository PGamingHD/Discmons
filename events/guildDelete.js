const {
    Message,
    MessageEmbed,
    WebhookClient,
    EmbedBuilder
} = require("discord.js");
const emoji = require("../botconfig/emojis.json")
const ee = require("../botconfig/embed.json");
const config = require("../botconfig/config.json");
const client = require("../index");
const webhook = new WebhookClient({
    url: config.webhookLogs
});

client.on("guildDelete", async (guild, client) => {
    try {

        const footerOptions = {
            text: '© discord.gg/botdeveloper | Developed by PGamingHD#0666'
        }

        webhook.send({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(`:x: Kicked from Server :x:`)
                .setDescription(`***Guild Name:***\n${guild.name}\n\n***Guild Size:***\n${guild.memberCount}\n\n***Guild ID:***\n${guild.id}\n\n***Guild Owner:*** <@!${guild.ownerId}>`)
                .setFooter(footerOptions)
            ]
        });
    } catch {}
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/