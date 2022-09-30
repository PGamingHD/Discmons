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
    const spawned = require("../../schemas/Spawned");
    const user = require("../../schemas/userData");
    const pokemon = require("../../schemas/Pokemons");
    const globaldata = require("../../schemas/globalData");

    module.exports = {
        name: 'catch',
        description: 'Catch a pokemon that has been spawned in a channel, you have to remember its name though!',
        options: [{
            name: 'name',
            description: 'What is the name of the pokemon?',
            type: ApplicationCommandOptionType.String,
            required: true
        }],
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            const name = interaction.options.getString('name');

            let makeCapital = s => s.replace(/./, c => c.toUpperCase());
            const pokemonGuess = makeCapital(name);

            const findpoke = await spawned.findOne({
                SpawnedServerID: parseInt(interaction.guild.id),
                SpawnedChannelID: interaction.channel.id,
                PokemonName: pokemonGuess
            });

            const findtotal = await user.aggregate([{
                $match: {
                    OwnerID: parseInt(interaction.user.id),
                }
            }, {
                $unwind: "$Inventory"
            }, {
                $sort: {
                    "Inventory.PokemonData.PokemonOrder": -1
                }
            }]).limit(1);

            const incrementID = findtotal[0].Inventory.PokemonData.PokemonOrder + 1 || 1;

            if (!findpoke) {
                return interaction.reply({
                    content: ':x: That guess does not seem to be quite right, is that really the pokemons name?',
                    ephemeral: true
                });
            }

            const spawnedchannel = await interaction.channel.messages.fetch(findpoke.SpawnedMessageID);
            spawnedchannel.delete();

            const spawnedpoke = findpoke.PokemonName;

            const pokemonRarity = await pokemon.findOne({
                PokemonName: spawnedpoke,
            });

            const foundRarity = pokemonRarity.PokemonRarity;

            if (foundRarity === "Common" || foundRarity === "Uncommon" || foundRarity === "Rare") {
                await user.findOneAndUpdate({
                    OwnerID: parseInt(interaction.user.id),
                }, {
                    $inc: {
                        TotalCaught: 1
                    }
                });

                await globaldata.findOneAndUpdate({
                    accessString: "accessingGlobalDataFromString",
                }, {
                    $inc: {
                        totalCaught: 1
                    }
                });
            } else if (foundRarity === "Mythical") {
                await user.findOneAndUpdate({
                    OwnerID: parseInt(interaction.user.id),
                }, {
                    $inc: {
                        MythicalCaught: 1,
                        TotalCaught: 1
                    }
                });

                await globaldata.findOneAndUpdate({
                    accessString: "accessingGlobalDataFromString",
                }, {
                    $inc: {
                        MythicalCaught: 1
                    }
                });
            } else if (foundRarity === "Legendary") {
                await user.findOneAndUpdate({
                    OwnerID: parseInt(interaction.user.id),
                }, {
                    $inc: {
                        LegendaryCaught: 1,
                        TotalCaught: 1
                    }
                });

                await globaldata.findOneAndUpdate({
                    accessString: "accessingGlobalDataFromString",
                }, {
                    $inc: {
                        LegendaryCaught: 1
                    }
                });
            }

            const originalownerid = await user.findOne({
                OwnerID: parseInt(interaction.user.id),
            });

            const HPiv = Math.floor(Math.random() * (31 - 1) + 1);
            const ATKiv = Math.floor(Math.random() * (31 - 1) + 1);
            const DEFiv = Math.floor(Math.random() * (31 - 1) + 1);
            const SPECATKiv = Math.floor(Math.random() * (31 - 1) + 1);
            const SPECDEFiv = Math.floor(Math.random() * (31 - 1) + 1);
            const SPEEDiv = Math.floor(Math.random() * (31 - 1) + 1);

            const IVpercentage = HPiv + ATKiv + DEFiv + SPECATKiv + SPECDEFiv + SPEEDiv;
            const IVtotal = (IVpercentage / 186 * 100).toFixed(2);

            await user.findOneAndUpdate({
                OwnerID: parseInt(interaction.user.id),
            }, {
                $push: {
                    Inventory: {
                        PokemonID: findpoke.PokemonID,
                        PokemonName: findpoke.PokemonName,
                        PokemonPicture: findpoke.PokemonPicture,
                        PokemonSelected: false,
                        PokemonOnMarket: false,
                        PokemonFavorited: false,
                        PokemonData: {
                            PokemonOriginalOwner: originalownerid.TrainerNumber,
                            PokemonLevel: findpoke.PokemonLevel,
                            PokemonXP: 0,
                            PokemonOrder: incrementID,
                            PokemonIVs: {
                                HP: HPiv,
                                Attack: ATKiv,
                                Defense: DEFiv,
                                SpecialAtk: SPECATKiv,
                                SpecialDef: SPECDEFiv,
                                Speed: SPEEDiv,
                                TotalIV: IVtotal,
                            }
                        }
                    }
                }
            });

            await spawned.deleteOne({
                SpawnedServerID: parseInt(interaction.guild.id),
                SpawnedChannelID: interaction.channel.id,
                PokemonName: pokemonGuess
            });

            return interaction.reply({
                content: `:white_check_mark: ${interaction.member} Congratulations, you have successfully caught a level \`[${findpoke.PokemonLevel}]\` ${findpoke.PokemonName}!`
            });
        }
    }