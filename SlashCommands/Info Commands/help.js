    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        EmbedBuilder,
        ActionRowBuilder,
        ButtonBuilder,
        ButtonStyle
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');

    module.exports = {
        name: 'help',
        description: 'Dont know what commands the client has? Then this is the command for you',
        startCmd: true,
        /**
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {

            //BUTTONS

            const mainRow = new ActionRowBuilder()
            mainRow.addComponents([
                new ButtonBuilder()
                .setEmoji('⬅️')
                .setCustomId('backward')
                .setStyle(ButtonStyle.Primary)
            ])
            mainRow.addComponents([
                new ButtonBuilder()
                .setEmoji('➡️')
                .setCustomId('forward')
                .setStyle(ButtonStyle.Primary)
            ])

            //EMBEDS

            const embed1 = new EmbedBuilder()
            embed1.setColor(ee.color)
            embed1.setTitle(`Discmon Commands`)
            embed1.setDescription(`Information can be found on the slash command simply by typing the slash command.\nDon't know how to use slash commands? All slash commands are triggered by the prefix \`/\`!`)
            embed1.addFields([{
                name: 'Configuration',
                value: `Configure the client to your own needs.\n\`redirect\``
            }, {
                name: 'Pokémon',
                value: `General Pokémon related commands.\n\`info\`, \`pokemons\`, \`select\`, \`release\`, \`favorite\``,
            }, {
                name: 'Shops',
                value: `Purchasing items from the shop.\n\`shop\`, \`store\`, \`market\``
            }, {
                name: 'Information',
                value: `Main information commands, will display both Pokémon and client info.\n\`help\`, \`status\`, \`profile\`, \`ping\`, \`changelog\`, \`leaderboard\``
            }, {
                name: 'Client',
                value: `Everything related to the bot-client, and starting your adventure.\n\`start\``
            }])
            embed1.setFooter({
                text: 'Page 1 of 2'
            })

            const embed2 = new EmbedBuilder()
            embed2.setColor(ee.color)
            embed2.setTitle(`Discmon Commands`)
            embed2.setDescription(`Information can be found on the slash command simply by typing the slash command.\nDon't know how to use slash commands? All slash commands are triggered by the prefix \`/\`!`)
            embed2.addFields([{
                name: 'Catching',
                value: `Everything that has to do with your adventure/catching to do.\n\`catch\`, \`hint\``
            }, {
                name: 'Trainer',
                value: 'Everything Trainer related will be put up here.\n\`item\`, \`gift\`, \`trade\`'
            }])
            embed2.setFooter({
                text: 'Page 2 of 2'
            })


            await interaction.reply({
                embeds: [embed1],
                components: [mainRow],
                fetchReply: true
            })


            const newInteraction = await interaction.fetchReply()

            const filter = m => m.user.id === interaction.user.id;
            const collector = newInteraction.createMessageComponentCollector({
                filter,
                idle: 1000 * 60,
                time: 1000 * 120
            });

            collector.on('collect', async (interactionCollector) => {
                if (interactionCollector.customId === "forward") {
                    await interactionCollector.deferUpdate();
                    if (interactionCollector.message.embeds[0].data.footer.text === "Page 1 of 2") {
                        await interactionCollector.editReply({
                            embeds: [embed2],
                            components: [mainRow],
                            fetchReply: true
                        })
                    } else {
                        await interactionCollector.editReply({
                            embeds: [embed1],
                            components: [mainRow],
                            fetchReply: true
                        })
                    }
                }

                if (interactionCollector.customId === "backward") {
                    await interactionCollector.deferUpdate();
                    if (interactionCollector.message.embeds[0].data.footer.text === "Page 2 of 2") {
                        await interactionCollector.editReply({
                            embeds: [embed1],
                            components: [mainRow],
                            fetchReply: true
                        })
                    } else {
                        await interactionCollector.editReply({
                            embeds: [embed2],
                            components: [mainRow],
                            fetchReply: true
                        })
                    }
                }
            });

            collector.on('end', async (interactionCollected) => {
                try {
                    for (let i = 0; i < mainRow.components.length; i++) {
                        mainRow.components[i].setDisabled(true);
                    }
    
                    await interaction.editReply({
                        components: [mainRow]
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