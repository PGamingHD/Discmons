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
const schema = require('../schemas/Servers');

client.on("guildCreate", async (guild, Client) => {

    const hasdata = await schema.findOne({
        ServerID: guild.id
    });

    if (hasdata) {
        console.log("HAS DATA")
    } else {
        const creation = await schema.create({
            ServerID: guild.id
        })
        console.log(creation);
    }
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/