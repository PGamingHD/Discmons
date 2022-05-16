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
    const Schema = require('../../schemas/Pokemons');

    module.exports = {
        name: 'info',
        description: 'Get info on pokemon!',
        options: [{
            name: 'name',
            description: 'The pokemon name you wish to index for!',
            type: ApplicationCommandOptionType.String,
            required: true
        }],
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, con, args) => {
            const name = interaction.options.getString('name');

            const infopoke = await Schema.findOne({
                PokemonName: name
            });

            if (infopoke) {
                return interaction.reply({
                    content: infopoke.PokemonPicture
                })
            } else {
                console.log("NOT FOUND!")
            }
        }
    }