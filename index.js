//           --------------------<CONSTRUCTORS>--------------------

const {
    Client,
    Collection,
    Intents,
    GatewayIntentBits,
    Partials,
    IntentsBitField
} = require("discord.js");
const {
    readdirSync
} = require("fs");
const config = require("./botconfig/config.json");
const chalk = require("chalk");
const {
    Webhook
} = require("@top-gg/sdk");
const express = require('express');

//           --------------------<CONSTRUCTORS>--------------------


//           --------------------<CONSTRUCTING CLIENTS>--------------------

const client = new Client({
    allowedMentions: {
        parse: ["users"], // "everyone", "roles", "users"
        repliedUser: false,
    },

    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildBans,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessageReactions,
    ],

    partials: [
        Partials.ActivityType,
    ],

});

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
client.categories = readdirSync("./commands/");
client.config = require("./botconfig/config.json");

//           --------------------<GLOBAL VARIABLES CONSTRUCTION>--------------------


//           --------------------<REQUIRES>--------------------

require("./handler/anticrash")(client)
// Initializing the project
require("./handler")(client);
//require("./database/db")

//           --------------------<REQUIRES>--------------------


//           --------------------<STATS POSTER>--------------------

//HERE

//           --------------------<STATS POSTER>--------------------



//           --------------------<STARTER>--------------------

client.login(client.config.token);

//           --------------------<STARTER>--------------------

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/