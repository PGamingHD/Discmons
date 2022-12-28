    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        ApplicationCommandOptionType,
        PermissionFlagsBits
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json')
    const server = require('../../schemas/Servers');

    module.exports = {
        name: 'redirect',
        description: 'Do something!',
        serverAdmin: true,
        options: [{
            name: 'spawns',
            description: 'Redirect Pokémons to a new channel!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'channel',
                description: 'The channel you wish to redirect Pokémon spawns to!',
                type: ApplicationCommandOptionType.Channel,
                required: true
            }]
        }, {
            name: 'disable',
            description: 'Disable the Pokémon redirecting on this server!',
            type: ApplicationCommandOptionType.Subcommand
        }],
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            if (interaction.options.getSubcommand() === "spawns") {
                const ch = interaction.options.getChannel('channel');

                const foundserver = await server.findOne({
                    ServerID: interaction.guild.id
                });

                if (ch.type !== 0) {
                    return interaction.reply({
                        content: ':x: The channel type must be a Text channel, please fix this and try using the command again.',
                        ephemeral: true
                    })
                }

                if (!ch.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SendMessages) || !ch.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ViewChannel) || !ch.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.EmbedLinks)) {
                    return interaction.reply({
                        content: ':x: I do not have proper access to manage that channel and therefore that channel may not be redirected to unless proper access is given. I require the permissions \`Send Messages\`, \`View Channel\` & \`Embed Links\` in order to properly redirect to that channel!',
                        ephemeral: true
                    })
                }

                await foundserver.updateOne({
                    RedirectChannel: ch.id
                })

                return interaction.reply({
                    content: `:white_check_mark: Successfully set channel ${ch} to your new Redirect channel on this server!`,
                    ephemeral: true
                })
            }

            if (interaction.options.getSubcommand() === "disable") {
                const foundserver = await server.findOne({
                    ServerID: interaction.guild.id
                });

                if (parseInt(foundserver.RedirectChannel) === 0) {
                    return interaction.reply({
                        content: `:x: Looks like this server does not have a redirected channel, please redirect to a channel before disabling it again!`,
                        ephemeral: true
                    })
                }

                await foundserver.updateOne({
                    RedirectChannel: 0
                })

                return interaction.reply({
                    content: `:white_check_mark: Successfully disabled a redirect channel on this server, they will now spawn wherever the last message is sent!`,
                    ephemeral: true
                })
            }
        }
    }