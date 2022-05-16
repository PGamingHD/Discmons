    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    const {
        EmbedBuilder
    } = require('@discordjs/builders');

    module.exports = {
        name: 'license',
        description: 'Check the current servers license.',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, con, args) => {
            con.query(`SELECT * FROM licenses WHERE serverid = '${interaction.guild.id}'`, function (error, results, fields) {
                if (error) throw error;
                if (results && results.length) {

                    const currentTime = Date.now();
                    const expiretime = results[0].expiretime;
                    const timecalculation = expiretime - currentTime;
                    const timeleft = prettyMilliseconds(timecalculation, {
                        verbose: true
                    })

                    const footerOptions = {
                        text: '© discord.gg/botdeveloper | Developed by PGamingHD#0666'
                    }

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setTitle(`:white_check_mark: Server License :white_check_mark:`)
                            .setDescription(`***License Duration:***\n\`${timeleft} left\``)
                            .setFooter(footerOptions)
                            .setTimestamp()
                        ]
                    });

                } else {

                    const footerOptions = {
                        text: '© discord.gg/botdeveloper | Developed by PGamingHD#0666'
                    }

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setTitle(`:x: License not found :x:`)
                            .setDescription(`***No license was found for this server, please redeem a license before using this bot and its features.`)
                            .setFooter(footerOptions)
                            .setTimestamp()
                        ]
                    })
                }
            });
        }
    }