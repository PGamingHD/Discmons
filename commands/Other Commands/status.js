const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const {
    api
} = require("../../index");
let cpuStat = require("cpu-stat");
let os = require("os");
const prettyMilliseconds = require("pretty-ms");
const config = require("../../botconfig/config.json")

module.exports = {
    name: "status", //userMoney, userBank, userBitcoin, userID (ALL USERVALUES)
    aliases: ['stats', 'botstats'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, con, prefix) => {
        try {
            cpuStat.usagePercent(function (e, percent, seconds) {
                try {
                    if (e) return console.log(String(e.stack));
                    con.query(`SELECT * FROM totalcommands`, function (error, results, fields) {
                        if (error) throw error;
                        if (results && results.length) {
                            const buttonrow = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                    .setURL(
                                        "https://discord.com/api/oauth2/authorize?client_id=904757023797813339&permissions=517543939136&scope=bot%20applications.commands"
                                    )
                                    .setStyle("LINK")
                                    .setLabel("Invite")
                                )
                                .addComponents(
                                    new MessageButton()
                                    .setURL("https://discord.gg/pxySje4GPC")
                                    .setStyle("LINK")
                                    .setLabel("Support")
                                )

                            const joinedat =
                                message.guild.members.cache.get(config.botID).joinedAt / 1000;
                            //const joinedat = client.user.joinedAt / 1000;
                            const newjoined = Math.floor(joinedat); // NEW
                            let platform;

                            if (os.platform == "win32") {
                                platform = "Windows";
                            }
                            if (os.platform == "linux") {
                                platform = "Linux (Ubuntu)";
                            }

                            const botinfo = new MessageEmbed()
                                .setAuthor("PizzaParadise Information", client.user.displayAvatarURL())
                                .setColor(ee.color)
                                .setDescription(
                                    `I am the one and only PizzaParadise, check my commands out with \`${prefix}help\`!`
                                )
                                .addField(`Birthday`, `<t:1536252510>`, true)
                                .addField(`Joined On`, `<t:${newjoined}>`, true)
                                .addField(
                                    `Bot Developer`,
                                    ` [***PGamingHD***](https://discordapp.com/users/266726434855321600/)`
                                )
                                .addField("Platform", `\`\`[ ${platform} ]\`\``, true)
                                .addField(
                                    `Message Command(s)`,
                                    `\`[ ${client.commands.size - (9).toLocaleString('en-US')} ]\``,
                                    true
                                ) // 14 is number of developer commands that is NOT FOR SHOWING!
                                .addField(
                                    `Slash Command(s)`,
                                    `\`[ ${
                                  client.slashCommands.map((d) => d.options).flat().length.toLocaleString('en-US')
                                } ]\``,
                                    true
                                )
                                .addField(
                                    `Cached Server(s)`,
                                    `\`[ ${client.guilds.cache.size.toLocaleString('en-US')} ]\``,
                                    true
                                )
                                .addField(
                                    `Cached Channel(s)`,
                                    `\`[ ${client.channels.cache.size.toLocaleString('en-US')} ]\``,
                                    true
                                )
                                .addField(
                                    `Cached User(s)`,
                                    `\`[ ${client.users.cache.size.toLocaleString('en-US')} ]\``,
                                    true
                                )
                                .addField(
                                    `Total User(s)`,
                                    `\`[ ${client.guilds.cache.reduce(
                                  (a, g) => a + g.memberCount,
                                  0
                                ).toLocaleString('en-US')} ]\``,
                                    true
                                )
                                .addField(
                                    `Uptime`,
                                    `\`[ ${prettyMilliseconds(client.uptime)} ]\``,
                                    true
                                )
                                .addField(
                                    `Memory usage`,
                                    `\`[ ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
                                  2
                                ).toLocaleString('en-US')}mb ]\``,
                                    true
                                )
                                .addField(`CPU usage`, `\`[ ${percent.toFixed(2)}% ]\``, true)
                                .addField(`Total Commands ran`, `\`[ ${results[0].totalCommands.toLocaleString('en-US')} ]\``, true)
                                .addField(`Bot Version`, `\`[ ${config.botVersion} ]\``, true)

                            return message.reply({
                                embeds: [botinfo],
                                components: [buttonrow],
                            });
                        }
                    });

                    /*
                              .addField("Memory usage", `\`[ ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB ]\``, true)
                              .addField("Uptime ", `\`${prettyMilliseconds(client.uptime)}\``, true)
                              .addField("Total Users", `\`Total: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} users\``, true)
                              .addField("Cached Servers", `\`Total: ${client.guilds.cache.size} servers\``, true)
                              .addField("Cached VCs", `\`Total: ${client.channels.cache.filter((ch) => ch.type === "voice").size}\``, true)
                              .addField("Connected Players", `\`Total: ${connectedchannelsamount}\``, true)
                              .addField("CPU", `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``)
                              .addField("Bot Version", `\`v2.2.0_DEV\``, true)
                              .addField("CPU usage", `\`${percent.toFixed(2)}%\``, true)
                              .addField("Arch", `\`${os.arch()}\``, true)
                              .addField("Platform", `\`\`${os.platform()}\`\``, true)
                              .addField("API Latency", `\`${client.ws.ping}ms\``, true)
                              .addField(`${emoji.javascript} Developer`, ` [***PGamingHD***](https://discordapp.com/users/266726434855321600/)`, true)
                              */
                } catch (e) {
                    console.log(e);
                    con.query(`SELECT * FROM totalcommands`, function (error, results, fields) {
                        if (error) throw error;
                        if (results && results.length) {
                            const buttonrow = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                    .setURL(
                                        "https://discord.com/api/oauth2/authorize?client_id=904757023797813339&permissions=6441795454&scope=bot%20applications.commands"
                                    )
                                    .setStyle("LINK")
                                    .setLabel("Invite")
                                )
                                .addComponents(
                                    new MessageButton()
                                    .setURL("https://www.discord.gg/pxySje4GPC")
                                    .setStyle("LINK")
                                    .setLabel("Support")
                                )

                            const joinedat =
                                message.guild.members.cache.get(config.botID).joinedAt / 1000;
                            //const joinedat = client.user.joinedAt / 1000;
                            const newjoined = Math.floor(joinedat); // NEW
                            let platform;

                            if (os.platform == "win32") {
                                platform = "Windows";
                            }
                            if (os.platform == "linux") {
                                platform = "Linux";
                            }

                            const botinfo = new MessageEmbed()
                                .setAuthor("PizzaParadise Information", client.user.displayAvatarURL())
                                .setColor(ee.color)
                                .setDescription(
                                    `I am the one and only PizzaParadise, check my commands out with \`${prefix}help\`!`
                                )
                                .addField(`Birthday`, `<t:1536252510>`, true)
                                .addField(`Joined On`, `<t:${newjoined}>`, true)
                                .addField(
                                    `Bot Developer`,
                                    ` [***PGamingHD***](https://discordapp.com/users/266726434855321600/)`
                                )
                                .addField("Platform", `\`\`[ ${platform} ]\`\``, true)
                                .addField(
                                    `Message Command(s)`,
                                    `\`[ ${client.commands.size - (9).toLocaleString('en-US')} ]\``,
                                    true
                                )
                                .addField(
                                    `Slash Command(s)`,
                                    `\`[ ${
                                  client.slashCommands.map((d) => d.options).flat().length.toLocaleString('en-US')
                                } ]\``,
                                    true
                                )
                                .addField(
                                    `Cached Server(s)`,
                                    `\`[ ${client.guilds.cache.size.toLocaleString('en-US')} ]\``,
                                    true
                                )
                                .addField(
                                    `Cached Channel(s)`,
                                    `\`[ ${client.channels.cache.size.toLocaleString('en-US')} ]\``,
                                    true
                                )
                                .addField(
                                    `Cached User(s)`,
                                    `\`[ ${client.users.cache.size.toLocaleString('en-US')} ]\``,
                                    true
                                )
                                .addField(
                                    `Total User(s)`,
                                    `\`[ ${client.guilds.cache.reduce(
                                  (a, g) => a + g.memberCount,
                                  0
                                ).toLocaleString('en-US')} ]\``,
                                    true
                                )
                                .addField(
                                    `Uptime`,
                                    `\`[ ${prettyMilliseconds(client.uptime)} ]\``,
                                    true
                                )
                                .addField(
                                    `Memory usage`,
                                    `\`[ ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
                                  2
                                ).toLocaleString('en-US')}mb ]\``,
                                    true
                                )
                                .addField(`CPU usage`, `\`[ ${percent.toFixed(2)}% ]\``, true)
                                .addField(`Total Commands ran`, `\`[ ${results[0].totalCommands.toLocaleString('en-US')} ]\``, true)
                                .addField(`Bot Version`, `\`[ ${config.botVersion} ]\``, true);

                            message.reply({
                                embeds: [botinfo],
                                components: [buttonrow],
                            });
                        }
                    });

                    /*
                              .setAuthor('Vixirus', client.user.displayAvatarURL())
                              .setTitle("__**Bot Status:**__")
                              .setColor(ee.color)
                              .addField("💾 Memory Usage", `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\``, true)
                              .addField("⌚️ Uptime ", `\`${prettyMilliseconds(client.uptime)}\``, true)
                              .addField("📁 Total Users", `\`Total: ${client.users.cache.size} users\``, true)
                              .addField("📡 Total Servers", `\`Total: ${client.guilds.cache.size} servers\``, true)
                              .addField("📁 Total VCs", `\`Total: ${client.channels.cache.filter((ch) => ch.type === "voice").size}\``, true)
                              .addField("📡 Connected Players", `\`Total: ${connectedchannelsamount}\``, true)
                              .addField("⚙️ CPU", `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``)
                              .addField("👾 Bot Version", `\`v2.1.0_DEV\``, true)
                              .addField("🤖 CPU usage", `\`${percent.toFixed(2)}%\``, true)
                              .addField("🤖 Arch", `\`${os.arch()}\``, true)
                              .addField("💻 Platform", `\`\`${os.platform()}\`\``, true)
                              .addField("♻️ API Latency", `\`${client.ws.ping}ms\``, true)
                              .setImage("https://cdn.discordapp.com/attachments/787393677000572960/892025619297239110/standard.gif")
                              */
                }
            });

            function duration(duration, useMilli = false) {
                let remain = duration;
                let days = Math.floor(remain / (1000 * 60 * 60 * 24));
                remain = remain % (1000 * 60 * 60 * 24);
                let hours = Math.floor(remain / (1000 * 60 * 60));
                remain = remain % (1000 * 60 * 60);
                let minutes = Math.floor(remain / (1000 * 60));
                remain = remain % (1000 * 60);
                let seconds = Math.floor(remain / 1000);
                remain = remain % 1000;
                let milliseconds = remain;
                let time = {
                    days,
                    hours,
                    minutes,
                    seconds,
                    milliseconds,
                };
                let parts = [];
                if (time.days) {
                    let ret = time.days + " Day";
                    if (time.days !== 1) {
                        ret += "s";
                    }
                    parts.push(ret);
                }
                if (time.hours) {
                    let ret = time.hours + " Hr";
                    if (time.hours !== 1) {
                        ret += "s";
                    }
                    parts.push(ret);
                }
                if (time.minutes) {
                    let ret = time.minutes + " Min";
                    if (time.minutes !== 1) {
                        ret += "s";
                    }
                    parts.push(ret);
                }
                if (time.seconds) {
                    let ret = time.seconds + " Sec";
                    if (time.seconds !== 1) {
                        ret += "s";
                    }
                    parts.push(ret);
                }
                if (useMilli && time.milliseconds) {
                    let ret = time.milliseconds + " ms";
                    parts.push(ret);
                }
                if (parts.length === 0) {
                    return ["instantly"];
                } else {
                    return parts;
                }
            }
            return;
        } catch (e) {
            console.log(String(e.stack));
        }
    },
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/