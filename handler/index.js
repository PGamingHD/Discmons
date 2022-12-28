const {
    glob
} = require("glob");
const {
    promisify
} = require("util");
const {
    Client
} = require("discord.js");

//DATABASE
const mongoose = require("mongoose");
require('dotenv').config();
const spawnedPokes = require("../schemas/Spawned");

const globPromise = promisify(glob);
const chalk = require("chalk");
const ee = require("../botconfig/embed.json");
const {
    sendWebhook
} = require("../handler/functions");
const {
    readdirSync
} = require("fs");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = {
                directory,
                ...file
            };
            client.commands.set(file.name, properties);
        }
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    console.log(process.cwd())
    const slashCommands = await globPromise(`${process.cwd()}/SlashCommands/**/*.js`);

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        await client.application.commands.set(arrayOfSlashCommands).then(console.log(chalk.green("[SLASH COMMANDS] <==> || Successfully loaded all slash commands globally! || <==> [SLASH COMMANDS]")))
        try{
            const changelogs = readdirSync('./Changelog/');
            changelogs.map(file => {
                const filecontent = require(`../Changelog/${file}`);
                const number = filecontent['ChangelogNumber'];
                client.changelog.set(number, {
                    ChangelogTitle: filecontent['ChangelogTitle'],
                    ChangelogDescription: filecontent['ChangelogDescription'],
                    ChangelogTimestamp: filecontent['ChangelogTimestamp']
                })
            });
            await mongoose.connect(process.env.MONGODB_CONNECT || '', {
                keepAlive: true,
                dbName: 'Discmons',
            }).then(() => console.log(chalk.green("[DATABASE] <==> || Successfully connected to the MongoDB database! || <==> [DATABASE]"))).then(async () => await spawnedPokes.deleteMany().then(console.log(chalk.green('[DATABASE] <==> || Successfully wiped all spawned pokemons for new restart! || <==> [DATABASE]'))))
        } catch(dberror) {
            console.log(chalk.red(`[DATABASE] <==> || Database seems to have ran into an error and could not connect! || <==> [DATABASE]\n\n${dberror}`));
            sendWebhook("https://discord.com/api/webhooks/1057285030138876024/SffUgz8sWtwa6Ms04KQSHZYumEn6y1O8lIJBcimrmcOt5xYrqB9tsUoBH_B_FvPdVmFK", "Database connection failed", "It seems as if the Database connection has failed, please have a look at that!", ee.wrongcolor);
        }
    });
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/