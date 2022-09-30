    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        Message,
        ActionRowBuilder,
        EmbedBuilder,
        ButtonBuilder,
        ButtonStyle
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    const {
        generateSnowflake,
        findUser,
        getGlobalData
    } = require("../../handler/functions");

    //SCHEMAS
    const userData = require("../../schemas/userData");
    const globaldata = require("../../schemas/globalData");

    module.exports = {
        name: 'start',
        description: 'Start your new Discmon adventure with this command!',
        startCmd: true,
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {

            const pokeRow = new ActionRowBuilder()
            pokeRow.addComponents([
                new ButtonBuilder()
                .setLabel('Bulbasaur')
                .setCustomId('grass')
                .setStyle(ButtonStyle.Primary)
            ])
            pokeRow.addComponents([
                new ButtonBuilder()
                .setLabel('Charmander')
                .setCustomId('fire')
                .setStyle(ButtonStyle.Primary)
            ])
            pokeRow.addComponents([
                new ButtonBuilder()
                .setLabel('Squirtle')
                .setCustomId('water')
                .setStyle(ButtonStyle.Primary)
            ])

            const userdata = await findUser(interaction.user.id);

            if (userdata) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.wrongcolor)
                        .setDescription(`:x: You have already registered, and may not register again.`)
                    ],
                    ephemeral: true
                })
            }

            const poke = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setImage(`https://cdn.discordapp.com/attachments/1011000689981403196/1011000721887469668/starters.png`)
                    .setTitle(`**Please pick a starter Pokémon from the 3 shown below!**`)
                    .setDescription(`Finally, it is now time for you to choose your Starter Pokémon.. But what are you going to choose? Are you going to go for the Grass-type Pokémon \`Bulbasaur\`? Or maybe you're more into fire-types? Why not try the Fire-type Pokémon \`Charmander\`. Or maybe you're the chill type, why not try the Water-type \`Squirtle\`!`)
                ],
                components: [pokeRow],
                fetchReply: true,
            })

            const newInteraction = await interaction.fetchReply();

            const filter = m => m.user.id === interaction.user.id;
            const collector = newInteraction.createMessageComponentCollector({
                filter,
                idle: 1000 * 60,
                time: 1000 * 120,
                max: 1,
            });

            collector.on('collect', async (interactionCollector) => {
                if (interactionCollector.customId === "grass") {
                    await interactionCollector.deferUpdate();
                    const pokename = "Bulbasaur";
                    const pokepic = "https://img.pokemondb.net/artwork/vector/large/bulbasaur.png";
                    const generatedUUID = generateSnowflake();

                    const highestTrainer = await getGlobalData();

                    const nextTrainerNumber = parseInt(highestTrainer.Registered) + 1;

                    const HPiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const ATKiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const DEFiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const SPECATKiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const SPECDEFiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const SPEEDiv = Math.floor(Math.random() * (31 - 1) + 1);

                    const IVpercentage = HPiv + ATKiv + DEFiv + SPECATKiv + SPECDEFiv + SPEEDiv;
                    const IVtotal = (IVpercentage / 186 * 100).toFixed(2);

                    await userData.create({
                        OwnerID: interaction.user.id,
                        Poketokens: 0,
                        Pokecoins: 50000,
                        Blacklisted: false,
                        TotalCaught: 0,
                        MythicalCaught: 0,
                        LegendaryCaught: 0,
                        UBCaught: 0,
                        ShinyCaught: 0,
                        TrainerNumber: nextTrainerNumber,
                        TrainerRank: 0,
                        VotedCooldown: 0,
                        LatestAgreed: Date.now(),
                        Inventory: [{
                            PokemonID: generatedUUID,
                            PokemonName: pokename,
                            PokemonPicture: pokepic,
                            PokemonSelected: true,
                            PokemonOnMarket: false,
                            PokemonFavorited: false,
                            PokemonData: {
                                PokemonOriginalOwner: nextTrainerNumber,
                                PokemonLevel: 5,
                                PokemonXP: 0,
                                PokemonOrder: 1,
                                //EVOLVE CODE HERE
                                PokemonIVs: {
                                    HP: HPiv,
                                    Attack: ATKiv,
                                    Defense: DEFiv,
                                    SpecialAtk: SPECATKiv,
                                    SpecialDef: SPECDEFiv,
                                    Speed: SPEEDiv,
                                    TotalIV: IVtotal,
                                }
                            },
                        }],
                    })

                    await globaldata.findOneAndUpdate({
                        accessString: "accessingGlobalDataFromString",
                    }, {
                        $inc: {
                            Registered: 1
                        }
                    })

                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setDescription(`:white_check_mark: **Successfully registered, welcome to Discmon! :)**`)
                        ],
                        components: [],
                        content: ''
                    })

                    //await poke.deleteReply();
                };

                if (interactionCollector.customId === "fire") {
                    await interactionCollector.deferUpdate();
                    const pokename = "Charmander";
                    const pokepic = "https://img.pokemondb.net/artwork/vector/large/charmander.png";
                    const generatedUUID = generateSnowflake();

                    const highestTrainer = await getGlobalData();

                    const nextTrainerNumber = parseInt(highestTrainer.Registered) + 1;

                    const HPiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const ATKiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const DEFiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const SPECATKiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const SPECDEFiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const SPEEDiv = Math.floor(Math.random() * (31 - 1) + 1);

                    const IVpercentage = HPiv + ATKiv + DEFiv + SPECATKiv + SPECDEFiv + SPEEDiv;
                    const IVtotal = (IVpercentage / 186 * 100).toFixed(2);

                    await userData.create({
                        OwnerID: interaction.user.id,
                        Poketokens: 0,
                        Pokecoins: 50000,
                        Blacklisted: false,
                        TotalCaught: 0,
                        MythicalCaught: 0,
                        LegendaryCaught: 0,
                        UBCaught: 0,
                        ShinyCaught: 0,
                        TrainerNumber: nextTrainerNumber,
                        TrainerRank: 0,
                        VotedCooldown: 0,
                        LatestAgreed: Date.now(),
                        Inventory: [{
                            PokemonID: generatedUUID,
                            PokemonName: pokename,
                            PokemonPicture: pokepic,
                            PokemonSelected: true,
                            PokemonOnMarket: false,
                            PokemonFavorited: false,
                            PokemonData: {
                                PokemonOriginalOwner: nextTrainerNumber,
                                PokemonLevel: 5,
                                PokemonXP: 0,
                                PokemonOrder: 1,
                                PokemonIVs: {
                                    HP: HPiv,
                                    Attack: ATKiv,
                                    Defense: DEFiv,
                                    SpecialAtk: SPECATKiv,
                                    SpecialDef: SPECDEFiv,
                                    Speed: SPEEDiv,
                                    TotalIV: IVtotal,
                                }
                            },
                        }]
                    })

                    await globaldata.findOneAndUpdate({
                        accessString: "accessingGlobalDataFromString",
                    }, {
                        $inc: {
                            Registered: 1
                        }
                    })

                    await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setDescription(`:white_check_mark: **Successfully registered, welcome to Discmon! :)**`)
                        ],
                        components: [],
                        content: ''
                    })

                    //await interaction.deleteReply();
                };

                if (interactionCollector.customId === "water") {
                    await interactionCollector.deferUpdate();
                    const pokename = "Squirtle";
                    const pokepic = "https://img.pokemondb.net/artwork/vector/large/squirtle.png";
                    const generatedUUID = generateSnowflake();

                    const highestTrainer = await getGlobalData();

                    const nextTrainerNumber = parseInt(highestTrainer.Registered) + 1;

                    const HPiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const ATKiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const DEFiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const SPECATKiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const SPECDEFiv = Math.floor(Math.random() * (31 - 1) + 1);
                    const SPEEDiv = Math.floor(Math.random() * (31 - 1) + 1);

                    const IVpercentage = HPiv + ATKiv + DEFiv + SPECATKiv + SPECDEFiv + SPEEDiv;
                    const IVtotal = (IVpercentage / 186 * 100).toFixed(2);

                    await userData.create({
                        OwnerID: interaction.user.id,
                        Poketokens: 0,
                        Pokecoins: 50000,
                        Blacklisted: false,
                        TotalCaught: 0,
                        MythicalCaught: 0,
                        LegendaryCaught: 0,
                        UBCaught: 0,
                        ShinyCaught: 0,
                        TrainerNumber: nextTrainerNumber,
                        TrainerRank: 0,
                        VotedCooldown: 0,
                        LatestAgreed: Date.now(),
                        Inventory: [{
                            PokemonID: generatedUUID,
                            PokemonName: pokename,
                            PokemonPicture: pokepic,
                            PokemonSelected: true,
                            PokemonOnMarket: false,
                            PokemonFavorited: false,
                            PokemonData: {
                                PokemonOriginalOwner: nextTrainerNumber,
                                PokemonLevel: 5,
                                PokemonXP: 0,
                                PokemonOrder: 1,
                                PokemonIVs: {
                                    HP: HPiv,
                                    Attack: ATKiv,
                                    Defense: DEFiv,
                                    SpecialAtk: SPECATKiv,
                                    SpecialDef: SPECDEFiv,
                                    Speed: SPEEDiv,
                                    TotalIV: IVtotal,
                                }
                            },
                        }]
                    })

                    await globaldata.findOneAndUpdate({
                        accessString: "accessingGlobalDataFromString",
                    }, {
                        $inc: {
                            Registered: 1
                        }
                    })

                    await interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setDescription(`:white_check_mark: **Successfully registered, welcome to Discmon! :)**`)
                        ],
                        components: [],
                        content: ''
                    })

                    //await interaction.deleteReply();
                };
            });

            collector.on('end', async (collected) => {
                try {
                    for (let i = 0; i < pokeRow.components.length; i++) {
                        pokeRow.components[i].setDisabled(true);
                    }
    
                    await interaction.editReply({
                        components: [pokeRow]
                    });
                } catch (error) {
                    if (error.message === "Unknown Message") {
                        return;
                    } else {
                        console.log(error)
                    }
                }
            });
        }
    }