const {
    Message,
    MessageEmbed,
    WebhookClient,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits,
    ButtonStyle,
    ButtonBuilder,
    ActionRowBuilder
} = require("discord.js");
const emoji = require("../botconfig/emojis.json")
const ee = require("../botconfig/embed.json");
const config = require("../botconfig/config.json");
const client = require("../index");
const servers = require('../schemas/Servers');
const {
    getDeveloperData
} = require("../handler/functions");

client.on("guildCreate", async (guild, Client) => {

    const devData = await getDeveloperData();

    const hasdata = await servers.findOne({
        ServerID: guild.id,
    });

    if (!hasdata) {
        await servers.create({
            ServerID: guild.id,
            Blacklisted: false,
            SpawningTime: 0,
            RedirectChannel: 0,
            ServerLang: 'en'
        })
    }

    if (devData.limitedServers) {
        const devServer = await client.guilds.fetch(`1055166872510791710`);
        const decideChannel = await devServer.channels.fetch('1058379990489641011');

        const mainRow = new ActionRowBuilder()
        mainRow.addComponents([
            new ButtonBuilder()
            .setEmoji('✅')
            .setCustomId('accept')
            .setStyle(ButtonStyle.Success)
        ])
        mainRow.addComponents([
            new ButtonBuilder()
            .setEmoji('❌')
            .setCustomId('deny')
            .setStyle(ButtonStyle.Danger)
        ])

        return await decideChannel.send({
            content: '@everyone',
            embeds: [
                new EmbedBuilder()
                .setColor(ee.color)
                .setTitle(`:warning: New Server Decision :warning:`)
                .addFields([{
                    name: 'Guild ID',
                    value: `\`${guild.id}\``,
                    inline: true
                }, {
                    name: 'Guild Name',
                    value: `\`${guild.name}\``,
                    inline: true
                }, {
                    name: 'Guild Owner',
                    value: `<@!${guild.ownerId}>`,
                    inline: true
                }, {
                    name: 'Member Count',
                    value: `\`${guild.memberCount}\``,
                    inline: true
                }])
            ],
            components: [mainRow]
        });
    }
});

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/