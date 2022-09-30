    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/emojis.json');
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json')
    const userData = require("../../schemas/userData");
    const {
        EmbedBuilder
    } = require('@discordjs/builders');

    module.exports = {
        name: 'profile',
        description: 'View your own profile and view all your own valueables!',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            const user = await userData.findOne({
                OwnerID: parseInt(interaction.user.id),
            })

            let rankname = "Unknown";
            if (user.TrainerRank === 0) {
                rankname = "Trainer";
            } else if (user.TrainerRank === 1) {
                rankname = "Bronze Trainer";
            } else if (user.TrainerRank === 2) {
                rankname = "Silver Trainer";
            } else if (user.TrainerRank === 3) {
                rankname = "Gold Trainer";
            } else if (user.TrainerRank === 4) {
                rankname = "Platinum Trainer";
            } else if (user.TrainerRank === 5) {
                rankname = "Moderator";
            } else if (user.TrainerRank === 6) {
                rankname = "Administrator";
            } else if (user.TrainerRank === 7) {
                rankname = "Developer";
            }

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setAuthor({
                        iconURL: interaction.user.displayAvatarURL(),
                        name: interaction.user.tag
                    })
                    .setTitle(`**Display Trainer Profile**`)
                    .addFields([{
                        name: 'Trainer Stats',
                        value: `${emoji.pokecoin} *${parseInt(user.Pokecoins).toLocaleString('en-US')}*\n${emoji.token} *${parseInt(user.Poketokens).toLocaleString('en-US')}*\n${emoji.id} ${user.TrainerNumber}\n${emoji.rank} *${rankname}*`,
                        inline: true
                    }, {
                        name: 'Pokémon Caught',
                        value: `**Total:** ${parseInt(user.TotalCaught).toLocaleString('en-US')}\n**Mythical:** ${parseInt(user.MythicalCaught).toLocaleString('en-US')}\n**Legendary:** ${parseInt(user.LegendaryCaught).toLocaleString('en-US')}\n**Ultra Beast:** ${parseInt(user.UBCaught).toLocaleString('en-US')}\n**Shiny:** ${parseInt(user.ShinyCaught).toLocaleString('en-US')}`,
                        inline: true
                    }])
                    .setTimestamp()
                ]
            })
        }
    }