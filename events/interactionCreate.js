const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Discord,
    ModalBuilder,
    EmbedBuilder
} = require("discord.js");
const client = require("../index");
const ee = require("../botconfig/embed.json");
const emoji = require("../botconfig/emojis.json");
const {
    onCoolDown,
    replacemsg
} = require("../handler/functions");
const {
    config
} = require("../index");

client.on("interactionCreate", async (interaction) => {

    client.connection.query(`SELECT * FROM licenses RIGHT JOIN server_info ON licenses.serverid=server_info.serverid WHERE licenses.serverid = '${interaction.guild.id}'`, async (error, results, fields) => {
        if (error) throw error;
        if (results && results.length) {

            const currentTime = Date.now()
            const expireDate = results[0].expiretime

            if (currentTime > expireDate) {
                const owner = await interaction.guild.fetchOwner()

                await owner.send({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setTitle(`:x: License key expired :x:`)
                        .setDescription(`***Hello there, someone just tried to invite me but it looks like your license key has expired.\nI'm very sorry that this is the case, please upgrade your key before trying again.\n\nStill having issues with this? Please contact support over at our support server found below!***`)
                    ]
                })

                interaction.reply({
                    content: ':x:',
                    ephemeral: true
                })

                await owner.send({
                    content: 'https://discord.gg/botdeveloper'
                })

                client.connection.query(`DELETE FROM licenses WHERE serverid = ${interaction.guild.id}`);

                setTimeout(() => {
                    return interaction.guild.leave();
                }, 100);
                return;
            }

            if(interaction.user.id !== config.ownerID){
                return interaction.reply({content: ':x: BETA is not yet released for this bot, please be patient!', ephemeral: true})
            }

            // Slash Command Handling
            if (interaction.isChatInputCommand()) {
                //await interaction.deferReply({ephemeral: false})

                if (!interaction.channel.permissionsFor(interaction.guild.me).has("SEND_MESSAGES") || !interaction.channel.permissionsFor(interaction.guild.me).has("EMBED_LINKS") || !interaction.channel.permissionsFor(interaction.guild.me).has("USE_EXTERNAL_EMOJIS") || !interaction.channel.permissionsFor(interaction.guild.me).has("READ_MESSAGE_HISTORY")) return interaction.author.send({
                    /*
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(`${emoji.error} Missing Permissions ${emoji.error}`)
                        .setDescription(`Looks like I do not have **permission** to send messages in that channel, please **fix it** before trying to use commands there again. Try contacting the **server owner**!\n\nPermissions I require in channels: \`Send Messages\`, \`Embed Links\`, \`Use External Emoji\`, \`Read Message History\`!`)
                    ]
                    */
                    content: ["You do not have permissions to execute this command."],
                    ephemeral: true,
                })

                const cmd = client.slashCommands.get(interaction.commandName);
                if (!cmd) {
                    let embed = new EmbedBuilder()
                        .setColor(ee.color)
                        .setDescription(`:x: An error has occured, please contact the developer if this is a mistake.`)
                    return interaction.reply({
                        embeds: [embed],
                        epehemeral: true
                    });
                }

                if (cmd.name === "setup") {} else {
                    if (results[0].logchannel === "0" || results[0].bypass_roleid === "0") {
                        return interaction.reply({
                            content: ':x: Looks like this server has not yet setup the required roles to use the bots features, Please make sure to use all \`/Setup\` commands before trying again.',
                            ephemeral: true
                        })
                    }
                }

                if (cmd.IsDevOnly && interaction.member.id !== config.ownerID) {
                    return interaction.reply({
                        content: ':x: Looks like you do not have permissions to execute this command.',
                        ephemeral: true
                    })
                }
                if (cmd.serverOwner && interaction.member.id !== interaction.guild.ownerId) {
                    return interaction.reply({
                        content: ':x: Looks like you do not have permissions to execute this command.',
                        ephemeral: true
                    })
                }
                if (cmd.requireModerator && !interaction.member.roles.cache.has(results[0].moderation_roleid)) {
                    return interaction.reply({
                        content: ':x: Looks like you do not have permissions to execute this command.',
                        ephemeral: true
                    })
                }

                if (onCoolDown(interaction, cmd)) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(replacemsg(`${emoji.error} Cooldown active, please wait **%{timeleft}%** more Second(s)`, {
                                prefix: prefix,
                                command: cmd,
                                timeLeft: onCoolDown(interaction, cmd)
                            }))
                        ]
                    });
                }

                //INTERACTION BELOW
                const args = [];
                const con = client.connection;

                for (let option of interaction.options.data) {
                    if (option.type === "SUB_COMMAND") {
                        if (option.name) args.push(option.name);
                        option.options?.forEach((x) => {
                            if (x.value) args.push(x.value);
                        });
                    } else if (option.value) args.push(option.value);
                }
                interaction.member = interaction.guild.members.cache.get(interaction.user.id);

                if (!interaction.member.permissions.has(cmd.userPermissions || []))
                    return interaction.reply({
                        content: "You do not have permissions to use this command!",
                    });

                await cmd.run(client, interaction, con, args);
                //INTERACTION ABOVE
            }

            // Context Menu Handling
            /*
            if (interaction.isContextMenuCommand()) {
                await interaction.deferReply({
                    ephemeral: false
                });
                const command = client.slashCommands.get(interaction.commandName);
                if (command) command.run(client, interaction);
            }
            */

            if (interaction.isButton()) {
                const bugChannel = "963774048884629505";
                const {
                    member,
                    channel,
                    message
                } = interaction;
            }

        } else {
            const owner = await interaction.guild.fetchOwner()
            await owner.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:x: Guild not Whitelisted :x:`)
                    .setDescription(`***I left the server due to me not being whitelisted. This may be sent as your server data has glitched out and not been inserted, please join our Support Server to get this fixed!***`)
                ]
            })
            await owner.send({
                content: 'https://discord.gg/botdeveloper'
            })
            interaction.reply({
                content: ':x:',
                ephemeral: true
            })
            setTimeout(() => {
                return interaction.guild.leave();
            }, 100);
        }
    });
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/