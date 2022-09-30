    const {
        Client,
        ModalBuilder,
        TextInputBuilder,
        TextInputStyle,
        ActionRowBuilder
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json')
 
    module.exports = {
        name: 'reportbug',
        description: 'Report a bug to the bot developers!',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            const modal = new ModalBuilder()
            .setCustomId('bugReportModal')
            .setTitle('Discmon - Report a bug')

            const bugReportInput = new TextInputBuilder()
            .setCustomId('reportedBug')
            .setLabel(`Please explain the bug in detail`)
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(50)
            .setMaxLength(2000)
            .setPlaceholder(`Explain your bug in detail, how did it happen? What could've caused it?`)
            .setRequired(true)

            const firstActionRow = new ActionRowBuilder().addComponents([bugReportInput]);
            modal.addComponents([firstActionRow]);

            await interaction.showModal(modal);
        }
    }