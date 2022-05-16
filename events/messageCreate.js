const client = require("../index");
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    EmbedBuilder
} = require("discord.js")
const ee = require("../botconfig/embed.json")
const emoji = require("../botconfig/emojis.json");
const config = require("../botconfig/config.json");

client.on("messageCreate", async (message) => {

    /*
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})`);
        if (!prefixRegex.test(message.content)) return;
        const [, mPrefix] = message.content.match(prefixRegex);

        if (
            message.author.bot ||
            !message.guild ||
            !message.content.toLowerCase().startsWith(mPrefix)
        )
            return;

        const args = message.content.slice(mPrefix.length).trim().split(/ +/).filter(Boolean);
        const cmd = args.length > 0 ? args.shift().toLowerCase() : null;

        //const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

        if (!cmd || cmd.length == 0) {
            if (mPrefix.includes(client.user.id)) {
                const buttonrow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=904757023797813339&permissions=517543939136&scope=bot%20applications.commands`)
                        .setStyle(`LINK`)
                        .setLabel(`Invite Me`)
                    )
                    .addComponents(
                        new MessageButton()
                        .setURL(`https://www.discord.gg/pxySje4GPC`)
                        .setStyle(`LINK`)
                        .setLabel(`Support Server`)
                    )
                message.reply({
                    embeds: [new MessageEmbed().setColor(ee.color).setAuthor('Looks like I was pinged? let me help you a bit!', ee.footericon).setDescription(`>>> My current guild prefix is: \`${prefix}\`\n\nTo view all commands please use: \`${prefix}help\`\n\nStart your own pizza adventure by using the command: \`${prefix}register\``).setFooter(`I also support ping prefix, so you may use that instead of a prefix.`)],
                    components: [buttonrow]
                })
            }
            return;
        }

        const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

        if (!command) return;

        const buttonrow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setURL("https://www.discord.gg/pxySje4GPC")
                .setStyle("LINK")
                .setLabel("Support Server")
            )

        if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES") || !message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS") || !message.channel.permissionsFor(message.guild.me).has("USE_EXTERNAL_EMOJIS") || !message.channel.permissionsFor(message.guild.me).has("READ_MESSAGE_HISTORY")) return message.author.send({
            embeds: [
                new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`${emoji.error} Missing Permissions ${emoji.error}`)
                .setDescription(`Looks like I do not have **permission** to send messages in that channel, please **fix it** before trying to use commands there again. Try contacting the **server owner**!\n\nPermissions I require in channels: \`Send Messages\`, \`Embed Links\`, \`Use External Emoji\`, \`Read Message History\`!`)
            ],
            components: [buttonrow]
        })

        
        return message.reply({
            embeds: [
                new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`${emoji.error} Rework in progress! ${emoji.error}`)
                .setDescription(`${emoji.error} The bot is currently being reworked, please refer to the support server for further information about this!`)
            ],
            components: [buttonrow]
        })
        
        

        if (message.guild.id === '904813369142427749') { // && !config.ownerID.includes(message.author.id)
            let allowedchannels = ["911381141901164554", "911381131969048588", "910815863249182750", "906556250085527603"]
            if (!allowedchannels.includes(message.channel.id)) {
                message.delete();
                let msg = await message.channel.send({
                    content: `${emoji.error} Please redirect **PizzaParadise commands** to one of our **play channels**!`
                })
                setTimeout(() => {
                    msg.delete();
                }, 15 * 1000);
                return;
            }
        }

        //Check if user is on cooldown with the cmd, with Tomato#6966's Function from /handlers/functions.js
        if (onCoolDown(message, command)) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription(replacemsg(`${emoji.error} Cooldown active, please wait **%{timeleft}%** more Second(s)`, {
                        prefix: prefix,
                        command: command,
                        timeLeft: onCoolDown(message, command)
                    }))
                ]
            });
        }

        const con = client.connection;
        client.connection.query(`SELECT * FROM userblacklists where userId = '${message.author.id}'`, function (error, results, fields) {
            if (error) throw error;
            if (results && results.length) {
                const buttonrow = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setURL(config.supporturl)
                    .setStyle("LINK")
                    .setLabel("Support Server")
                );
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setTitle(`${emoji.error} Blacklisted ${emoji.error}`)
                        .setFooter(ee.footertext, ee.footericon)
                        .setDescription(
                            `**Looks like you were Blacklisted from this bot!**\n\nDo you feel like this is a mistake? Please contact our Support team.\nYou may find our Support Server by clicking the button \`below\` and\nWe shall help you resolve this as soon as possible, please DM ModMail upon joining to get further assistance with this.`
                        ),
                    ],
                    components: [buttonrow],
                });
            } else {
                client.connection.query(`select * from guildblacklists where guildId = '${message.guild.id}'`, async (error, results, fields) => {
                    if (error) throw error;
                    if (results && results.length) { //&& !config.ownerID.includes.message.author.id
                        const buttonrow = new MessageActionRow().addComponents(
                            new MessageButton()
                            .setURL(config.supporturl)
                            .setStyle("LINK")
                            .setLabel("Support Server")
                        );
                        return message.reply({
                            embeds: [
                                new MessageEmbed()
                                .setColor(ee.color)
                                .setTitle(`${emoji.error} Blacklisted ${emoji.error}`)
                                .setFooter(ee.footertext, ee.footericon)
                                .setDescription(
                                    `**Looks like this guild has been blacklisted from using this bot!**\n\nDo you feel like this is a mistake? Please contact our Support team.\nYou may find our Support Server by clicking the button \`below\` and\nWe shall help you resolve this as soon as possible, please DM ModMail upon joining to get further assistance with this.`
                                )
                            ],
                            components: [buttonrow],
                        });
                    } else {
                        client.connection.query(`UPDATE totalcommands SET totalCommands = totalCommands + 1`);
                        client.statcord.postCommand(command.name, message.author.id); //STATCORD POST MESSAGE DATA!
                        await command.run(client, message, args, con, prefix);

                        client.connection.query(`SELECT * FROM business WHERE userId = '${message.author.id}';`, async function (error, results, fields) {
                            if (results && results.length) { //< less than
                                if (results[0].businessXP >= 2500 && results[0].businessLevel === 0 || results[0].businessXP >= 5000 && results[0].businessLevel === 1 || results[0].businessXP >= 15000 && results[0].businessLevel === 2 || results[0].businessXP >= 30000 && results[0].businessLevel === 3 || results[0].businessXP >= 50000 && results[0].businessLevel === 4 || results[0].businessXP >= 75000 && results[0].businessLevel === 5 || results[0].businessXP >= 100000 && results[0].businessLevel === 6 || results[0].businessXP >= 125000 && results[0].businessLevel === 7 || results[0].businessXP >= 150000 && results[0].businessLevel === 8 || results[0].businessXP >= 200000 && results[0].businessLevel === 9 || results[0].businessLevel === 10) {
                                    return;
                                } else {
                                    let randomXP = Math.floor(Math.random() * (20 - 10)) + 10;

                                    client.connection.query(`UPDATE business SET businessXP = businessXP + ${randomXP} WHERE userId = '${message.author.id}';`)
                                }
                            }
                        });
                    }
                });
            }
            //IF GOES WRONG, PLACE COMMAND.RUN FUNCTION HERE AGAIN (AND DELETE QUERY ABOVE)! -- await command.run(client, message, args, con);
        });
        */
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/