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
const config = require("../botconfig/config.json");

client.on("interactionCreate", async (interaction) => {
    if(!interaction.user.id.includes(config.developerID)){
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
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/