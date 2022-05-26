    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        ActionRowBuilder,
        ButtonBuilder,
        ButtonStyle,
        WebhookClient
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    const webhook = new WebhookClient({
        url: config.adminLogs
    });
    const {
        EmbedBuilder
    } = require('@discordjs/builders');
    const user = require("../../schemas/userData");

    module.exports = {
        name: 'staffmenu',
        description: 'Display the Staff Menu, may only be used by Bot Staff!',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {


            const findrank = await user.findOne({
                OwnerID: parseInt(interaction.user.id),
            })

            if(findrank.TrainerRank < 5){
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.wrongcolor)
                        .setDescription(`:x: You do not have permission to view this Menu!`)
                        .setTimestamp()
                    ],
                    ephemeral: true
                })
            }

            let permissionname;

            const adminRow = new ActionRowBuilder()
            if (findrank.TrainerRank === 5) {
                permissionname = "Moderator"
                adminRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji({
                        name: "👮‍♂️"
                    })
                    .setLabel('Moderator Menu')
                    .setCustomId('modMenu')
                    .setStyle(ButtonStyle.Primary)
                ])
            }

            if (findrank.TrainerRank === 6) {
                permissionname = "Administrator"
                adminRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji({
                        name: "👮‍♂️"
                    })
                    .setLabel('Moderator Menu')
                    .setCustomId('modMenu')
                    .setStyle(ButtonStyle.Primary)
                ])
                adminRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji({
                        name: "🔨"
                    })
                    .setLabel('Administrator Menu')
                    .setCustomId('adminMenu')
                    .setStyle(ButtonStyle.Primary)
                ])
            }

            if (findrank.TrainerRank === 7) {
                permissionname = "Developer"
                adminRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji({
                        name: "👮‍♂️"
                    })
                    .setLabel('Moderator Menu')
                    .setCustomId('modMenu')
                    .setStyle(ButtonStyle.Primary)
                ])
                adminRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji({
                        name: "🔨"
                    })
                    .setLabel('Administrator Menu')
                    .setCustomId('adminMenu')
                    .setStyle(ButtonStyle.Primary)
                ])
                adminRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji({
                        name: "⚙️"
                    })
                    .setLabel('Developer Menu')
                    .setCustomId('devMenu')
                    .setStyle(ButtonStyle.Primary)
                ])
            }

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`**Staff Menu - Welcome back ${interaction.user.username}!**`)
                    .setDescription(`*Welcome back Staff Member, this is the Staff Menu for Discmon! Please make sure to follow the following rules when using Staff Permissions!*\n\n> **[1]. Never abuse your permissions!**\n> **[2]. Do not use commands in public channels!**\n> **[3]. Everything is logged, you won't get away with anything!**\n> **[4]. Be active, inactivity will get you demoted!**\n> **[5]. Never use commands to benefit yourself!**\n\n*Following the rules above will not get you punished, not following them might get you punished.*\n\n*Now, pick a menu below and click on it to open the specific menu!*`)
                    .setTimestamp()
                    .setThumbnail(`https://cdn.discordapp.com/attachments/968543677393813508/976442215448576060/support.png`)
                    .setFooter({
                        text: `Logged in with ${permissionname} permissions!`
                    })
                ],
                ephemeral: true,
                components: [adminRow]
            })
        }
    }