    const {
        Client,
        ApplicationCommandOptionType
    } = require('discord.js');
    const userData = require("../../schemas/userData");
 
    module.exports = {
        name: 'favorite',
        description: 'Add or Remove Pokémons from your personal favorite list by ID!',
        options: [{
            name: 'id',
            description: 'The ID used to identify what Pokémon you wish to remove/add to your Favorites list!',
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

            const findpoke = await userData.findOne({
                OwnerID: interaction.user.id,
                "Inventory.PokemonData.PokemonOrder": id
            }, {
                "Inventory.$": 1
            });

            if (!findpoke) {
                return interaction.reply({
                    content: ':x: The Pokémon with the specified ID could not be found, is the id valid?',
                    ephemeral: true
                });
            }

            if (findpoke.Inventory[0].PokemonOnMarket) {
                return interaction.reply({
                    content: ':x: That Pokémon is currently listed on the market, please select another Pokémon to do this on!',
                    ephemeral: true
                });
            }

            if (findpoke.Inventory[0].PokemonFavorited) {
                await userData.findOneAndUpdate({
                    OwnerID: interaction.user.id,
                    "Inventory.PokemonData.PokemonOrder": id,
                }, {
                    "Inventory.$.PokemonFavorited": false,
                });

                return interaction.reply({
                    content: `:white_check_mark: Successfully removed your Level ${findpoke.Inventory[0].PokemonData.PokemonLevel} ${findpoke.Inventory[0].PokemonName} from your favorites!`,
                    ephemeral: true
                });
            } else {
                await userData.findOneAndUpdate({
                    OwnerID: interaction.user.id,
                    "Inventory.PokemonData.PokemonOrder": id,
                }, {
                    "Inventory.$.PokemonFavorited": true,
                });

                return interaction.reply({
                    content: `:white_check_mark: Successfully added your Level ${findpoke.Inventory[0].PokemonData.PokemonLevel} ${findpoke.Inventory[0].PokemonName} to your favorites!`,
                    ephemeral: true
                });
            }
        }
    }