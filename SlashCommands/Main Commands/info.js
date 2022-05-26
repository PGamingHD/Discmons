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
    const config = require('../../botconfig/config.json')
    const userdata = require("../../schemas/userData");
const { EmbedBuilder } = require('@discordjs/builders');
 
    module.exports = {
        name: 'info',
        description: 'Get information about the currently selected pokemon!',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {

            let addzero;
            const findselected = await userdata.findOne({
                OwnerID: parseInt(interaction.user.id),
                "Inventory.PokemonSelected": true
            }, {
                "Inventory.$": 1
            })
            const userData = await userdata.findOne({
                OwnerID: parseInt(interaction.user.id),
            })

            if(findselected.Inventory[0].PokemonData.PokemonOrder < 10){
                addzero = "00";
            } else if (findselected.Inventory[0].PokemonData.PokemonOrder < 100) {
                addzero = "0";
            } else {
                addzero = "";
            }

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setImage(findselected.Inventory[0].PokemonPicture)
                    .setTitle(`#${addzero}${findselected.Inventory[0].PokemonData.PokemonOrder} | Level. ${findselected.Inventory[0].PokemonData.PokemonLevel} ${findselected.Inventory[0].PokemonName}`)
                ]
            })
        }
    }