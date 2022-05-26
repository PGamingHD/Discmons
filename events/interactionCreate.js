const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Discord,
    ModalBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    WebhookClient,
    PermissionFlagsBits
} = require("discord.js");
const client = require("../index");
const ee = require("../botconfig/embed.json");
const emoji = require("../botconfig/emojis.json");
const config = require("../botconfig/config.json");
const adminLogs = new WebhookClient({
    url: config.adminLogs
});
const {
    startupCooldown
} = require("../index");

//SCHEMA DATA
const userData = require("../schemas/userData");
const pokemon = require("../schemas/Pokemons");
const developer = require("../schemas/developerMaintenance");
const server = require("../schemas/Servers");
const {
    maintenancemode,
    forcespawn
} = require("../handler/functions");

client.on("interactionCreate", async (interaction) => {

    if (startupCooldown.has("startupcooldown") && !config.developerID.includes(interaction.user.id)) {
        return interaction.reply({
            content: ':x: The bot is still starting up, please be patient and wait for the cooldown to end!',
            ephemeral: true
        })
    }

    const dev = await developer.findOne({
        developerAccess: "accessStringforDeveloperOnly",
    })

    if (dev.globalMaintenance && !config.developerID.includes(interaction.user.id)) {
        return interaction.reply({
            content: ':x: Maintenance Mode is enabled, please wait until the maintenance is over!',
            ephemeral: true
        })
    }

    const findserver = await server.findOne({
        ServerID: parseInt(interaction.guild.id),
    })

    if (!findserver) {
        await server.create({
            ServerID: parseInt(message.guild.id),
            Blacklisted: false,
            SpawningTime: 0,
            RedirectChannel: 0
        })
    } else {
        if (findserver.Blacklisted) {
            return interaction.reply({
                content: ':x: This server has been blacklisted from the usage of this bots functions, please open a ticket on the Support Server to get this fixed.',
                ephemeral: true
            })
        }
    }

    const finduser = await userData.findOne({
        OwnerID: parseInt(interaction.user.id),
    })

    if (finduser) {
        if (finduser.Blacklisted) {
            return interaction.reply({
                content: ':x: You have been blacklisted from the usage of this bots functions, please open a ticket on the Support Server to get this fixed.',
                ephemeral: true
            })
        }
    }

    // Slash Command Handling
    if (interaction.isChatInputCommand()) {

        try {
            if (!interaction.channel.permissionsFor(interaction.guild.me).has(PermissionFlagsBits.SendMessages) || !interaction.channel.permissionsFor(interaction.guild.me).has(PermissionFlagsBits.EmbedLinks) || !interaction.channel.permissionsFor(interaction.guild.me).has(PermissionFlagsBits.UseExternalEmojis) || !interaction.channel.permissionsFor(interaction.guild.me).has(PermissionFlagsBits.ReadMessageHistory)) {
                await interaction.user.send({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.wrongcolor)
                        .setTitle(`:x: Missing Permissions :x:`)
                        .setDescription(`Looks like I do not have **permission** to send messages in that channel, please **fix it** before trying to use commands there again. Try contacting the **server owner**!\n\nPermissions I require in channels: \`Send Messages\`, \`Embed Links\`, \`Use External Emoji\`, \`Read Message History\`!`)
                    ],
                    ephemeral: true,
                })
            }
        } catch (error) {
            if(!interaction.channel.permissionsFor(interaction.guild.me).has(PermissionFlagsBits.SendMessages)){
                return;
            } else {
                if (error.rawError.message === "Cannot send messages to this user") {
                    return interaction.reply({
                        embeds: [],
                        components: [],
                        content: ':x: Failed to send message, please open your DMs before using this command again.'
                    })
                } else {
                    return interaction.reply({
                        embeds: [],
                        components: [],
                        content: ':x: I ran into an error when sending a message to you, please reuse the command.'
                    })
                }
            }
        }

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) {
            let embed = new EmbedBuilder()
                .setColor(ee.color)
                .setDescription(`:x: An error has occured, please contact the developer if this is a mistake.`)
            return interaction.reply({
                embeds: [embed],
                epehemeral: true
            });
        }

        const founduser = await userData.findOne({
            OwnerID: parseInt(interaction.user.id),
        })

        if (!cmd.startCmd && !founduser) {
            return interaction.reply({
                content: ':x: Looks like you have yet to register to this bot, please register before using the commands. Register using the command \`/start\` and pick a starter Pokémon!',
                ephemeral: true
            })
        }

        if (cmd.DeveloperCommand && !interaction.user.id.includes(config.developerID)) {
            return interaction.reply({
                content: ':x: Looks like you do not have permissions to execute this command.',
                ephemeral: true
            })
        }

        if (cmd.serverOwner && interaction.member.id !== interaction.guild.ownerId) {
            return interaction.reply({
                content: ':x: Looks like you do not have permissions to execute this command.',
                ephemeral: true
            })
        }

        if(cmd.serverAdmin && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)){
            return interaction.reply({
                content: ':x: Looks like you do not have permissions to execute this command.',
                ephemeral: true
            })
        }

        //INTERACTION BELOW
        const args = [];
        const con = client.connection;

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        if (!interaction.member.permissions.has(cmd.userPermissions || []))
            return interaction.reply({
                content: "You do not have permissions to use this command!",
            });

        await cmd.run(client, interaction, con, args);
        //INTERACTION ABOVE
    }

    // Context Menu Handling
    /*
    if (interaction.isContextMenuCommand()) {
        await interaction.deferReply({
            ephemeral: false
        });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }
    */

    if (interaction.isButton()) {
        const {
            member,
            channel,
            message,
            user,
            guild
        } = interaction;

        if (interaction?.customId === "modMenu") {
            adminLogs.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`**Moderator Login Detected**`)
                    .setDescription(`**Logged in user: \`${user.tag}\` (\`${user.id}\`)**`)
                    .setTimestamp()
                ]
            })

            const adminRow = new ActionRowBuilder()
            adminRow.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "❌"
                })
                .setLabel('Blacklist User')
                .setCustomId('blacklist')
                .setStyle(ButtonStyle.Primary)
            ])
            adminRow.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "❌"
                })
                .setLabel('Blacklist Server')
                .setCustomId('blacklists')
                .setStyle(ButtonStyle.Primary)
            ])

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`**Moderator Menu - Welcome back ${user.username}!**`)
                ],
                ephemeral: true,
                components: [adminRow]
            })
        }

        if (interaction?.customId === "adminMenu") {
            adminLogs.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`**Admin Login Detected**`)
                    .setDescription(`**Logged in user: \`${user.tag}\` (\`${user.id}\`)**`)
                    .setTimestamp()
                ]
            })

            const adminRow = new ActionRowBuilder()
            adminRow.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "🏢"
                })
                .setLabel('Spawn Pokemon')
                .setCustomId('spawnpokemon')
                .setStyle(ButtonStyle.Primary)
            ])

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`**Admin Menu - Welcome back ${user.username}!**`)
                ],
                ephemeral: true,
                components: [adminRow]
            })
        }

        if (interaction?.customId === "devMenu") {
            adminLogs.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`**Developer Login Detected**`)
                    .setDescription(`**Logged in user: \`${user.tag}\` (\`${user.id}\`)**`)
                    .setTimestamp()
                ]
            })

            const adminRow = new ActionRowBuilder()
            adminRow.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "✅"
                })
                .setLabel('Insert Pokemon')
                .setCustomId('insertpokemon')
                .setStyle(ButtonStyle.Primary)
            ])
            adminRow.addComponents([
                new ButtonBuilder()
                .setEmoji({
                    name: "⚙️"
                })
                .setLabel('Maintenance Mode')
                .setCustomId('maintenance')
                .setStyle(ButtonStyle.Primary)
            ])


            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`**Developer Menu - Welcome back ${user.username}!**`)
                ],
                ephemeral: true,
                components: [adminRow]
            })
        }

        if (interaction?.customId === "blacklist") {

            let filter = m => m.author.id === interaction.user.id;

            return interaction.reply({
                content: ':white_check_mark: Please enter the ID of the User you wish to blacklist from using the bot services! (Say \`cancel\` to cancel this command)',
                ephemeral: true,
                fetchReply: true
            }).then(() => {
                interaction.channel.awaitMessages({
                    filter,
                    max: 1, //MAX COLLECTIONS
                    time: 1000 * 60, // SECONDS
                }).then(async (collected) => {
                    const blacklistuserid = collected.first();

                    if (blacklistuserid.content.toString() === 'cancel') {
                        return interaction.followUp({
                            content: ':white_check_mark: Successfully cancelled command!',
                            ephemeral: true
                        })
                    }

                    if (blacklistuserid.content.length < 18) {
                        return interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(ee.wrongcolor)
                                .setDescription(`:x: That user ID is not valid, must be 18 characters in length.`)
                            ],
                            ephemeral: true
                        })
                    }

                    const userfound = await userData.findOne({
                        OwnerID: parseInt(blacklistuserid.content),
                    })

                    if (!userfound) {
                        return interaction.followUp({
                            content: ':x: The user with the specified ID could not be found, please try again!',
                            ephemeral: true
                        })
                    }

                    if (userfound.Blacklisted) {
                        await userfound.updateOne({
                            Blacklisted: false
                        })

                        interaction.followUp({
                            content: `:white_check_mark: Successfully removed blacklist for the user with ID \`[${blacklistuserid.content}]\` as requested!`,
                            ephemeral: true
                        })
                    } else {
                        await userfound.updateOne({
                            Blacklisted: true
                        })

                        interaction.followUp({
                            content: `:white_check_mark: Successfully blacklisted the user with ID \`[${blacklistuserid.content}]\` as requested!`,
                            ephemeral: true
                        })
                    }

                    await blacklistuserid.delete();
                    return;
                }).catch((collected) => {
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.wrongcolor)
                            .setDescription(`:x: The response was timed out, please use the command again!`)
                        ],
                        ephemeral: true
                    })
                })
            })
        }

        if (interaction?.customId === "blacklists") {

            let filter = m => m.author.id === interaction.user.id;

            return interaction.reply({
                content: ':white_check_mark: Please enter the ID of the Server you wish to blacklist from using the bot services! (Say \`cancel\` to cancel this command)',
                ephemeral: true,
                fetchReply: true
            }).then(() => {
                interaction.channel.awaitMessages({
                    filter,
                    max: 1, //MAX COLLECTIONS
                    time: 1000 * 60, // SECONDS
                }).then(async (collected) => {
                    const blacklistserverid = collected.first();

                    if (blacklistserverid.content.toString() === 'cancel') {
                        return interaction.followUp({
                            content: ':white_check_mark: Successfully cancelled command!',
                            ephemeral: true
                        })
                    }

                    if (blacklistserverid.content.length < 18) {
                        return interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(ee.wrongcolor)
                                .setDescription(`:x: That server ID is not valid, must be 18 characters in length.`)
                            ],
                            ephemeral: true
                        })
                    }

                    const serverfound = await server.findOne({
                        ServerID: parseInt(blacklistserverid.content),
                    })

                    if (!serverfound) {
                        return interaction.followUp({
                            content: ':x: The server with the specified ID could not be found, please try again!',
                            ephemeral: true
                        })
                    }

                    if (serverfound.Blacklisted) {
                        await serverfound.updateOne({
                            Blacklisted: false
                        })

                        interaction.followUp({
                            content: `:white_check_mark: Successfully removed blacklist from the server with ID \`[${blacklistserverid.content}]\` as requested!`,
                            ephemeral: true
                        })
                    } else {
                        await serverfound.updateOne({
                            Blacklisted: true
                        })

                        interaction.followUp({
                            content: `:white_check_mark: Successfully blacklisted the server with ID \`[${blacklistserverid.content}]\` as requested!`,
                            ephemeral: true
                        })
                    }

                    await blacklistserverid.delete();

                }).catch((collected) => {
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.wrongcolor)
                            .setDescription(`:x: The response was timed out, please use the command again!`)
                        ],
                        ephemeral: true
                    })
                })
            })
        }

        if (interaction?.customId === "insertpokemon") {

            let filter = m => m.author.id === interaction.user.id;

            return interaction.reply({
                content: ':white_check_mark: Please enter the following arguments to insert a Pokémon, \`PokemonID\`, \`PokemonName\`, \`PokemonPicture\` & \`PokemonRarity\` in the correct order! (Say \`cancel\` to cancel the command)',
                ephemeral: true,
                fetchReply: true
            }).then(() => {
                interaction.channel.awaitMessages({
                    filter,
                    max: 1, //MAX COLLECTIONS
                    time: 1000 * 60, // SECONDS
                }).then(async (collected) => {
                    const pokemonargs = collected.first();

                    const args = pokemonargs.content.split(/ +/).filter(Boolean);

                    if (pokemonargs.toString() === 'cancel') {
                        return interaction.followUp({
                            content: ':white_check_mark: Successfully cancelled command!',
                            ephemeral: true
                        })
                    }

                    if (!args[0] || !args[1] || !args[2] || !args[3]) {
                        return interaction.followUp({
                            content: ':x: You have not inserted all 4 args as requested!',
                            ephemeral: true
                        })
                    }

                    const rarities = [
                        "Common",
                        "Uncommon",
                        "Rare",
                        "Legendary",
                        "Mythical",
                        "Ultra Beast",
                        "Shiny"
                    ]

                    if (!rarities.includes(args[3])) {
                        return interaction.followUp({
                            content: ':x: The supplied rarity does not include Common,Uncommon,Rare,Legendary,Mythical,Ultra Beast or Shiny. Please fix this asap!',
                            ephemeral: true
                        })
                    }

                    await pokemon.create({
                        PokemonID: args[0],
                        PokemonName: args[1],
                        PokemonPicture: args[2],
                        PokemonRarity: args[3]
                    })

                    pokemonargs.delete();

                    return interaction.followUp({
                        content: `:white_check_mark: Successfully inserted pokémon into the database!`,
                        ephemeral: true
                    })
                }).catch((collected) => {
                    return interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.wrongcolor)
                            .setDescription(`:x: The response was timed out, please use the command again!`)
                        ],
                        ephemeral: true
                    })
                })
            })
        }

        if (interaction?.customId === "maintenance") {
            let filter = m => m.author.id === interaction.user.id;

            return interaction.reply({
                content: ':white_check_mark: Please enter the following arguments to enter maintenance mode, \`Cooldown (s)\` & \`Length (m)\` in the correct order! (Say \`cancel\` to cancel the command)',
                ephemeral: true,
                fetchReply: true
            }).then(() => {
                interaction.channel.awaitMessages({
                    filter,
                    max: 1, //MAX COLLECTIONS
                    time: 1000 * 60, // SECONDS
                }).then(async (collected) => {
                    const maintenanceargs = collected.first();

                    const args = maintenanceargs.content.split(/ +/).filter(Boolean);

                    if (maintenanceargs.toString() === 'cancel') {
                        return interaction.followUp({
                            content: ':white_check_mark: Successfully cancelled command!',
                            ephemeral: true
                        })
                    }

                    if (!args[0] || !args[1]) {
                        return interaction.followUp({
                            content: ':x: You have not inserted both args as requested!',
                            ephemeral: true
                        })
                    }

                    maintenancemode(client, interaction, args[0], args[1]);

                    maintenanceargs.delete();
                }).catch((collected) => {
                    return interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.wrongcolor)
                            .setDescription(`:x: The response was timed out, please use the command again!`)
                        ],
                        ephemeral: true
                    })
                })
            })
        }

        if (interaction?.customId === "spawnpokemon") {
            let filter = m => m.author.id === interaction.user.id;

            return interaction.reply({
                content: ':white_check_mark: Please enter the following arguments to spawn a pokemon, \`PokemonName\` & \`PokemonLevel\` in the correct order! (Say \`cancel\` to cancel the command)',
                ephemeral: true,
                fetchReply: true
            }).then(() => {
                interaction.channel.awaitMessages({
                    filter,
                    max: 1, //MAX COLLECTIONS
                    time: 1000 * 60, // SECONDS
                }).then(async (collected) => {
                    const pokemonargs = collected.first();

                    const args = pokemonargs.content.split(/ +/).filter(Boolean);

                    if (pokemonargs.toString() === 'cancel') {
                        return interaction.followUp({
                            content: ':white_check_mark: Successfully cancelled command!',
                            ephemeral: true
                        })
                    }

                    if (!args[0] || !args[1]) {
                        return interaction.followUp({
                            content: ':x: You have not inserted both args as requested!',
                            ephemeral: true
                        })
                    }

                    let makeCapital = s => s.replace(/./, c => c.toUpperCase())
                    const pokemonName = makeCapital(args[0]);

                    forcespawn(interaction, pokemonName, args[1])

                    pokemonargs.delete();
                }).catch((collected) => {
                    return interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.wrongcolor)
                            .setDescription(`:x: The response was timed out, please use the command again!`)
                        ],
                        ephemeral: true
                    })
                })
            })
        }
    }
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/