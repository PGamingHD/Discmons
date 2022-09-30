const client = require("../index");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const {
    Cron
} = require("croner");
const {
    ActivityType,
    Interaction
} = require("discord.js");
const chalk = require("chalk");
const spawnedPokes = require("../schemas/Spawned");
const {
    startupCooldown
} = require("../index");
const {
    sendWebhook
} = require("../handler/functions");

client.on("ready", async (client) => {
    try {
        const stringlength = 69;
        console.log(chalk.green(`[LOGIN] <==> || I successfully logged into ${client.user.tag} and started ALL services || <==> [LOGIN]`));
        sendWebhook("https://discord.com/api/webhooks/1024361902266138727/p-UFqyZWePDE_m5FrajWEIwJiAPfNvAVwdBIJsxRiISjF-0HwtHaGKkiFFavrtk0gCgo", "Login/Start successful", `Succesfully logged into ${client.user.tag} and started all services!`, ee.color);
        console.log(chalk.red(`[COOLDOWN] <==> || Entering bot cooldown for 60 seconds while the Database connects correctly! || <==> [COOLDOWN]`));

        const act1 = {
            text: `over ${client.guilds.cache.reduce((a, g) => a + g.memberCount,0)} users!`,
            type: ActivityType.Watching,
        }
        const act2 = {
            text: `with ${client.guilds.cache.size} guilds!`,
            type: ActivityType.Playing,
        }
        const act3 = {
            text: `over the support server!`,
            type: ActivityType.Watching,
        }
        const act4 = {
            text: `Help @ /help!`,
            type: ActivityType.Watching
        }
        const act5 = {
            text: `Changes @ /changelog`,
            type: ActivityType.Watching
        }
        const activities = [
            act1,
            act2,
            act3,
            act4,
            act5
        ]

        Cron('00 */15 * * * *', () => {
            const random = Math.floor(Math.random() * activities.length);

            client.user.setActivity(activities[random].text, {
                type: activities[random].type
            })
        });

        startupCooldown.set("startupcooldown", true);

        setTimeout(() => {
            startupCooldown.delete("startupcooldown");
            console.log(chalk.green(`[COOLDOWN] <==> || Cooldown is now over and everyone has been given access to the bot services again! || <==> [COOLDOWN]`));
            sendWebhook("https://discord.com/api/webhooks/1024361902266138727/p-UFqyZWePDE_m5FrajWEIwJiAPfNvAVwdBIJsxRiISjF-0HwtHaGKkiFFavrtk0gCgo", "Cooldown Over", "The cooldown has now been disabled, and everyone now has access again!", ee.color);
        }, 1000 * 60);
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