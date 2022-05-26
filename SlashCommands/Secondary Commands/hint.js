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
    const { hintgame } = require("../../handler/functions");
    const spawned = require("../../schemas/Spawned");
    const user = require("../../schemas/userData");

    module.exports = {
        name: 'hint',
        description: 'Not so bright? No worries, we all have our moments. Purchase a hint with 1,000 Credits!',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {

            const findspawned = await spawned.findOne({
                SpawnedServerID: parseInt(interaction.guild.id),
                SpawnedChannelID: interaction.channel.id
            }).limit(1);

            const userdata = await user.findOne({
                OwnerID: parseInt(interaction.user.id),
            }).limit(1);

            if(!findspawned){
                return interaction.reply({
                    content: ':x: No pokemons have spawned in this channel, you may not purchase a hint.',
                    ephemeral: true
                })
            }

            if(userdata.Pokecoins < 1000){
                return interaction.reply({
                    content: ':x: Not enough Pokécoins, this product costs 1,000 Pokécoins which you do not currently have.',
                    ephemeral: true
                })
            }

            const totalLeft = userdata.Pokecoins;
            const todel = totalLeft - 1000;

            await userdata.updateOne({
                Pokecoins: todel,
            })

            const pokemonname = findspawned.PokemonName;
            const remadename = hintgame(pokemonname);

            return interaction.reply({
                content: `:white_check_mark: Successfully purchased a Pokémon hint, Pokémons name is: ${remadename}`,
                ephemeral: true
            })
        }
    }