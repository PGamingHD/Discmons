const client = require("../index");
const config = require("../botconfig/config.json");
const emoji = require("../botconfig/emojis.json");
const { Cron } = require("croner");
const {
    ActivityType,
    Interaction
} = require("discord.js");
const chalk = require("chalk");
const spawnedPokes = require("../schemas/Spawned");
const {
    startupCooldown
} = require("../index");

client.on("ready", async (client) => {
    try {
        try {
            const stringlength = 69;
            console.log(chalk.green(`[LOGIN] <==> || I successfully logged into ${client.user.tag} and started ALL services || <==> [LOGIN]`));
            console.log(chalk.red(`[COOLDOWN] <==> || Entering bot cooldown for 60 seconds while the Database connects correctly! || <==> [COOLDOWN]`));
        } catch {}

        const act1 = {
            text: `over ${client.guilds.cache.reduce((a, g) => a + g.memberCount,0)} users!`,
            type: ActivityType.Watching,
        }
        const act2 = {
            text: `with around ${client.guilds.cache.size} servers!`,
            type: ActivityType.Playing,
        }
        const act3 = {
            text: `over the awesome support server!`,
            type: ActivityType.Watching,
        }
        const act4 = {
            text: `get help with /help!`,
            type: ActivityType.Playing
        }
        const activities = [
            act1,
            act2,
            act3,
            act4
        ]

        const job = Cron('00 */15 * * * *', () => {
            const random = Math.floor(Math.random() * activities.length);

            client.user.setActivity(activities[random].text, {
                type: activities[random].type,
                url: config.status.url
            })
        });

        startupCooldown.set("startupcooldown", true);

        setTimeout(() => {
            startupCooldown.delete("startupcooldown");
            console.log(chalk.green(`[COOLDOWN] <==> || Cooldown is now over and everyone has been given access to the bot services again! || <==> [COOLDOWN]`));
        }, 1000 * 60);

        //await spawnedPokes.deleteMany().then(console.log(chalk.green('[DATABASE] <==> || Successfully wiped all spawned pokemons for new restart! || <==> [DATABASE]')))
        
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