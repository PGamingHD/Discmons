const {
    Client,
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
    EmbedBuilder
} = require('discord.js');
const ee = require('../../botconfig/embed.json');
const emoji = require('../../botconfig/embed.json')
const prettyMilliseconds = require('pretty-ms');
const config = require('../../botconfig/config.json')
const userData = require('../../schemas/userData');
const typeEffectiveness = require("../../botconfig/typeEffectiveness.json");
const Pokemons = require("../../schemas/Pokemons");

module.exports = {
    name: 'battle',
    description: 'Enter a battle with another trainer to see who is the ultimate trainer.',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        const bulb = await Pokemons.findOne({PokemonName: 'Bulbasaur'});
        let superEffectiveness = [];
        bulb.PokemonType.forEach(Type => {
            console.log(typeEffectiveness[Type]['SuperEffective'])
        });
        console.log(superEffectiveness);
    }
}