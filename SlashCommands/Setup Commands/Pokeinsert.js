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
        name: 'pokeinsert',
        description: 'Insert a pokemon into our DB!',
        options: [{
            name: 'id',
            description: 'PokemonDB ID for pokemon',
            type: ApplicationCommandOptionType.Number,
            required: true,
        }, {
            name: 'name',
            description: 'Name for pokemon',
            type: ApplicationCommandOptionType.String,
            required: true
        }, {
            name: 'picture',
            description: 'Picture link from Discord',
            type: ApplicationCommandOptionType.String,
            required: true,
        }],
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            const id = interaction.options.getNumber('id');
            const name = interaction.options.getString('name');
            const picture = interaction.options.getString('picture');

            const toinsert = await Schema.create({
                PokemonID: id,
                PokemonName: name,
                PokemonPicture: picture
            })

            console.log(toinsert)
            
            return interaction.reply({
                content: 'Successfully inserted!',
                ephemeral: true
            });
        }
    }