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
    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/**/*.js`
    );

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
            await mongoose.connect(process.env.MONGODB_CONNECT || '', {
                keepAlive: true,
                dbName: 'Discmons',
            }).then(() => console.log(chalk.green("[DATABASE] <==> || Successfully connected to the MongoDB database! || <==> [DATABASE]"))).then(async () => await spawnedPokes.deleteMany().then(console.log(chalk.green('[DATABASE] <==> || Successfully wiped all spawned pokemons for new restart! || <==> [DATABASE]'))))
        } catch(dberror) {
            console.log(chalk.red(`[DATABASE] <==> || Database seems to have ran into an error and could not connect! || <==> [DATABASE]\n\n${dberror}`));
        }
    });
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/