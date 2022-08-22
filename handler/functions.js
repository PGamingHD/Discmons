const {
    MessageEmbed,
    Collection,
    EmbedBuilder,
    WebhookClient
} = require("discord.js");
const Discord = require("discord.js")
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const {
    v4: uuidv4
} = require("uuid");
const adminLogs = new WebhookClient({
    url: config.adminLogs
});

//DATABASE SCHEMAS
const spawned = require("../schemas/Spawned");
const pokemon = require("../schemas/Pokemons");
const server = require("../schemas/Servers");
const developer = require('../schemas/developerData');

//MODULE EXPORTS
module.exports.encounterspawn = encounterspawn;
module.exports.escapeRegex = escapeRegex;
module.exports.forcespawn = forcespawn;
module.exports.maintenancemode = maintenancemode;
module.exports.calculatePercentage = calculatePercentage;
module.exports.hintgame = hintgame;
module.exports.redeemSpawn = redeemSpawn;

//FUNCTIONS

async function encounterspawn(message, rarity) {

    const countedPokemon = await pokemon.findOne({
        PokemonRarity: rarity
    }).count();

    const pokemonAmount = Math.floor(Math.random() * countedPokemon);

    const pokemontospawn = await pokemon.findOne({
        PokemonRarity: rarity
    }).skip(pokemonAmount)

    const findserver = await server.findOne({
        ServerID: parseInt(message.guild.id)
    });

    let channelToSend;

    if(parseInt(findserver.RedirectChannel) !== 0){
        const redirectChannel = await message.guild.channels.fetch(`${findserver.RedirectChannel}`);

        channelToSend = redirectChannel;
    } else {
        channelToSend = message.channel;
    }

    const levelGeneration = Math.floor(Math.random() * (20 - 1) + 1);

    const generatedUUID = uuidv4();

    const msg = await channelToSend.send({
        embeds: [
            new EmbedBuilder()
            .setColor(ee.color)
            .setDescription(`A wild pokémon has spawned, catch the spawned\n pokémon with \`/catch (name)\` before it flees!`)
            .setImage(pokemontospawn.PokemonPicture)
            .setFooter({
                text: generatedUUID
            })
        ]
    });

    const guildId = message.guild.id;
    const channelId = channelToSend.id;
    const messageId = msg.id;

    const hasSameNameSpawnedAlr = await spawned.findOne({
        PokemonName: pokemontospawn.PokemonName
    });

    if (hasSameNameSpawnedAlr) {
        await spawned.deleteOne({
            PokemonName: pokemontospawn.PokemonName,
            SpawnedChannelID: channelId
        })
    }

    await spawned.create({
        SpawnedServerID: parseInt(guildId),
        SpawnedChannelID: channelId,
        SpawnedMessageID: messageId,
        PokemonID: generatedUUID,
        PokemonName: pokemontospawn.PokemonName,
        PokemonPicture: pokemontospawn.PokemonPicture,
        PokemonLevel: levelGeneration
    })

    await server.findOneAndUpdate({
        ServerID: parseInt(message.guild.id),
    }, {
        SpawningTime: 0
    })

    setTimeout(async () => {
        const timetodel = await spawned.findOne({
            PokemonID: generatedUUID,
        })

        if (timetodel) {
            await spawned.deleteOne({
                PokemonID: generatedUUID
            })

            if (msg) {
                await msg.delete();
            }

            await message.channel.send({
                content: `:x: The \`${pokemontospawn.PokemonName}\` wasn't caught in time and therefore fled, better luck next time!`
            });
        } else {
            return;
        }
    }, 1000 * 120);
}

async function forcespawn(interaction, pokemonname, pokemonlevel) {

    const forcedpokemon = await pokemon.findOne({
        PokemonName: pokemonname
    })

    if (!forcedpokemon) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.wrongcolor)
                .setDescription(`:x: The specific pokemon could not be found, please specific a valid pokemon to spawn!`)
            ],
            ephemeral: true
        })
    }

    const generatedUUID = uuidv4();

    const msg = await interaction.channel.send({
        embeds: [
            new EmbedBuilder()
            .setColor(ee.color)
            .setDescription(`A wild pokémon has spawned, catch the spawned\n pokémon with \`/catch (name)\` before it flees!`)
            .setImage(forcedpokemon.PokemonPicture)
            .setFooter({
                text: generatedUUID
            })
        ]
    })

    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;
    const messageId = msg.id;

    await spawned.create({
        SpawnedServerID: parseInt(guildId),
        SpawnedChannelID: channelId,
        SpawnedMessageID: messageId,
        PokemonID: generatedUUID,
        PokemonName: forcedpokemon.PokemonName,
        PokemonPicture: forcedpokemon.PokemonPicture,
        PokemonLevel: pokemonlevel
    })

    setTimeout(async () => {
        const timetodel = await spawned.findOne({
            PokemonID: generatedUUID,
        })

        if (timetodel) {
            await spawned.deleteOne({
                PokemonID: generatedUUID
            })
            msg.delete();
            interaction.channel.send({
                content: `:x: The \`${forcedpokemon.PokemonName}\` wasn't caught in time and therefore fled, better luck next time!`
            });
        } else {
            return;
        }
    }, 1000 * 120);
}

async function redeemSpawn(interaction, pokemonname) {

    const forcedpokemon = await pokemon.findOne({
        PokemonName: pokemonname
    })

    if (!forcedpokemon) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.wrongcolor)
                .setDescription(`:x: The specific pokemon could not be found, please specific a valid pokemon to spawn!`)
            ],
            ephemeral: true
        })
    }

    const levelGeneration = Math.floor(Math.random() * (50 - 15) + 15);

    const generatedUUID = uuidv4();

    const msg = await interaction.channel.send({
        embeds: [
            new EmbedBuilder()
            .setColor(ee.color)
            .setDescription(`A wild pokémon has spawned, catch the spawned\n pokémon with \`/catch (name)\` before it flees!`)
            .setImage(forcedpokemon.PokemonPicture)
            .setFooter({
                text: generatedUUID
            })
        ]
    })

    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;
    const messageId = msg.id;

    await spawned.create({
        SpawnedServerID: parseInt(guildId),
        SpawnedChannelID: channelId,
        SpawnedMessageID: messageId,
        PokemonID: generatedUUID,
        PokemonName: forcedpokemon.PokemonName,
        PokemonPicture: forcedpokemon.PokemonPicture,
        PokemonLevel: levelGeneration
    })

    setTimeout(async () => {
        const timetodel = await spawned.findOne({
            PokemonID: generatedUUID,
        })

        if (timetodel) {
            await spawned.deleteOne({
                PokemonID: generatedUUID
            })
            msg.delete();
            interaction.channel.send({
                content: `:x: The \`${forcedpokemon.PokemonName}\` wasn't caught in time and therefore fled, better luck next time!`
            });
        } else {
            return;
        }
    }, 1000 * 120);
}

async function maintenancemode(client, interaction, cooldown, length) {
    const devmode = await developer.findOne({
        developerAccess: 'accessStringforDeveloperOnly'
    });

    const mainChannel = client.channels.cache.get(config.maintenanceChannel);


    if (devmode.globalMaintenance) {

        mainChannel.send({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.maintenancecolor)
                .setTitle(`:yellow_circle: **Maintenance Warning** :yellow_circle:`)
                .setDescription(`**The maintenance mode will be turned off in approximately \`[${cooldown}]\` Second(s) again, prepare yourselves!**`)
                .setFooter({
                    text: `Maintenance issued by: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
            ]
        })
        interaction.followUp({
            content: `:arrows_clockwise: Maintenance Mode will be turned off in \`[${cooldown}]\` Second(s)!`,
            ephemeral: true
        })

        setTimeout(async () => {

            mainChannel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:green_circle: **Maintenance Warning** :green_circle:`)
                    .setDescription(`**The maintenance mode have now ended, and all services should be back up running!**`)
                    .setFooter({
                        text: `Maintenance issued by: ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                ]
            })

            await devmode.updateOne({
                globalMaintenance: false
            })
        }, 1000 * cooldown);

    } else {

        mainChannel.send({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.maintenancecolor)
                .setTitle(`:yellow_circle: **Maintenance Warning** :yellow_circle:`)
                .setDescription(`**The maintenance mode will be turned on in approximately \`[${cooldown}]\` Second(s) to do some maintenance work on the Bot, please finish everything asap!**`)
                .setFooter({
                    text: `Maintenance issued by: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
            ]
        })
        interaction.followUp({
            content: `:arrows_clockwise: Maintenance Mode will be turned on in \`${cooldown}\` Second(s)!`,
            ephemeral: true
        })

        setTimeout(async () => {

            mainChannel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.wrongcolor)
                    .setTitle(`:red_circle: **Maintenance Warning** :red_circle:`)
                    .setDescription(`**The maintenance mode have now begun and will continue for the next \`[${length}]\` Minute(s)!**`)
                    .setFooter({
                        text: `Maintenance issued by: ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                ]
            })
            await devmode.updateOne({
                globalMaintenance: true
            });
        }, 1000 * cooldown);
    }
}

function escapeRegex(str) {
    try {
        return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
}

function calculatePercentage(smallNumber, bigNumber) {
    return (smallNumber / bigNumber) * 100;
}

function hintgame(word) {
    var a = word;
    var splitted = a.split('');
    var count = 0; // variable where i keep trace of how many _ i have inserted

    while (count < a.length / 2) {
        var index = Math.floor(Math.random() * a.length); //generate new index
        if (splitted[index] !== '_' && splitted[index] !== ' ') {
            splitted[index] = '_';
            count++;
        }
    }

    return splitted.join("");
}