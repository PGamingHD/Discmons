const {
    Message,
    MessageEmbed,
    WebhookClient,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");
const emoji = require("../botconfig/emojis.json")
const ee = require("../botconfig/embed.json");
const config = require("../botconfig/config.json");
const client = require("../index");
const schema = require('../schemas/Servers');

client.on("guildCreate", async (guild, Client) => {

    const hasdata = await schema.findOne({
        ServerID: parseInt(guild.id),
    });

    if (!hasdata) {
        const creation = await schema.create({
            ServerID: parseInt(guild.id),
            Blacklisted: false,
            SpawningTime: 0,
            RedirectChannel: 0,
            ServerLang: 'en'
        })
    }

    try {

        const ch = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages) && channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.EmbedLinks));

        if (!ch) return;

        if (!guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) {
            try {
                const owner = await client.users.fetch(`${guild.ownerId}`);

                await owner.send({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.wrongcolor)
                        .setTitle(`:x: Not invited with Administrator :x:`)
                        .setDescription(`Hello there **Server Owner**, looks like you chose to invite me without **Administrator** permissions.. Please make sure to grant me atleast these following permissions: \`Send Messages\`, \`Embed Links\`, \`Use External Emoji\`, \`Read Message History\`!`)
                    ]
                })

                return ch.send({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(ee.color)
                        .setTitle(`:wave: Thank you for inviting me to your server! :wave:`)
                        .setTimestamp()
                        .setDescription(`To get yourself started with this brand new experience, please start by using \`/start\` to start your adventure off.\nAs members of this server talk, pokémon will spawn more frequently. You can then catch those pokémons with \`/catch <pokemon>\`, gotta catch em' all!\nNeed further help? Please use the command \`/help\` to view all available commands.\n\n**Configuration Help**\n• \`/redirect <channel>\` to redirect all pokémon spawns to a specific channel.\n• More help can be found by using \`/help config\`\n\n**Community Server**\nJoin our server at [https://discord.gg/botdeveloper](hey)`)
                    ]
                }).then("TRY SEND")
            } catch (error) {
                if (ch && ch.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages) && ch.permissionsFor(guild.members.me).has(PermissionFlagsBits.EmbedLinks) && ch.permissionsFor(guild.members.me).has(PermissionFlagsBits.ViewChannel)) {
                    await ch.send({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.wrongcolor)
                            .setTitle(`:x: Not invited with Administrator :x:`)
                            .setDescription(`Hello there **Guild**, as the **Server Owner** had their DMs disabled I am now sending this message here that I have permissions over. I was not invited with Administrator permissions resulting in that some commands may not function correctly, however this permissions **SHOULD** not be required Is till suggest fixing this. Otherwise please grant me the following permissions: \`Send Messages\`, \`Embed Links\`, \`Use External Emoji\`, \`Read Message History\`!`)
                        ]
                    })

                    return ch.send({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setTitle(`:wave: Thank you for inviting me to your server! :wave:`)
                            .setTimestamp()
                            .setDescription(`To get yourself started with this brand new experience, please start by using \`/start\` to start your adventure off.\nAs members of this server talk, pokémon will spawn more frequently. You can then catch those pokémons with \`/catch <pokemon>\`, gotta catch em' all!\nNeed further help? Please use the command \`/help\` to view all available commands.\n\n**Configuration Help**\n• \`/redirect <channel>\` to redirect all pokémon spawns to a specific channel.\n• More help can be found by using \`/help config\`\n\n**Community Server**\nJoin our server at [https://discord.gg/botdeveloper](hey)`)
                        ]
                    }).then(console.log("ERROR SEND"))
                } else {
                    return;
                }
            }
        } else {
            return ch.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor(ee.color)
                    .setTitle(`:wave: Thank you for inviting me to your server! :wave:`)
                    .setTimestamp()
                    .setDescription(`To get yourself started with this brand new experience, please start by using \`/start\` to start your adventure off.\nAs members of this server talk, pokémon will spawn more frequently. You can then catch those pokémons with \`/catch <pokemon>\`, gotta catch em' all!\nNeed further help? Please use the command \`/help\` to view all available commands.\n\n**Configuration Help**\n• \`/redirect <channel>\` to redirect all pokémon spawns to a specific channel.\n• More help can be found by using \`/help config\`\n\n**Community Server**\nJoin our server at [https://discord.gg/botdeveloper](hey)`)
                ]
            })
        }

    } catch (error) {}
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/