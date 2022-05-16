const client = require("../index");
const config = require("../botconfig/config.json");
const emoji = require("../botconfig/emojis.json");
const schedule = require("node-schedule");
const {
    ActivityType,
    Interaction
} = require("discord.js");

client.on("ready", async (client) => {
    try {
        try {
            const stringlength = 69;
            console.log(`[LOGIN] <==> || I successfully logged into ${client.user.tag} and started ALL services || <==> [LOGIN]`)
        } catch {}

        client.user.setActivity(config.status.text, {
            type: ActivityType.Watching,
            url: config.status.url
        })
        
    } catch (e) {
        console.log(String(e.stack))
    }
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/