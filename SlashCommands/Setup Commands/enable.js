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
        name: 'enable',
        description: 'Enable a module from the bot, make sure you have set the module up before enabling it!',
        options: [{
            name: 'automaticannouncements',
            description: 'Send automated embed message',
            type: ApplicationCommandOptionType.Subcommand
        }],
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, con, args) => {
            con.query(`SELECT * FROM server_info WHERE serverid = '${interaction.guild.id}';`, function (error, results, fields) {
                const oldstatus = results[0].auto_announcestatus;

                if (oldstatus) {
                    con.query(`UPDATE server_info SET auto_announcestatus = 0 WHERE serverid = '${interaction.guild.id}';`)

                    return interaction.reply({
                        content: ':white_check_mark: Successfully enabled module `Auto Announcements` as requested.',
                        ephemeral: true
                    })
                } else {
                    con.query(`UPDATE server_info SET auto_announcestatus = 1 WHERE serverid = '${interaction.guild.id}';`)

                    return interaction.reply({
                        content: ':white_check_mark: Successfully disabled module `Auto Announcements` as requested.',
                        ephemeral: true
                    })
                }
            });
        }
    }