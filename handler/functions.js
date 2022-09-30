const {
    EmbedBuilder,
    WebhookClient,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const FlakeId = require("flakeid");
const flake = new FlakeId({
    mid: 42, //optional, define machine id
    timeOffset: (2022 - 1970) * 31536000 * 1000 //optional, define a offset time
});

//DATABASE SCHEMAS
const spawned = require("../schemas/Spawned");
const pokemon = require("../schemas/Pokemons");
const server = require("../schemas/Servers");
const developer = require('../schemas/developerData');
const userdata = require("../schemas/userData");
const globaldata = require("../schemas/globalData");

//MODULE EXPORTS
module.exports.getSpawnRarity = getSpawnRarity;
module.exports.encounterspawn = encounterspawn;
module.exports.escapeRegex = escapeRegex;
module.exports.forcespawn = forcespawn;
module.exports.maintenancemode = maintenancemode;
module.exports.calculatePercentage = calculatePercentage;
module.exports.hintgame = hintgame;
module.exports.redeemSpawn = redeemSpawn;

module.exports.languageControl = languageControl;
module.exports.stringTemplateParser = stringTemplateParser;

module.exports.generateSnowflake = generateSnowflake;
module.exports.giveActivityXP = giveActivityXP;
module.exports.increaseSpawnChance = increaseSpawnChance;

module.exports.findServer = findServer;
module.exports.findUser = findUser;
module.exports.getDeveloperData = getDeveloperData;
module.exports.getGlobalData = getGlobalData;

module.exports.tosInteraction = tosInteraction;
module.exports.tosFunction = tosFunction;
module.exports.sendWebhook = sendWebhook;

//FUNCTIONS

async function getSpawnRarity() {
    const randomRarity = Math.floor(Math.random() * 50000 + 1);

    //COMMON 1-41950 - 41950/50000 TO GET
    //UNCOMMON 41950-46950 - 5000/50000 TO GET
    //RARE 46950-49450 - 2500/50000 TO GET
    //LEGENDARY 49450-49700 - 250/50000 TO GET
    //MYTHICAL 49700-49850 - 150/50000 TO GET
    //ULTRA BEAST 49850-49950 - 100/50000 TO GET
    //SHINY 49950-50000 - 50/50000 TO GET

    let spawnedrarity = 'Common';

    if (randomRarity < 41950) { //COMMON RARITY RANDOMIZER
        spawnedrarity = 'Common';
    }

    if (randomRarity > 41950 && randomRarity < 46950) { //UNCOMMON RARITY RANDOMIZER
        spawnedrarity = 'Uncommon';
    }

    if (randomRarity > 46950 && randomRarity < 49450) { //RARE RARITY RANDOMIZER
        spawnedrarity = 'Rare';
    }

    if (randomRarity > 49450 && randomRarity < 49700) { //LEGENDARY RARITY RANDOMIZER
        spawnedrarity = 'Legendary';
    }

    if (randomRarity > 49700 && randomRarity < 49850) { //MYTHICAL RARITY RANDOMIZER
        spawnedrarity = 'Mythical';
    }

    if (randomRarity > 49850 && randomRarity < 49950) { //ULTRABEAST RARITY RANDOMIZER
        spawnedrarity = 'Mythical'
        //spawnedrarity = 'Ultrabeast';
    }

    if (randomRarity > 49950 && randomRarity < 50000) { //SHINY RARITY RANDOMIZER
        spawnedrarity = 'Mythical'
        //spawnedrarity = 'Shiny';
    }

    return spawnedrarity;
}

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
        let redirectChannel;

        try {
            redirectChannel = await interaction.guild.channels.fetch(`${findserver.RedirectChannel}`);
        } catch {
            redirectChannel = interaction.channel;
        }

        channelToSend = redirectChannel;
    } else {
        channelToSend = message.channel;
    }

    const levelGeneration = Math.floor(Math.random() * (20 - 1) + 1);

    const generatedUUID = generateSnowflake();

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

    const findserver = await server.findOne({
        ServerID: parseInt(interaction.guild.id)
    });

    let channelToSend;

    if(parseInt(findserver.RedirectChannel) !== 0) {
        let redirectChannel;

        try {
            redirectChannel = await interaction.guild.channels.fetch(`${findserver.RedirectChannel}`);
        } catch {
            redirectChannel = interaction.channel;
        }

        channelToSend = redirectChannel;
    } else {
        channelToSend = interaction.channel;
    }

    const generatedUUID = generateSnowflake();

    const msg = await channelToSend.send({
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
    const channelId = channelToSend.id;
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
    });

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

    const findserver = await server.findOne({
        ServerID: parseInt(interaction.guild.id)
    });

    let channelToSend;

    if(parseInt(findserver.RedirectChannel) !== 0) {
        let redirectChannel;

        try {
            redirectChannel = await interaction.guild.channels.fetch(`${findserver.RedirectChannel}`);
        } catch {
            redirectChannel = interaction.channel;
        }

        channelToSend = redirectChannel;
    } else {
        channelToSend = interaction.channel;
    }

    const levelGeneration = Math.floor(Math.random() * (50 - 15) + 15);

    const generatedUUID = generateSnowflake();

    const msg = await channelToSend.send({
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
    const channelId = channelToSend.id;
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

async function languageControl(guild, translateLine) {

    const guildLangs = await server.findOne({
        ServerID: guild.id
    })

    const guildLanguageRows = guildLangs.ServerLang;
    let guildLanguage = 'en';
    if (guildLanguageRows !== undefined) {
       guildLanguage = guildLanguageRows;
    }

    const dataFile = require(`../language/${guildLanguage}.json`)
    let translatedLine = dataFile[`${translateLine}`];

    if (translatedLine === undefined) {
        translatedLine = 'Invalid translation name'
    }

    return translatedLine;
}

function stringTemplateParser(expression, valueObj) {
    const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
    let text = expression.replace(templateMatcher, (substring, value, index) => {
      value = valueObj[value];
      return value;
    });
    return text;
}

function generateSnowflake() {
    return flake.gen();
}

async function giveActivityXP(message, xpCooldowns) {
    if (!xpCooldowns.has(message.author.id)) {
        const findselected = await userdata.findOne({
            OwnerID: parseInt(message.author.id),
            "Inventory.PokemonSelected": true
        }, {
            "Inventory.$": 1
        });

        let newLevelXP;
        if (findselected.Inventory[0].PokemonData.PokemonLevel === 1) {
            newLevelXP = 500;
        } else {
            newLevelXP = findselected.Inventory[0].PokemonData.PokemonLevel * 750;
        }

        if (findselected.Inventory[0].PokemonData.PokemonXP >= newLevelXP && findselected.Inventory[0].PokemonData.PokemonLevel < 100) {

            //EVOLVE FUNCTION HERE (FUNC INSTEAD OF RAW CODE)
            const currentPoke = findselected.Inventory[0].PokemonName;

            const findEvStages = await pokemon.findOne({
                PokemonName: currentPoke
            });
            
            if (findEvStages.PokemonEvolve.currentStage < findEvStages.PokemonEvolve.totalStages) {
                const currentStage = findEvStages.PokemonEvolve.currentStage;
                const currentLevel = findselected.Inventory[0].PokemonData.PokemonLevel;
                const nextStage = parseInt(currentStage) + 1;
                
                let nextPoke;
                let requiredLevel;
                if (nextStage === 2) {
                    nextPoke = findEvStages.PokemonEvolve.stageTwo.newName;
                    requiredLevel = findEvStages.PokemonEvolve.stageTwo.newLevel;
                }
                if (nextStage === 3) {
                    nextPoke = findEvStages.PokemonEvolve.stageThree.newName;
                    requiredLevel = findEvStages.PokemonEvolve.stageThree.newLevel;
                }

                if (parseInt(currentLevel) + 1 >= requiredLevel) {

                    const nextStageData = await pokemon.findOne({
                        PokemonName: nextPoke
                    });
                    
                    await userdata.findOneAndUpdate({
                        OwnerID: parseInt(message.author.id),
                        "Inventory.PokemonSelected": true
                    }, {
                        "Inventory.$.PokemonName": nextStageData.PokemonName,
                        "Inventory.$.PokemonPicture": nextStageData.PokemonPicture
                    });

                    await userdata.findOneAndUpdate({
                        OwnerID: parseInt(message.author.id),
                        "Inventory.PokemonSelected": true
                    }, {
                        "Inventory.$.PokemonData.PokemonXP": 0,
                        $inc: {
                            "Inventory.$.PokemonData.PokemonLevel": 1
                        },
                    });

                    if (message.channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.SendMessages) && message.channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.ViewChannel)) {
                        return message.channel.send(`${message.author} Congratulations, your ${findselected.Inventory[0].PokemonName} mysteriously evolved into a ${nextStageData.PokemonName} upon reaching level \`[${findselected.Inventory[0].PokemonData.PokemonLevel + 1}]\`!`)
                    } else {
                        return;
                    }
                }
            }
            //EVOLVE

            await userdata.findOneAndUpdate({
                OwnerID: parseInt(message.author.id),
                "Inventory.PokemonSelected": true
            }, {
                "Inventory.$.PokemonData.PokemonXP": 0,
                $inc: {
                    "Inventory.$.PokemonData.PokemonLevel": 1
                },
            })

            if (message.channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.SendMessages) && message.channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.ViewChannel)) {
                return message.channel.send(`${message.author} Congratulations, your ${findselected.Inventory[0].PokemonName} has just leveled up to level \`[${findselected.Inventory[0].PokemonData.PokemonLevel + 1}]\`!`)
            } else {
                return;
            }
        }

        let randomXP = 0;
        if (findselected.Inventory[0].PokemonData.PokemonLevel < 100) {
            randomXP = Math.floor(Math.random() * (30 - 10) + 10);
        }

        await userdata.findOneAndUpdate({
            OwnerID: parseInt(message.author.id),
            "Inventory.PokemonSelected": true
        }, {
            $inc: {
                'Inventory.$.PokemonData.PokemonXP': randomXP
            }
        })

        xpCooldowns.set(message.author.id, "User set on 5 second cooldown!");
        setTimeout(() => {
            xpCooldowns.delete(message.author.id);
        }, 1000 * 5);
    }
}

async function increaseSpawnChance(findserver, finduser, awardCooldowns, message) {
    if (findserver.Blacklisted) {
        return;
    }

    if (!finduser && !awardCooldowns.has(message.guild.id)) {
        await findserver.updateOne({
            $inc: {
                SpawningTime: 1
            }
        });
        awardCooldowns.set(message.guild.id, "Server set on 5 second cooldown!");
        setTimeout(() => {
            awardCooldowns.delete(message.guild.id);
        }, 1000 * 3.6);
    } else if (!awardCooldowns.has(message.guild.id) && finduser.TrainerRank > 0) {
        await findserver.updateOne({
            $inc: {
                SpawningTime: 2
            }
        });
        awardCooldowns.set(message.guild.id, "Server set on 5 second cooldown!");
        setTimeout(() => {
            awardCooldowns.delete(message.guild.id);
        }, 1000 * 3.6);
    } else if (!awardCooldowns.has(message.guild.id) && finduser.TrainerRank === 0) {
        await findserver.updateOne({
            $inc: {
                SpawningTime: 1
            }
        });
        awardCooldowns.set(message.guild.id, "Server set on 5 second cooldown!");
        setTimeout(() => {
            awardCooldowns.delete(message.guild.id);
        }, 1000 * 3.6);
    }
}

async function findServer(serverId) {
    const found = await server.findOne({
        ServerID: parseInt(serverId),
    });

    return found;
}

async function findUser(userId) {
    const found = await userdata.findOne({
        OwnerID: userId,
    });

    return found;
}

async function getDeveloperData() {
    const found = await developer.findOne({
        developerAccess: "accessStringforDeveloperOnly",
    });

    return found;
}

async function getGlobalData() {
    const found = await globaldata.findOne({
        accessString: "accessingGlobalDataFromString",
    });

    return found;
}

async function tosInteraction(interaction, finduser) {
    if (interaction.customId === "agree") {
        await interaction.deferUpdate();

        const agreementRow = new ActionRowBuilder()
        agreementRow.addComponents([
            new ButtonBuilder()
            .setEmoji('✅')
            .setCustomId('agree')
            .setStyle(ButtonStyle.Primary)
        ])
        agreementRow.addComponents([
            new ButtonBuilder()
            .setEmoji('❎')
            .setCustomId('disagree')
            .setStyle(ButtonStyle.Primary)
        ])

        for (let i = 0; i < agreementRow.components.length; i++) {
            agreementRow.components[i].setDisabled(true);
        }

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setColor(851712)
                .setTitle(`Successfully agreed to ToS`)
                .setDescription(`Thank you for agreeing to our newly update Terms of Service, you may now continue using the bot features.`)
            ],
            components: [agreementRow]
        })

        await finduser.updateOne({
            LatestAgreed: Date.now()
        });
        return;
    } else if (interaction.customId === "disagree") {
        await interaction.deferUpdate();

        const agreementRow = new ActionRowBuilder()
        agreementRow.addComponents([
            new ButtonBuilder()
            .setEmoji('✅')
            .setCustomId('agree')
            .setStyle(ButtonStyle.Primary)
        ])
        agreementRow.addComponents([
            new ButtonBuilder()
            .setEmoji('❎')
            .setCustomId('disagree')
            .setStyle(ButtonStyle.Primary)
        ])

        for (let i = 0; i < agreementRow.components.length; i++) {
            agreementRow.components[i].setDisabled(true);
        }

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setColor(ee.wrongcolor)
                .setTitle(`Successfully disagreed to our ToS`)
                .setDescription(`You have now declined agreement to our ToS, please note that no further bot access can be given unless you agree to the new Terms of Service.`)
            ],
            components: [agreementRow]
        });
        return;
    } else {
        return;
    }
}

async function tosFunction(interaction) {
    const agreementRow = new ActionRowBuilder()
    agreementRow.addComponents([
        new ButtonBuilder()
        .setEmoji('✅')
        .setCustomId('agree')
        .setStyle(ButtonStyle.Primary)
    ])
    agreementRow.addComponents([
        new ButtonBuilder()
        .setEmoji('❎')
        .setCustomId('disagree')
        .setStyle(ButtonStyle.Primary)
    ])

    return interaction.reply({
        embeds: [
            new EmbedBuilder()
            .setColor(ee.color)
            .setTitle(`Updated Terms of Service agreement!`)
            .setDescription(`**Whoops, wait one second there ${interaction.user}!**\n\nLooks like you have yet to read our new upgraded [Terms of Service](https://pontus-2003.gitbook.io/discmon-docs/) and agree to it.\nPlease read through our new ToS then agree with the buttons below, or decline.\n\n> We update our ToS agreements regulary, which is why you are seeing this again.`)
        ],
        components: [agreementRow]
    });
}

async function sendWebhook(webhookLink, webhookTitle, webhookDesc, webhookColor) {
    const webhook = new WebhookClient({
        url: webhookLink
    });

    await webhook.send({
        embeds: [
            new EmbedBuilder()
            .setColor(webhookColor)
            .setTitle(webhookTitle)
            .setDescription(webhookDesc)
            .setTimestamp()
        ]
    });
}