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
        name: 'insertpoke',
        description: 'Insert multiple Pokémons into the Database!',
        DeveloperCommand: true,
        options: [{
            name: 'pokemons',
            description: 'Values to insert',
            type: ApplicationCommandOptionType.String,
            required: true
        }],
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            const pokeargs = interaction.options.getString('pokemons');
            const newlines = pokeargs.split('\n');
            const splitted = pokeargs.split(' ');
            console.log(pokeargs);
            console.log(newlines);
            console.log(splitted)
        }
    }