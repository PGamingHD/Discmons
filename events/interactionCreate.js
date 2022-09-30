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
    getDeveloperData,
    findServer,
    findUser,
    tosInteraction,
    tosFunction,
    sendWebhook
} = require("../handler/functions");

client.on("interactionCreate", async (interaction) => {

    if (startupCooldown.has("startupcooldown") && !config.developerID.includes(interaction.user.id)) {
        return interaction.reply({
            content: ':x: The bot is still starting up, please be patient and wait for the cooldown to end!',
            ephemeral: true
        })
    }

    const dev = await getDeveloperData();

    if (dev.globalMaintenance && !config.developerID.includes(interaction.user.id)) {
        return interaction.reply({
            content: ':x: Maintenance Mode is enabled, please wait until the maintenance is over!',
            ephemeral: true
        })
    }

    const findserver = await findServer(interaction.guild.id);

    if (!findserver) {
        await server.create({
            ServerID: parseInt(interaction.guild.id),
            Blacklisted: false,
            SpawningTime: 0,
            RedirectChannel: 0,
            ServerLang: 'en'
        });
    } else {
        if (findserver.Blacklisted) {
            return interaction.reply({
                content: ':x: This server has been blacklisted from the usage of this bots functions, please open a ticket on the Support Server to get this fixed.',
                ephemeral: true
            });
        }
    }

    const finduser = await findUser(interaction.user.id);

    if (finduser) {

        if (finduser.Blacklisted) {
            return interaction.reply({
                content: ':x: You have been blacklisted from the usage of this bots functions, please open a ticket on the Support Server to get this fixed.',
                ephemeral: true
            })
        }

        if (dev.LastTOSUpdate > finduser.LatestAgreed && interaction.isButton()) {
            await tosInteraction(interaction, finduser);
            return;
        }

        if (dev.LastTOSUpdate > finduser.LatestAgreed && !interaction.isButton()) {
            await tosFunction(interaction);
            return;
        }
    }

    // Slash Command Handling
    if (interaction.isChatInputCommand()) {

        /*try {
            if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SendMessages) || !interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.EmbedLinks) || !interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.UseExternalEmojis)) {
                await interaction.user.send({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.wrongcolor)
                        .setTitle(`:x: Missing Permissions :x:`)
                        .setDescription(`Looks like I do not have **permission** to send messages in that channel, please **fix it** before trying to use commands there again. Try contacting the **server owner**!\n\nPermissions I require in channels: \`Send Messages\`, \`Embed Links\`, \`Use External Emoji\`!`)
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
        }*/

        if (interaction.guild.id === "1010999169676222514" && interaction.channel.id !== "1010999277927006340" && !interaction.user.id.includes(config.developerID)) {
            return interaction.reply({
                content: ':x: You may only use my functions inside of the <#1010999277927006340> channel!',
                ephemeral: true
            });
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
            OwnerID: interaction.user.id,
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

    if (interaction.isModalSubmit()) {
        if (interaction.customId === "bugReportModal") {
            const reportedBug = interaction.fields.getTextInputValue('reportedBug');

            await interaction.reply({
                content: '**Bug report recieved, thank you for your help in making our services the best possible!** ❤️',
                ephemeral: true
            });

            await sendWebhook("https://discord.com/api/webhooks/1025464359343886468/x5y4lcJqO_a1KpwfwhMdhkHC6APgOPlyTla7WfTm5AnYPrPh7jtVKmLjnstXUBug-nqQ", "✉️ Bug Report Recieved ✉️", `**Reporter:** *${interaction.user.tag} [${interaction.user.id}]*\n\n**Explanation:**\n\`\`\`${reportedBug}\`\`\``, ee.successcolor);
        }

        if (interaction.customId === "suggestionModal") {
            const suggestedFeature = interaction.fields.getTextInputValue('suggestion');

            await interaction.reply({
                content: '**Suggestion recieved, thank you for your help in making our services the best possible!** ❤️',
                ephemeral: true
            });

            await sendWebhook("https://discord.com/api/webhooks/1025466745827364907/VKptuiOpZIRqEsDzPqOlI7-By_wLwKf7GcUbHEsMJmgLRCvH3zPO6HTAh0jpUEnx3HXK", "✉️ Suggestion Recieved ✉️", `**Suggester:** *${interaction.user.tag} [${interaction.user.id}]*\n\n**Explanation:**\n\`\`\`${suggestedFeature}\`\`\``, ee.successcolor);
        }
    }
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/