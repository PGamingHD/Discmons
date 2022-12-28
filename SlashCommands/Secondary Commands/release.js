    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        ApplicationCommandOptionType,
        EmbedBuilder,
        ButtonBuilder,
        ActionRowBuilder,
        ButtonStyle
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json');
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    const userData = require("../../schemas/userData");

    module.exports = {
        name: 'release',
        description: 'Release one of your precious Pokémons out into the wild',
        options: [{
            name: 'pokemonid',
            description: 'What is the Pokémons ID that you wish to release?',
            type: ApplicationCommandOptionType.Integer,
            required: true
        }],
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {
            const releaseid = interaction.options.getInteger('pokemonid');

            const confirmRow = new ActionRowBuilder()
            confirmRow.addComponents([
                new ButtonBuilder()
                .setLabel('Confirm')
                .setEmoji({
                    name: "✅"
                })
                .setCustomId('confirm')
                .setStyle(ButtonStyle.Success)
            ])
            confirmRow.addComponents([
                new ButtonBuilder()
                .setLabel('Deny')
                .setEmoji({
                    name: "❌"
                })
                .setCustomId('deny')
                .setStyle(ButtonStyle.Danger)
            ])

            const findpoke = await userData.findOne({
                OwnerID: interaction.user.id,
                "Inventory.PokemonData.PokemonOrder": releaseid
            }, {
                "Inventory.$": 1
            });

            if (!findpoke) {
                return interaction.reply({
                    content: ':x: A pokémon with the specified ID could not be found in your inventory!',
                    ephemeral: true
                });
            }

            if (findpoke.Inventory[0].PokemonSelected) {
                return interaction.reply({
                    content: ':x: You may not release your selected Pokémon!',
                    ephemeral: true
                });
            }

            if (findpoke.Inventory[0].PokemonOnMarket) {
                return interaction.reply({
                    content: ':x: You may not release this Pokémon because it is up for sale at the Market!',
                    ephemeral: true
                });
            }

            if (findpoke.Inventory[0].PokemonFavorited) {
                return interaction.reply({
                    content: ':x: You may not release this Pokémon because it is on your favorites list!',
                    ephemeral: true
                });
            }

            const pokeName = findpoke.Inventory[0].PokemonName;
            const pokeLevel = findpoke.Inventory[0].PokemonData.PokemonLevel;
            const mainMsg = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setDescription(`Please confirm that you wish to release your \`${pokeName}\` at level \`${pokeLevel}\`!`)
                ],
                components: [confirmRow]
            });

            const filter = m => m.user.id === interaction.user.id;
            const collector = mainMsg.createMessageComponentCollector({
                filter,
                idle: 1000 * 60,
                time: 1000 * 120,
                max: 1,
            });

            collector.on('collect', async (interactionCollector) => {
                if (interactionCollector.customId === "confirm") {
                    await interactionCollector.deferUpdate();
                    
                    await userData.findOneAndUpdate({
                        OwnerID: interaction.user.id,
                    }, {
                        $pull: {
                            Inventory: {
                               "PokemonData.PokemonOrder": releaseid,
                            }
                        }
                    });

                    return interactionCollector.editReply({
                        embeds: [],
                        components: [],
                        content: `:white_check_mark: Successfully release your \`${pokeName}\` into the wilderness!`
                    });
                };

                if (interactionCollector.customId === "deny") {
                    await interactionCollector.deferUpdate();
                    return;
                };
            });

            collector.on('end', async (collected) => {
                try {
                    for (let i = 0; i < confirmRow.components.length; i++) {
                        confirmRow.components[i].setDisabled(true);
                    }

                    await interaction.editReply({
                        components: [confirmRow]
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