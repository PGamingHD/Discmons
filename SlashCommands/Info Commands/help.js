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
        description: 'Do something!',
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
                name: 'Market',
                value: `The main Marketplace for selling and purchasing Pokémons.\n\`market\``
            }, {
                name: 'Configuration',
                value: `Configure the client to your own needs.\n\`redirect\``
            }, {
                name: 'Pokémon',
                value: `General Pokémon related commands.\n\`info\`, \`pokemons\`, \`select\``,
            }, {
                name: 'Shops',
                value: `Purchasing items from the shop.\n\`shop\`, \`store\``
            }, {
                name: 'Information',
                value: `Main information commands, will display both Pokémon and client info.\n\`help\`, \`status\`, \`profile\`, \`ping\``
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
                value: `\`catch\`, \`hint\``
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
                for (let i = 0; i < mainRow.components.length; i++) {
                    mainRow.components[i].setDisabled(true);
                }

                await interaction.editReply({
                    components: [mainRow]
                });
            });
        }
    }