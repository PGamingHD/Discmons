const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Discord,
    ModalBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    WebhookClient,
    PermissionFlagsBits
} = require("discord.js");
const client = require("../index");
const ee = require("../botconfig/embed.json");
const emoji = require("../botconfig/emojis.json");
const config = require("../botconfig/config.json");
const {
    startupCooldown
} = require("../index");

//SCHEMA DATA
const userData = require("../schemas/userData");
const pokemon = require("../schemas/Pokemons");
const developer = require("../schemas/developerData");
const server = require("../schemas/Servers");
const {
    maintenancemode,
    forcespawn
} = require("../handler/functions");

client.on("interactionCreate", async (interaction) => {

    /*if (startupCooldown.has("startupcooldown") && !config.developerID.includes(interaction.user.id)) {
        return interaction.reply({
            content: ':x: The bot is still starting up, please be patient and wait for the cooldown to end!',
            ephemeral: true
        })
    }*/

    const dev = await developer.findOne({
        developerAccess: "accessStringforDeveloperOnly",
    })

    if (dev.globalMaintenance && !config.developerID.includes(interaction.user.id)) {
        return interaction.reply({
            content: ':x: Maintenance Mode is enabled, please wait until the maintenance is over!',
            ephemeral: true
        })
    }

    const findserver = await server.findOne({
        ServerID: parseInt(interaction.guild.id),
    })

    if (!findserver) {
        await server.create({
            ServerID: parseInt(interaction.guild.id),
            Blacklisted: false,
            SpawningTime: 0,
            RedirectChannel: 0,
            ServerLang: 'en'
        })
    } else {
        if (findserver.Blacklisted) {
            return interaction.reply({
                content: ':x: This server has been blacklisted from the usage of this bots functions, please open a ticket on the Support Server to get this fixed.',
                ephemeral: true
            })
        }
    }

    const finduser = await userData.findOne({
        OwnerID: parseInt(interaction.user.id),
    })

    if (finduser) {

        if (finduser.Blacklisted) {
            return interaction.reply({
                content: ':x: You have been blacklisted from the usage of this bots functions, please open a ticket on the Support Server to get this fixed.',
                ephemeral: true
            })
        }

        if (dev.LastTOSUpdate > finduser.LatestAgreed && interaction.isButton()) {
            if (interaction.customId === "agree") {
                await interaction.deferUpdate();

                const agreementRow = new ActionRowBuilder()
                agreementRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji('✅')
                    .setCustomId('agree')
                    .setStyle(ButtonStyle.Primary)
                ])
                agreementRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji('❎')
                    .setCustomId('disagree')
                    .setStyle(ButtonStyle.Primary)
                ])

                for (let i = 0; i < agreementRow.components.length; i++) {
                    agreementRow.components[i].setDisabled(true);
                }

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(851712)
                        .setTitle(`Successfully agreed to ToS`)
                        .setDescription(`Thank you for agreeing to our newly update Terms of Service, you may now continue using the bot features.`)
                    ],
                    components: [agreementRow]
                })

                await finduser.updateOne({
                    LatestAgreed: Date.now()
                });
                return;
            } else if (interaction.customId === "disagree") {
                await interaction.deferUpdate();

                const agreementRow = new ActionRowBuilder()
                agreementRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji('✅')
                    .setCustomId('agree')
                    .setStyle(ButtonStyle.Primary)
                ])
                agreementRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji('❎')
                    .setCustomId('disagree')
                    .setStyle(ButtonStyle.Primary)
                ])

                for (let i = 0; i < agreementRow.components.length; i++) {
                    agreementRow.components[i].setDisabled(true);
                }

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.wrongcolor)
                        .setTitle(`Successfully disagreed to our ToS`)
                        .setDescription(`You have now declined agreement to our ToS, please note that no further bot access can be given unless you agree to the new Terms of Service.`)
                    ],
                    components: [agreementRow]
                });
                return;
            } else {
                return;
            }
        }

        if (dev.LastTOSUpdate > finduser.LatestAgreed && !interaction.isButton()) {
            const agreementRow = new ActionRowBuilder()
            agreementRow.addComponents([
                new ButtonBuilder()
                .setEmoji('✅')
                .setCustomId('agree')
                .setStyle(ButtonStyle.Primary)
            ])
            agreementRow.addComponents([
                new ButtonBuilder()
                .setEmoji('❎')
                .setCustomId('disagree')
                .setStyle(ButtonStyle.Primary)
            ])

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`Updated Terms of Service agreement!`)
                    .setDescription(`**Whoops, wait one second there ${interaction.user}!**\n\nLooks like you have yet to read our new upgraded [Terms of Service](https://discord.gg/discmon) and agree to it.\nPlease read through our new ToS then agree with the buttons below, or decline.\n\n> We update our ToS agreements regulary, which is why you are seeing this again.`)
                ],
                components: [agreementRow]
            });
        }
    }

    // Slash Command Handling
    if (interaction.isChatInputCommand()) {

        try {
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SendMessages) || !interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.EmbedLinks) || !interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.UseExternalEmojis) || !interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ReadMessageHistory)) {
                await interaction.user.send({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.wrongcolor)
                        .setTitle(`:x: Missing Permissions :x:`)
                        .setDescription(`Looks like I do not have **permission** to send messages in that channel, please **fix it** before trying to use commands there again. Try contacting the **server owner**!\n\nPermissions I require in channels: \`Send Messages\`, \`Embed Links\`, \`Use External Emoji\`, \`Read Message History\`!`)
                    ],
                    ephemeral: true,
                })
            }
        } catch (error) {
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SendMessages)) {
                return;
            } else {
                if (error.rawError.message === "Cannot send messages to this user") {
                    return interaction.reply({
                        embeds: [],
                        components: [],
                        content: ':x: Failed to send message, please open your DMs before using this command again.'
                    })
                } else {
                    return interaction.reply({
                        embeds: [],
                        components: [],
                        content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                    })
                }
            }
        }

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

        const founduser = await userData.findOne({
            OwnerID: parseInt(interaction.user.id),
        })

        if (!cmd.startCmd && !founduser) {
            return interaction.reply({
                content: ':x: Looks like you have yet to register to this bot, please register before using the commands. Register using the command \`/start\` and pick a starter Pokémon!',
                ephemeral: true
            })
        }

        if (client.userCooldown.has(`${interaction.user.id}`)) {
            const usercd = await client.userCooldown.get(`${interaction.user.id}`);
            let prettified = prettyMilliseconds(usercd - Date.now(), {
                verbose: true
            });

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.errorColor)
                    .setDescription(stringTemplateParser(await languageControl(interaction.guild, 'ON_COOLDOWN'), {
                        timeLeft: prettified
                    }))
                ],
                ephemeral: true
            })
        }

        if (cmd?.cooldown) {
            let expireDate = Date.now() + 1000 * cmd?.cooldown;
            await client.userCooldown.set(`${interaction.user.id}`, expireDate);

            setTimeout(async () => {
                await client.userCooldown.delete(`${interaction.user.id}`);
            }, 1000 * cmd?.cooldown);
        }

        if (cmd.DeveloperCommand && !interaction.user.id.includes(config.developerID)) {
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

        if (cmd.serverAdmin && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: ':x: Looks like you do not have permissions to execute this command.',
                ephemeral: true
            })
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

        if (!interaction.member.permissions.has(cmd.userPermissions || [])) return interaction.reply({
                content: "You do not have permissions to use this command!",
        });

        try {
            await cmd.run(client, interaction, con, args);
        } catch (error) {
            console.log(error);
        }
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
        const {
            member,
            channel,
            message,
            user,
            guild
        } = interaction;

        //TRY TO USE COLLECTORS INSTEAD OF THIS! (WILL SURVIVE FOREVER)
    }
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/