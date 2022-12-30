//           --------------------<CONSTRUCTORS>--------------------

const {
    Client,
    Collection,
    Intents,
    GatewayIntentBits,
    Partials,
    IntentsBitField
} = require("discord.js");
const ee = require("./botconfig/embed.json");
const {
    readdirSync
} = require("fs");
const config = require("./botconfig/config.json");
const chalk = require("chalk");
const userData = require('./schemas/userData');
const {
    sendWebhook,
    findUser,
} = require("./handler/functions");
const {
    Webhook
} = require("@top-gg/sdk");
const {
    AutoPoster
} = require('topgg-autoposter')
const express = require('express');
const server = express();
require('dotenv').config();

//           --------------------<CONSTRUCTORS>--------------------


//           --------------------<CONSTRUCTING CLIENTS>--------------------

const client = new Client({
    allowedMentions: {
        parse: ["users", "everyone", "roles"], // "everyone", "roles", "users"
        repliedUser: false,
    },
    waitGuildTimeout: 10000,
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
        Partials.ActivityType,
    ],
});

const autoposter = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMTEwMDIzODQwNjQ5NzA5NDQiLCJib3QiOnRydWUsImlhdCI6MTY3MjE0NzgxOX0.CXYPN5AUk4LZ5vD6tjb4Vt_pcOourjqvU-xvAytJawA', client)
const webhook = new Webhook("epicGamers123!#fromtopggPost");

//           --------------------<CONSTRUCTING CLIENTS>--------------------


//           --------------------<MODULE EXPORTS>--------------------

module.exports = client;

//           --------------------<MODULE EXPORTS>--------------------


//           --------------------<GLOBAL VARIABLES CONSTRUCTION>--------------------

client.commands = new Collection();
client.slashCommands = new Collection();
client.awardCooldowns = new Collection();
client.xpCooldowns = new Collection();
client.startupCooldown = new Collection();
client.userCooldown = new Collection();
client.changelog = new Collection();
client.categories = readdirSync("./commands/");
client.slashcategories = readdirSync("./SlashCommands/");
client.config = require("./botconfig/config.json");

//           --------------------<GLOBAL VARIABLES CONSTRUCTION>--------------------


//           --------------------<REQUIRES>--------------------

// Initialize the Purchase Backend
require("./Bot-Backend/index");
// Initialize the anticrash handler
require("./handler/anticrash")(client)
// Initializing the project
require("./handler")(client);

//           --------------------<REQUIRES>--------------------


//           --------------------<STATS POSTER>--------------------

autoposter.on('posted', () => {
    console.log(chalk.green('[AUTOPOST] <==> || Successfully posted all relevant stats to the Top.gg site! <==> || [AUTOPOST]'));
});

autoposter.on('error', (error) => {
    console.log(chalk.red('[AUTOPOST ERROR] <==> || Ran into error explained below. <==> || [AUTOPOST ERROR]\n', error))
})

server.post("/dblwebhook", webhook.listener(async (vote) => {
    const findregistered = await findUser(vote.user);

    if (findregistered) {
        await sendWebhook("https://discord.com/api/webhooks/1022982782651216012/6v-oWzGgTSPhxCIbOG3FSqfAnd62ya2Me-Vaoc6I572Jtug_wUFnHf44smGoAheKTod8", "🎉 New Registered Vote 🎉", `**A new vote was registered by <@!${vote.user}>!**\n\n*User has been successfully automatically given their voting rewards, make sure to vote below to get your own rewards!*\n\n*Click [here](https://top.gg/bot/1011002384064970944/vote) to vote for us and get free Pokétokens!*`, ee.color);

        await userData.findOneAndUpdate({
            OwnerID: vote.user
        }, {
            $inc: {
                Poketokens: 5,
            },
            VotedCooldown: Date.now()
        });
    } else {
        await sendWebhook("https://discord.com/api/webhooks/1022982782651216012/6v-oWzGgTSPhxCIbOG3FSqfAnd62ya2Me-Vaoc6I572Jtug_wUFnHf44smGoAheKTod8", "🎉 New Registered Vote 🎉", `**A new vote was registered by <@!${vote.user}>!**\n\n*Sadly user does not have an account registered, and was not given their automatic rewards. Please contact Staff to have this fixed after registering!*\n\n*Click [here](https://top.gg/bot/1011002384064970944/vote) to vote for us and get free Pokétokens!*`, ee.color);
    }
}));

server.listen(3000);

//           --------------------<STATS POSTER>--------------------



//           --------------------<STARTER>--------------------

client.login(process.env.LOGIN_TOKEN);

//           --------------------<STARTER>--------------------

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/