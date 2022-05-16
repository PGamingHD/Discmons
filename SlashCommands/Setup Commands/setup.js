    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        ApplicationCommandOptionType
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json')

    module.exports = {
        name: 'setup',
        description: 'The bot setup command, please make sure to use all these before using the features!',
        options: [{
            name: 'announcemodule',
            description: 'The message value you want to automate into a channel!',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [{
                name: 'message',
                description: 'Change your auto-announce message!',
                type: ApplicationCommandOptionType.Subcommand,
                options: [{
                    name: 'msg',
                    description: 'Message to send',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }]
            }, {
                name: 'channel',
                description: 'Change the auto-announce channel!',
                type: ApplicationCommandOptionType.Subcommand,
                options: [{
                    name: 'channel',
                    description: 'Channel for announcements',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                }]
            }, {
                name: 'timer',
                description: 'Change the auto-announce timer!',
                type: ApplicationCommandOptionType.Subcommand,
                options: [{
                    name: 'time',
                    description: 'Timer for announcements',
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }]
            }]
        }],
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {

            if (interaction.options.getSubcommandGroup() === "announcemodule") {
                if (interaction.options.getSubcommand() === "message") {
                    const message = interaction.options.getString('msg');

                    if (message.length > 200) {
                        return interaction.reply({
                            content: ':x: The message may not be over 200 characters long.',
                            ephemeral: true
                        })
                    }

                    client.connection.query(`UPDATE server_info SET auto_announcemsg = '${message}' WHERE serverid = '${interaction.guild.id}';`)
                    return interaction.reply({
                        content: `:white_check_mark: Successfully set auto-announce message to "\`${message}\`"!`,
                        ephemeral: true
                    })
                }

                if (interaction.options.getSubcommand() === "channel") {
                    const channel = interaction.options.getChannel('channel');

                    client.connection.query(`UPDATE server_info SET auto_announcechannel = '${channel.id}' WHERE serverid = '${interaction.guild.id}';`)
                    return interaction.reply({
                        content: `:white_check_mark: Successfully set auto-announce message to <#${channel.id}>!`,
                        ephemeral: true
                    })
                }

                if (interaction.options.getSubcommand() === "timer") {
                    const timer = interaction.options.getInteger('time');

                    client.connection.query(`UPDATE server_info SET auto_announcetimer = '${timer}' WHERE serverid = '${interaction.guild.id}';`)
                    return interaction.reply({
                        content: `:white_check_mark: Successfully set auto-announce timer to \`${timer}\` minutes!`,
                        ephemeral: true
                    })
                }
            }
        }
    }