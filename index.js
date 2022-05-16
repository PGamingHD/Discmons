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
//const mysql = require('mysql2');
const config = require("./botconfig/config.json");
const mysql = require('mysql2');

//           --------------------<CONSTRUCTORS>--------------------


//           --------------------<CONSTRUCTING CLIENT>--------------------
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
    ],

    partials: [
        Partials.ActivityType,
    ],

});
//           --------------------<CONSTRUCTING CLIENT>--------------------


//           --------------------<MODULE EXPORTS>--------------------

module.exports = client;

//           --------------------<MODULE EXPORTS>--------------------


//           --------------------<GLOBAL VARIABLES CONSTRUCTION>--------------------
client.commands = new Collection();
client.slashCommands = new Collection();
client.cooldowns = new Collection();
client.categories = readdirSync("./commands/");
client.config = require("./botconfig/config.json");
//           --------------------<GLOBAL VARIABLES CONSTRUCTION>--------------------


//           --------------------<REQUIRES>--------------------
require("./handler/anticrash")(client)
// Initializing the project
require("./handler")(client);
//require("./database/db")
//           --------------------<REQUIRES>--------------------


//           --------------------<ESTABLISHING MYSQL CONNECTION>--------------------

const con = mysql.createConnection({
    host: config.Database.DB_HOST,
    user: config.Database.DB_USER,
    password: config.Database.DB_PASS,
    database: config.Database.DB_DATABASE,
    multipleStatements: true,
    supportBigNumbers: true,
});

con.connect(err => {
    if (err) throw err;
    console.log("[DATABASE] - Successfully connected to the MySQL Database!")
    //con.query("SHOW TABLES", console.log)
});

client.connection = con;

//           --------------------<MYSQL CONNECTION ESTABLISHED>--------------------


//           --------------------<STARTER>--------------------

client.login(client.config.token);

//           --------------------<STARTER>--------------------

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/