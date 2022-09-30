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
        name: 'suggest',
        description: 'Suggest something to the bot developers!',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            const modal = new ModalBuilder()
            .setCustomId('suggestionModal')
            .setTitle('Discmon - Suggest features')

            const suggestionInput = new TextInputBuilder()
            .setCustomId('suggestion')
            .setLabel(`Please explain the feature in details`)
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(50)
            .setMaxLength(2000)
            .setPlaceholder(`Explain your feature in detail, what does it do? How would it work?`)
            .setRequired(true)

            const firstActionRow = new ActionRowBuilder().addComponents([suggestionInput]);
            modal.addComponents([firstActionRow]);

            await interaction.showModal(modal);
        }
    }