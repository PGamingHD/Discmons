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
    const userdata = require("../../schemas/userData");
 
    module.exports = {
        name: 'select',
        description: 'Select another pokemon to progress!',
        options: [{
            name: 'id',
            description: 'The ID of the pokemon you wish to select and progress on!',
            type: ApplicationCommandOptionType.Integer,
            required: true
        }],
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            const id = interaction.options.getInteger('id');

            const findnewselect = await userdata.findOne({
                OwnerID: parseInt(interaction.user.id),
                "Inventory.PokemonData.PokemonOrder": id
            }, {
                "Inventory.$": 1
            })

            if(!findnewselect) {
                return interaction.reply({
                    content: ':x: That Pokémon could not be found in your inventory, do you own a Pokémon with this ID?',
                    ephemeral: true
                })
            }
            if(findnewselect.Inventory[0].PokemonSelected === true){
                return interaction.reply({
                    content: ':x: You already have that Pokémon selected, please select another one!',
                    ephemeral: true
                })
            }

            await userdata.findOneAndUpdate({
                OwnerID: parseInt(interaction.user.id),
                "Inventory.PokemonSelected": true
            }, {
                "Inventory.$.PokemonSelected": false,
            })

            await userdata.findOneAndUpdate({
                OwnerID: parseInt(interaction.user.id),
                "Inventory.PokemonData.PokemonOrder": id,
            }, {
                "Inventory.$.PokemonSelected": true,
            })

            return interaction.reply({
                content: `:white_check_mark: Successfully changed your selected Pokémon to **Lvl. ${findnewselect.Inventory[0].PokemonData.PokemonLevel} ${findnewselect.Inventory[0].PokemonName}**!`,
                ephemeral: true
            });
        }
    }