    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton,
        ActionRowBuilder,
        ButtonBuilder,
        ButtonStyle,
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json');
    const {
        EmbedBuilder
    } = require('@discordjs/builders');
    const userData = require("../../schemas/userData");
    const server = require("../../schemas/Servers");
    const pokemon = require("../../schemas/Pokemons");
    const developer = require("../../schemas/developerData");
    const {
        maintenancemode,
        forcespawn,
        sendWebhook
    } = require("../../handler/functions");
    const {
        inspect
    } = require(`util`);

    module.exports = {
        name: 'staffmenu',
        description: 'Display the Staff Menu, may only be used by Bot Staff!',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {

            const modButtons = new ActionRowBuilder()
            modButtons.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "❌"
                })
                .setLabel('Blacklist User')
                .setCustomId('blacklist')
                .setStyle(ButtonStyle.Primary)
            ])
            modButtons.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "❌"
                })
                .setLabel('Blacklist Server')
                .setCustomId('blacklists')
                .setStyle(ButtonStyle.Primary)
            ])

            const adminButtons = new ActionRowBuilder()
            adminButtons.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "🏢"
                })
                .setLabel('Spawn Pokemon')
                .setCustomId('spawnpokemon')
                .setStyle(ButtonStyle.Primary)
            ])

            const devButtons = new ActionRowBuilder()
            devButtons.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "☢️"
                })
                .setLabel('Shutdown')
                .setCustomId('shutdown')
                .setStyle(ButtonStyle.Primary)
            ])
            devButtons.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "⚙️"
                })
                .setLabel('Maintenance Mode')
                .setCustomId('maintenance')
                .setStyle(ButtonStyle.Primary)
            ])
            devButtons.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "📝"
                })
                .setLabel('ToS Update')
                .setCustomId('tosupdate')
                .setStyle(ButtonStyle.Primary)
            ])
            devButtons.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "🔂"
                })
                .setLabel('Reload Command')
                .setCustomId('reloadcmd')
                .setStyle(ButtonStyle.Primary)
            ])

            const devButtons2 = new ActionRowBuilder()
            devButtons2.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "🥇"
                })
                .setLabel('Set Rank')
                .setCustomId('setrank')
                .setStyle(ButtonStyle.Primary)
            ])
            devButtons2.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "💸"
                })
                .setLabel('Set Money')
                .setCustomId('setmoney')
                .setStyle(ButtonStyle.Primary)
            ])
            devButtons2.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "🪙"
                })
                .setLabel('Set Tokens')
                .setCustomId('settokens')
                .setStyle(ButtonStyle.Primary)
            ])
            devButtons2.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "♻️"
                })
                .setLabel('Evaluate')
                .setCustomId('evaluate')
                .setStyle(ButtonStyle.Primary)
            ])
            devButtons2.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "☢️"
                })
                .setLabel('Developer Info')
                .setCustomId('devinfo')
                .setStyle(ButtonStyle.Primary)
            ])

            const findrank = await userData.findOne({
                OwnerID: interaction.user.id,
            })

            if (findrank.TrainerRank < 5) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.wrongcolor)
                        .setDescription(`:x: You do not have permission to view this Menu!`)
                        .setTimestamp()
                    ],
                    ephemeral: true
                })
            }

            let permissionname;

            const adminRow = new ActionRowBuilder()
            if (findrank.TrainerRank === 5) {
                permissionname = "Moderator"
                adminRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji({
                        name: "👮‍♂️"
                    })
                    .setLabel('Moderator Menu')
                    .setCustomId('modMenu')
                    .setStyle(ButtonStyle.Primary)
                ])
            }

            if (findrank.TrainerRank === 6) {
                permissionname = "Administrator"
                adminRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji({
                        name: "👮‍♂️"
                    })
                    .setLabel('Moderator Menu')
                    .setCustomId('modMenu')
                    .setStyle(ButtonStyle.Primary)
                ])
                adminRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji({
                        name: "🔨"
                    })
                    .setLabel('Administrator Menu')
                    .setCustomId('adminMenu')
                    .setStyle(ButtonStyle.Primary)
                ])
            }

            if (findrank.TrainerRank === 7) {
                permissionname = "Developer"
                adminRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji({
                        name: "👮‍♂️"
                    })
                    .setLabel('Moderator Menu')
                    .setCustomId('modMenu')
                    .setStyle(ButtonStyle.Primary)
                ])
                adminRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji({
                        name: "🔨"
                    })
                    .setLabel('Administrator Menu')
                    .setCustomId('adminMenu')
                    .setStyle(ButtonStyle.Primary)
                ])
                adminRow.addComponents([
                    new ButtonBuilder()
                    .setEmoji({
                        name: "⚙️"
                    })
                    .setLabel('Developer Menu')
                    .setCustomId('devMenu')
                    .setStyle(ButtonStyle.Primary)
                ])
            }

            const initialReply = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`**Staff Menu - Welcome back ${interaction.user.username}!**`)
                    .setDescription(`*Welcome back Staff Member, this is the Staff Menu for Discmon! Please make sure to follow the following rules when using Staff Permissions!*\n\n> **[1]. Never abuse your permissions!**\n> **[2]. Do not use commands in public channels!**\n> **[3]. Everything is logged, you won't get away with anything!**\n> **[4]. Be active, inactivity will get you demoted!**\n> **[5]. Never use commands to benefit yourself!**\n\n*Following the rules above will not get you punished, not following them might get you punished.*\n\n*Now, pick a menu below and click on it to open the specific menu!*`)
                    .setTimestamp()
                    .setThumbnail(`https://cdn.discordapp.com/attachments/968543677393813508/976442215448576060/support.devButtonspng`)
                    .setFooter({
                        text: `Logged in with ${permissionname} permissions!`
                    })
                ],
                components: [adminRow]
            })

            //const newInteraction = await interaction.fetchReply();

            let filter = m => m.user.id === interaction.user.id;
            const collector = initialReply.createMessageComponentCollector({
                filter,
                idle: 1000 * 60,
                time: 1000 * 120
            });

            collector.on('collect', async (interactionCollector) => {
                if (interactionCollector.customId === "modMenu") {
                    await interactionCollector.deferUpdate();

                    await sendWebhook(config.adminLogs, "**Moderator Login Detected**", `**Logged in user: \`${interaction.user.tag}\` (\`${interaction.user.id}\`)**`, ee.color);

                    return interactionCollector.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setTitle(`**Moderator Menu - Welcome back ${interaction.user.username}!**`)
                        ],
                        ephemeral: true,
                        components: [modButtons]
                    })
                }

                if (interactionCollector.customId === "adminMenu") {
                    await interactionCollector.deferUpdate();

                    await sendWebhook(config.adminLogs, "**Admin Login Detected**", `**Logged in user: \`${interaction.user.tag}\` (\`${interaction.user.id}\`)**`, ee.color);

                    return interactionCollector.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setTitle(`**Admin Menu - Welcome back ${interaction.user.username}!**`)
                        ],
                        ephemeral: true,
                        components: [adminButtons]
                    })
                }

                if (interactionCollector.customId === "devMenu") {
                    await interactionCollector.deferUpdate();

                    await sendWebhook(config.adminLogs, "**Developer Login Detected**", `**Logged in user: \`${interaction.user.tag}\` (\`${interaction.user.id}\`)**`, ee.color);

                    return interactionCollector.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setTitle(`**Developer Menu - Welcome back ${interaction.user.username}!**`)
                        ],
                        ephemeral: true,
                        components: [devButtons, devButtons2]
                    })
                }

                if (interactionCollector.customId === "blacklist") {
                    await interactionCollector.deferUpdate();
                    let filter = m => m.author.id === interaction.user.id;
                    return interactionCollector.editReply({
                        content: ':white_check_mark: Please enter the ID of the User you wish to blacklist from using the bot services! (Say \`cancel\` to cancel this command)',
                        components: [],
                        embeds: [],
                        fetchReply: true
                    }).then(() => {
                        interactionCollector.channel.awaitMessages({
                            filter,
                            max: 1, //MAX COLLECTIONS
                            time: 1000 * 60, // SECONDS
                        }).then(async (collected) => {
                            const blacklistuserid = collected.first();

                            await blacklistuserid.delete();

                            if (blacklistuserid.content.toString() === 'cancel') {
                                return interactionCollector.editReply({
                                    content: ':white_check_mark: Successfully cancelled command!',
                                })
                            }

                            if (blacklistuserid.content.length < 18) {
                                return interactionCollector.editReply({
                                    content: ':x: That user ID is not valid, must be 18 characters in length.',
                                })
                            }

                            const userfound = await userData.findOne({
                                OwnerID: blacklistuserid.content,
                            })

                            if (!userfound) {
                                return interactionCollector.editReply({
                                    content: ':x: The user with the specified ID could not be found, please try again!',
                                })
                            }

                            if (userfound.Blacklisted) {
                                await userfound.updateOne({
                                    Blacklisted: false
                                })

                                await interactionCollector.editReply({
                                    content: `:white_check_mark: Successfully removed blacklist for the user with ID \`[${blacklistuserid.content}]\` as requested!`
                                })

                                await sendWebhook(config.adminLogs, "Whitelist Detected", `**User <@!${interaction.user.id}> has just removed the blacklist from user with ID \`${blacklistuserid.content}\`**`, ee.color);
                            } else {
                                await userfound.updateOne({
                                    Blacklisted: true
                                })

                                await interactionCollector.editReply({
                                    content: `:white_check_mark: Successfully blacklisted the user with ID \`[${blacklistuserid.content}]\` as requested!`
                                });

                                await sendWebhook(config.adminLogs, "Blacklist Detected", `**User <@!${interaction.user.id}> has just blacklisted user with ID \`${blacklistuserid.content}\`**`, ee.color);
                            }

                        }).catch((collected) => {
                            return interactionCollector.editReply({
                                content: ':x: The interaction response has timed out, please rerun this command again!'
                            })
                        })
                    })
                }

                if (interactionCollector.customId === "blacklists") {
                    await interactionCollector.deferUpdate();
                    let filter = m => m.author.id === interaction.user.id;
                    return interactionCollector.editReply({
                        content: ':white_check_mark: Please enter the ID of the Server you wish to blacklist from using the bot services! (Say \`cancel\` to cancel this command)',
                        components: [],
                        embeds: [],
                        fetchReply: true
                    }).then(() => {
                        interactionCollector.channel.awaitMessages({
                            filter,
                            max: 1, //MAX COLLECTIONS
                            time: 1000 * 60, // SECONDS
                        }).then(async (collected) => {
                            const blacklistserverid = collected.first();

                            await blacklistserverid.delete();

                            if (blacklistserverid.content.toString() === 'cancel') {
                                return interactionCollector.editReply({
                                    content: ':white_check_mark: Successfully cancelled command!'
                                })
                            }

                            if (blacklistserverid.content.length < 18) {
                                return interactionCollector.editReply({
                                    content: ':x: That server ID is not valid, must be 18 characters in length.',
                                })
                            }

                            const serverfound = await server.findOne({
                                ServerID: blacklistserverid.content,
                            })

                            if (!serverfound) {
                                return interactionCollector.editReply({
                                    content: ':x: The server with the specified ID could not be found, please try again!'
                                })
                            }

                            if (serverfound.Blacklisted) {
                                await serverfound.updateOne({
                                    Blacklisted: false
                                })

                                await interactionCollector.editReply({
                                    content: `:white_check_mark: Successfully removed blacklist from the server with ID \`[${blacklistserverid.content}]\` as requested!`
                                })

                                await sendWebhook(config.adminLogs, "Whitelist Detected", `**User <@!${interaction.user.id}> has just removed the blacklist from server with ID \`${blacklistserverid.content}\`**`, ee.color);
                            } else {
                                await serverfound.updateOne({
                                    Blacklisted: true
                                })

                                await interactionCollector.editReply({
                                    content: `:white_check_mark: Successfully blacklisted the server with ID \`[${blacklistserverid.content}]\` as requested!`
                                });

                                await sendWebhook(config.adminLogs, "Blacklist Detected", `**User <@!${interaction.user.id}> has just blacklisted from server with ID \`${blacklistserverid.content}\`**`, ee.color);
                            }

                        }).catch((collected) => {
                            return interactionCollector.editReply({
                                content: ':x: The response was timed out, please use the command again!'
                            })
                        })
                    })
                }

                if (interactionCollector.customId === "insertpokemon") {
                    await interactionCollector.deferUpdate();
                    let filter = m => m.author.id === interaction.user.id;
                    return interactionCollector.editReply({
                        content: ':white_check_mark: Please enter the following arguments to insert a Pokémon, \`PokemonID\`, \`PokemonName\`, \`PokemonPicture\` & \`PokemonRarity\` in the correct order! (Say \`cancel\` to cancel the command)',
                        components: [],
                        embeds: [],
                        fetchReply: true
                    }).then(() => {
                        interactionCollector.channel.awaitMessages({
                            filter,
                            max: 1, //MAX COLLECTIONS
                            time: 1000 * 60, // SECONDS
                        }).then(async (collected) => {
                            const pokemonargs = collected.first();

                            await pokemonargs.delete();

                            if (pokemonargs.content.toString() === 'cancel') {
                                return interactionCollector.editReply({
                                    content: ':white_check_mark: Successfully cancelled command!'
                                })
                            }

                            const newLines = pokemonargs.content.split('\n');

                            await newLines.forEach(async (line) => {
                                const args = line.split(' ');

                                const rarities = [
                                    "Common",
                                    "Uncommon",
                                    "Rare",
                                    "Legendary",
                                    "Mythical",
                                    "Ultra Beast",
                                    "Shiny"
                                ]

                                if (!args[0] || !args[1] || !args[2] || !args[3]) {
                                    return;
                                }

                                if (!rarities.includes(args[3])) {
                                    return;
                                }

                                await pokemon.create({
                                    PokemonID: args[0],
                                    PokemonName: args[1],
                                    PokemonPicture: args[2],
                                    PokemonRarity: args[3]
                                });
                            })

                            return interactionCollector.editReply({
                                content: `:white_check_mark: Successfully inserted pokémon into the database!`
                            })
                        }).catch((collected) => {
                            return interactionCollector.editReply({
                                content: ':x: The response was timed out, please use the command again!'
                            })
                        })
                    })
                }

                if (interactionCollector.customId === "maintenance") {
                    await interactionCollector.deferUpdate();
                    let filter = m => m.author.id === interaction.user.id;
                    return interactionCollector.editReply({
                        content: ':white_check_mark: Please enter the following arguments to enter maintenance mode, \`Cooldown (s)\` & \`Length (m)\` in the correct order! (Say \`cancel\` to cancel the command)',
                        components: [],
                        embeds: [],
                        fetchReply: true
                    }).then(() => {
                        interactionCollector.channel.awaitMessages({
                            filter,
                            max: 1, //MAX COLLECTIONS
                            time: 1000 * 60, // SECONDS
                        }).then(async (collected) => {
                            const maintenanceargs = collected.first();

                            const args = maintenanceargs.content.split(/ +/).filter(Boolean);

                            await maintenanceargs.delete();

                            if (maintenanceargs.content.toString() === 'cancel') {
                                return interactionCollector.editReply({
                                    content: ':white_check_mark: Successfully cancelled command!'
                                })
                            }

                            if (!args[0] || !args[1]) {
                                return interactionCollector.editReply({
                                    content: ':x: You have not inserted both args as requested!'
                                })
                            }

                            maintenancemode(client, interaction, args[0], args[1]);

                            return interactionCollector.editReply({
                                content: ':white_check_mark: Successfully toggled Maintenance mode!'
                            })

                        }).catch((collected) => {
                            return interactionCollector.editReply({
                                content: ':x: The response was timed out, please use the command again!'
                            });
                        })
                    })
                }

                if (interactionCollector.customId === "spawnpokemon") {
                    await interactionCollector.deferUpdate();
                    let filter = m => m.author.id === interaction.user.id;
                    return interactionCollector.editReply({
                        content: ':white_check_mark: Please enter the following arguments to spawn a pokemon, \`PokemonName\` & \`PokemonLevel\` in the correct order! (Say \`cancel\` to cancel the command)',
                        components: [],
                        embeds: [],
                        fetchReply: true
                    }).then(() => {
                        interactionCollector.channel.awaitMessages({
                            filter,
                            max: 1, //MAX COLLECTIONS
                            time: 1000 * 60, // SECONDS
                        }).then(async (collected) => {
                            const pokemonargs = collected.first();

                            const args = pokemonargs.content.split(/ +/).filter(Boolean);

                            await pokemonargs.delete();

                            if (pokemonargs.content.toString() === 'cancel') {
                                return interactionCollector.editReply({
                                    content: ':white_check_mark: Successfully cancelled command!'
                                })
                            }

                            if (!args[0] || !args[1]) {
                                return interactionCollector.editReply({
                                    content: ':x: You have not inserted both args as requested!'
                                })
                            }

                            const findRank = await userData.findOne({
                                OwnerID: interaction.user.id
                            });

                            if (parseInt(args[1]) > 100 && findRank.TrainerRank !== 7) {
                                return interactionCollector.editReply({
                                    content: ':x: Only developers may set a Pokémons level to over 100 for testing purposes!'
                                })
                            }

                            let makeCapital = s => s.replace(/./, c => c.toUpperCase())
                            const pokemonName = makeCapital(args[0]);

                            const findpoke = await pokemon.findOne({
                                PokemonName: pokemonName
                            })

                            if (!findpoke) {
                                return interactionCollector.editReply({
                                    content: `:x: The pokémon with the name \`${pokemonName}\` could not be found in the database!`
                                })
                            }

                            forcespawn(interaction, pokemonName, args[1])

                            await sendWebhook(config.adminLogs, "PokeSpawn Detected", `**User <@!${interaction.user.id}> has just spawned a pokemon called \`${pokemonName}\` with a level of \`${args[1]}\`!**`, ee.color);

                            return interactionCollector.editReply({
                                content: `:white_check_mark: Successfully spawned Pokémon \`[ ${pokemonName} ]\` as requested!`
                            })

                        }).catch((collected) => {
                            return interactionCollector.editReply({
                                content: ':x: The response was timed out, please use the command again!'
                            })
                        })
                    })
                }

                if (interactionCollector.customId === "tosupdate") {
                    await interactionCollector.deferUpdate();
                    await developer.findOneAndUpdate({
                        developerAccess: "accessStringforDeveloperOnly"
                    }, {
                        LastTOSUpdate: Date.now()
                    })

                    return interactionCollector.editReply({
                        content: `:white_check_mark: Successfully set new ToS agreement date to \`${Date.now()}\`, everyone will have to reagree to use features!`,
                        components: [],
                        embeds: []
                    })
                }

                if (interactionCollector.customId === "reloadcmd") {
                    await interactionCollector.deferUpdate();
                    let filter = m => m.author.id === interaction.user.id;
                    return interactionCollector.editReply({
                        content: ':white_check_mark: Please enter the following arguments to reload a command, \`CommandName\` in the correct order! (Say \`cancel\` to cancel the command)',
                        components: [],
                        embeds: [],
                        fetchReply: true
                    }).then(() => {
                        interactionCollector.channel.awaitMessages({
                            filter,
                            max: 1, //MAX COLLECTIONS
                            time: 1000 * 60, // SECONDS
                        }).then(async (collected) => {
                            const cmdargs = collected.first();

                            const args = cmdargs.content.split(/ +/).filter(Boolean);

                            await cmdargs.delete();

                            if (cmdargs.content.toString() === 'cancel') {
                                return interactionCollector.editReply({
                                    content: ':white_check_mark: Successfully cancelled command!'
                                })
                            }

                            if (!args[0]) {
                                return interactionCollector.editReply({
                                    content: ':x: You have not inserted a command name as requested!',
                                })
                            }

                            try {
                                let reload = false;
                                const commandname = args[0].toLowerCase();
                                for (let i = 0; i < client.slashcategories.length; i += 1) {
                                    let dir = client.slashcategories[i];
                                    try {
                                        if (!commandname)
                                            return interactionCollector.editReply({
                                                embeds: [
                                                    new EmbedBuilder()
                                                    .setColor(ee.errorColor)
                                                    .setDescription(`Please include an argument.`),
                                                ],
                                            });
                                        delete require.cache[require.resolve(`../../SlashCommands/${dir}/${commandname}.js`)];
                                        client.slashCommands.delete(commandname);
                                        const pull = require(`../../SlashCommands/${dir}/${commandname}.js`);
                                        client.slashCommands.set(commandname, pull);
                                        reload = true;
                                    } catch {}
                                }
                                if (reload) return interactionCollector.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setColor(ee.color)
                                        .setDescription(`:white_check_mark: Successfully reloaded slashcommand \`[ ${commandname} ]\``),
                                    ],
                                    content: ' '
                                });

                                return interactionCollector.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setColor(ee.errorColor)
                                        .setDescription(`:x: Could not reload slashcommand: \`[ ${commandname} ]\``)
                                    ],
                                    content: ' '
                                });
                            } catch (e) {
                                return interactionCollector.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setColor(ee.errorColor)
                                        .setTitle(`:x: Something went very wrong`)
                                        .setDescription(`\`\`\`${e.message}\`\`\``),
                                    ],
                                    content: ' '
                                });
                            }
                        }).catch((collected) => {
                            return interactionCollector.editReply({
                                content: ':x: The response was timed out, please use the command again!'
                            })
                        })
                    })
                }

                if (interactionCollector.customId === "setrank") {
                    await interactionCollector.deferUpdate();
                    let filter = m => m.author.id === interaction.user.id;
                    return interactionCollector.editReply({
                        content: ':white_check_mark: Please enter the following arguments to reload a command, \`UserID\` & \`NewRank\` in the correct order! (Say \`cancel\` to cancel the command)',
                        components: [],
                        embeds: [],
                        fetchReply: true
                    }).then(() => {
                        interactionCollector.channel.awaitMessages({
                            filter,
                            max: 1, //MAX COLLECTIONS
                            time: 1000 * 60, // SECONDS
                        }).then(async (collected) => {
                            const cmdargs = collected.first();

                            const args = cmdargs.content.split(/ +/).filter(Boolean);

                            await cmdargs.delete();

                            if (cmdargs.content.toString() === 'cancel') {
                                return interactionCollector.editReply({
                                    content: ':white_check_mark: Successfully cancelled command!'
                                })
                            }

                            if (!args[0] || !args[1]) {
                                return interactionCollector.editReply({
                                    content: ':x: You have not inserted the args as requested!',
                                })
                            }

                            const finduser = await userData.findOne({
                                OwnerID: args[0]
                            })

                            if (!finduser) {
                                return interactionCollector.editReply({
                                    content: ':x: Could not found a registered user with the supplied UserID!',
                                })
                            }

                            const value = parseInt(args[1]);

                            if (isNaN(value)) {
                                return interactionCollector.editReply({
                                    content: ':x: Value must be a valid number!',
                                })
                            }

                            if (value < 0 || value > 7) {
                                return interactionCollector.editReply({
                                    content: ':x: Value must be between 0-7!',
                                })
                            }

                            await finduser.updateOne({
                                $set: {
                                    TrainerRank: value
                                }
                            });

                            return interactionCollector.editReply({
                                content: ':white_check_mark: Successfully changed users rank!',
                            })
                        }).catch((collected) => {
                            return interactionCollector.editReply({
                                content: ':x: The response was timed out, please use the command again!'
                            })
                        })
                    })
                }

                if (interactionCollector.customId === "setmoney") {
                    await interactionCollector.deferUpdate();
                    let filter = m => m.author.id === interaction.user.id;
                    return interactionCollector.editReply({
                        content: ':white_check_mark: Please enter the following arguments to reload a command, \`UserID\` & \`MoneyValue\` in the correct order! (Say \`cancel\` to cancel the command)',
                        components: [],
                        embeds: [],
                        fetchReply: true
                    }).then(() => {
                        interactionCollector.channel.awaitMessages({
                            filter,
                            max: 1, //MAX COLLECTIONS
                            time: 1000 * 60, // SECONDS
                        }).then(async (collected) => {
                            const cmdargs = collected.first();

                            const args = cmdargs.content.split(/ +/).filter(Boolean);

                            await cmdargs.delete();

                            if (cmdargs.content.toString() === 'cancel') {
                                return interactionCollector.editReply({
                                    content: ':white_check_mark: Successfully cancelled command!'
                                })
                            }

                            if (!args[0] || !args[1]) {
                                return interactionCollector.editReply({
                                    content: ':x: You have not inserted the args as requested!',
                                })
                            }

                            const finduser = await userData.findOne({
                                OwnerID: args[0]
                            })

                            if (!finduser) {
                                return interactionCollector.editReply({
                                    content: ':x: Could not found a registered user with the supplied UserID!',
                                })
                            }

                            const value = parseInt(args[1]);

                            if (isNaN(value)) {
                                return interactionCollector.editReply({
                                    content: ':x: Value must be a valid number!',
                                })
                            }

                            await finduser.updateOne({
                                $set: {
                                    Pokecoins: value
                                }
                            });

                            return interactionCollector.editReply({
                                content: ':white_check_mark: Successfully changed users money!',
                            })
                        }).catch((collected) => {
                            return interactionCollector.editReply({
                                content: ':x: The response was timed out, please use the command again!'
                            })
                        })
                    })
                }

                if (interactionCollector.customId === "settokens") {
                    await interactionCollector.deferUpdate();
                    let filter = m => m.author.id === interaction.user.id;
                    return interactionCollector.editReply({
                        content: ':white_check_mark: Please enter the following arguments to reload a command, \`UserID\` & \`NewTokens\` in the correct order! (Say \`cancel\` to cancel the command)',
                        components: [],
                        embeds: [],
                        fetchReply: true
                    }).then(() => {
                        interactionCollector.channel.awaitMessages({
                            filter,
                            max: 1, //MAX COLLECTIONS
                            time: 1000 * 60, // SECONDS
                        }).then(async (collected) => {
                            const cmdargs = collected.first();

                            const args = cmdargs.content.split(/ +/).filter(Boolean);

                            await cmdargs.delete();

                            if (cmdargs.content.toString() === 'cancel') {
                                return interactionCollector.editReply({
                                    content: ':white_check_mark: Successfully cancelled command!'
                                })
                            }

                            if (!args[0] || !args[1]) {
                                return interactionCollector.editReply({
                                    content: ':x: You have not inserted the args as requested!',
                                })
                            }

                            const finduser = await userData.findOne({
                                OwnerID: args[0]
                            })

                            if (!finduser) {
                                return interactionCollector.editReply({
                                    content: ':x: Could not found a registered user with the supplied UserID!',
                                })
                            }

                            const value = parseInt(args[1]);

                            if (isNaN(value)) {
                                return interactionCollector.editReply({
                                    content: ':x: Value must be a valid number!',
                                })
                            }

                            await finduser.updateOne({
                                $set: {
                                    Poketokens: value
                                }
                            });

                            return interactionCollector.editReply({
                                content: ':white_check_mark: Successfully changed users tokens!',
                            })
                        }).catch((collected) => {
                            return interactionCollector.editReply({
                                content: ':x: The response was timed out, please use the command again!'
                            })
                        })
                    })
                }

                if (interactionCollector.customId === "devinfo") {
                    await interactionCollector.deferUpdate();

                    const devInfoRow = new ActionRowBuilder()
                    devInfoRow.addComponents([
                        new ButtonBuilder()
                        .setEmoji('⏪')
                        .setCustomId('fastbackward')
                        .setStyle(ButtonStyle.Primary)
                    ])
                    devInfoRow.addComponents([
                        new ButtonBuilder()
                        .setEmoji('⬅️')
                        .setCustomId('backward')
                        .setStyle(ButtonStyle.Primary)
                    ])
                    devInfoRow.addComponents([
                        new ButtonBuilder()
                        .setEmoji('➡️')
                        .setCustomId('forward')
                        .setStyle(ButtonStyle.Primary)
                    ])
                    devInfoRow.addComponents([
                        new ButtonBuilder()
                        .setEmoji('⏩')
                        .setCustomId('fastforward')
                        .setStyle(ButtonStyle.Primary)
                    ])
                    devInfoRow.addComponents([
                        new ButtonBuilder()
                        .setEmoji('❌')
                        .setCustomId('exit')
                        .setStyle(ButtonStyle.Primary)
                    ])

                    const devInfoEmbeds = [];
                    let currentPage = 0;
                    const guilds = client.guilds.cache.map(guild => {
                        devInfoEmbeds.push(guild);
                    })

                    const embeds = generateDevEmbed(devInfoEmbeds, currentPage);
                    const filter = m => m.user.id === interaction.user.id;
                    const collector = interactionCollector.message.createMessageComponentCollector({
                        filter,
                        idle: 1000 * 60,
                        time: 1000 * 120
                    });

                    let mainMsg;
                    if (guilds.length > 20) {
                        mainMsg = await interactionCollector.editReply({
                            embeds: [embeds[currentPage].setFooter({
                                text: `Page ${currentPage+1} of ${embeds.length}`
                            })],
                            components: [mainRow],
                            fetchReply: true
                        })
                    } else {
                        mainMsg = await interactionCollector.editReply({
                            embeds: [embeds[currentPage].setFooter({
                                text: `Page ${currentPage+1} of ${embeds.length}`
                            })],
                            components: [],
                            fetchReply: true
                        })
                    }

                    collector.on('collect', async (interactionCollector) => {
                        if (interactionCollector.customId === "forward") {
                            await interactionCollector.deferUpdate();
                            if (currentPage < embeds.length - 1) {
                                currentPage++;
                                interactionCollector.editReply({
                                    embeds: [embeds[currentPage].setFooter({
                                        text: `Page ${currentPage+1} of ${embeds.length}`
                                    })]
                                })
                            } else {
                                --currentPage;
                                interactionCollector.editReply({
                                    embeds: [embeds[currentPage].setFooter({
                                        text: `Page ${currentPage+1} of ${embeds.length}`
                                    })]
                                })
                            }
                        }
            
                        if (interactionCollector.customId === "backward") {
                            await interactionCollector.deferUpdate();
                            if (currentPage !== 0) {
                                --currentPage;
                                interactionCollector.editReply({
                                    embeds: [embeds[currentPage].setFooter({
                                        text: `Page ${currentPage+1} of ${embeds.length}`
                                    })]
                                })
                            } else {
                                currentPage++;
                                interactionCollector.editReply({
                                    embeds: [embeds[currentPage].setFooter({
                                        text: `Page ${currentPage+1} of ${embeds.length}`
                                    })]
                                })
                            }
                        }
            
                        if (interactionCollector.customId === "fastforward") {
                            await interactionCollector.deferUpdate();
                            if (currentPage < embeds.length - 1) {
                                currentPage = embeds.length - 1;
                                interactionCollector.editReply({
                                    embeds: [embeds[currentPage].setFooter({
                                        text: `Page ${currentPage+1} of ${embeds.length}`
                                    })]
                                })
                            }
                        }
            
                        if (interactionCollector.customId === "fastbackward") {
                            await interactionCollector.deferUpdate();
                            currentPage = 0;
                            interactionCollector.editReply({
                                embeds: [embeds[currentPage].setFooter({
                                    text: `Page ${currentPage+1} of ${embeds.length}`
                                })]
                            })
                        }
            
                        if (interactionCollector.customId === "exit") {
                            await interactionCollector.deferUpdate();
                            collector.stop();
                        }
                    })
            
                    collector.on('end', async (collected, reason) => {
                        if (reason === "messageDelete") {
                            return;
                        } else {
                            try {
                                for (let i = 0; i < mainRow.components.length; i++) {
                                    mainRow.components[i].setDisabled(true);
                                }
                
                                await mainMsg.edit({
                                    components: [mainRow]
                                });
                            } catch {}
                        }
                    })

                    function generateDevEmbed(helpEmbedPage, currentPage) {
                        const embeds = []
                        let k = 20;
                        for (let i = 0; i < helpEmbedPage.length; i += 20) {
                            const current = helpEmbedPage.slice(i, k);
                            let j = i;
                            k += 1;
                            const info = current.map(currentEmbed => `- ${currentEmbed}`).join('\n');
                            const embed = new EmbedBuilder()
                                .setDescription(`\`\`\`yaml\n${info}\`\`\``)
                                .setTitle(`🤖 Total Servers 🤖`)
                                .setColor(ee.color)
                            embeds.push(embed)
                        }
                        return embeds;
                    }
                }

                if (interactionCollector.customId === "evaluate") {
                    await interactionCollector.deferUpdate();
                    let filter = m => m.author.id === interaction.user.id;
                    return interactionCollector.editReply({
                        content: ':white_check_mark: Please enter the following arguments to evalute, \`Code\` in the correct order! (Say \`cancel\` to cancel the command)',
                        components: [],
                        embeds: [],
                        fetchReply: true
                    }).then(() => {
                        interactionCollector.channel.awaitMessages({
                            filter,
                            max: 1, //MAX COLLECTIONS
                            time: 1000 * 60, // SECONDS
                        }).then(async (collected) => {
                            const cmdargs = collected.first();

                            await cmdargs.delete();

                            if (cmdargs.content.toString() === 'cancel') {
                                return interactionCollector.editReply({
                                    content: ':white_check_mark: Successfully cancelled command!'
                                })
                            }

                            if (!cmdargs.content) {
                                return interactionCollector.editReply({
                                    content: ':x: You have not inserted the args as requested!',
                                })
                            }

                            try {
                                if (cmdargs.content.includes(`token`)) return;
                    
                                let evaled = await eval(cmdargs.content);
                                let string = inspect(evaled);
                    
                                if (string.includes(client.token)) return;
                    
                                let evalEmbed = new EmbedBuilder().setTitle(`${client.user.username} | EVALUTION`);
                                evalEmbed.setDescription(`***Input:***\n\`\`\`js\n${cmdargs.content}\n\`\`\`\n***Output:***\n\`\`\`js\n${string}\n\`\`\``);
                                await interactionCollector.editReply({
                                    embeds: [evalEmbed.setColor(ee.color).setTimestamp()],
                                    components: [],
                                    content: ' ',
                                });
                            } catch (e) {
                                const evalEmbed2 = new EmbedBuilder();
                                evalEmbed2.setTitle(`Something went wrong`);
                                evalEmbed2.setDescription(`\`\`\`${e.message}\`\`\``);
                                return interactionCollector.editReply({
                                    embeds: [evalEmbed2.setColor(ee.wrongcolor).setTimestamp()],
                                    components: [],
                                    content: ' ',
                                });
                            }
                        }).catch((collected) => {
                            return interactionCollector.editReply({
                                content: ':x: The response was timed out, please use the command again!'
                            })
                        })
                    })
                }

                if (interactionCollector.customId === "shutdown") {
                    await interactionCollector.deferUpdate();

                    let time = 60;
                    const countdown = setInterval(async () => {
                        if (time === 0) {
                            await interactionCollector.editReply({
                                content: 'Restarting!',
                                components: [],
                                embeds: [],
                            });
                            clearInterval(countdown);
                            return process.exit();
                        }

                        if (time % 5 === 0) {
                            interactionCollector.editReply({
                                content: 'Restarting in: ' + time + ' seconds!',
                                components: [],
                                embeds: [],
                            });
                        }
                        time--;
                    }, 1000 * 1);
                }
            });

            collector.on('end', async (collected) => {
                try {
                    if (collected.size === 0) {
                        for (let i = 0; i < adminRow.components.length; i++) {
                            adminRow.components[i].setDisabled(true);
                        }

                        await interaction.editReply({
                            components: [adminRow]
                        });
                    } else {
                        const lastregistered = collected.last();

                        if (lastregistered.customId === 'modMenu') {
                            for (let i = 0; i < modButtons.components.length; i++) {
                                modButtons.components[i].setDisabled(true);
                            }

                            await interaction.editReply({
                                components: [modButtons]
                            });
                        }

                        if (lastregistered.customId === 'adminMenu') {
                            for (let i = 0; i < adminButtons.components.length; i++) {
                                adminButtons.components[i].setDisabled(true);
                            }

                            await interaction.editReply({
                                components: [adminButtons]
                            });
                        }

                        if (lastregistered.customId === 'devMenu') {
                            for (let i = 0; i < devButtons.components.length; i++) {
                                devButtons.components[i].setDisabled(true);
                            }
                            for (let i = 0; i < devButtons2.components.length; i++) {
                                devButtons2.components[i].setDisabled(true);
                            }

                            await interaction.editReply({
                                components: [devButtons, devButtons2]
                            });
                        }
                    }
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