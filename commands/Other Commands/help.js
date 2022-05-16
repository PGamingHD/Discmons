const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");

module.exports = {
    name: "help", //userMoney, userBank, userBitcoin, userID (ALL USERVALUES)
    aliases: ['helpme', 'support', 'assistance'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args, con, prefix) => { // FIX HELP TO OLD HELP CMD, WAY BETTER!
        if (!args[0]) {
            const buttonrow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setStyle(`LINK`)
                    .setURL(`https://discord.gg/pxySje4GPC`)
                    .setLabel(`Support`)
                )
                .addComponents(
                    new MessageButton()
                    .setStyle(`LINK`)
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=904757023797813339&permissions=517543939136&scope=bot%20applications.commands`)
                    .setLabel(`Invite`)
                );

            let embed = new MessageEmbed()
                .setColor(ee.color)
                .setTitle(`PizzaParadise | Help`)
                .setDescription(`Use \`${prefix}help [page]\` to swap between the pages.`)
                .addField(`PizzaParadise Tutorial`, `View the bot tutorial with the command \`${prefix}tutorial\` if you need some extra help!`)
                .addField(`Page 1: Business Commands`, `View all our main Business commands.`)
                .addField(`Page 2: Gambling Commands`, `Gamble? Sure, view some gambling commands.`)
                .addField(`Page 3: Leaderboard Commands`, `View all our public leaderboards.`)
                .addField(`Page 4: Misc Commands`, `View all the Misc Commands.`)
                .addField(`Page 5: Other Commands`, `Some extra commands to PizzaParadise.`)
                .setFooter(`Current server prefix: ${prefix}`)
                .setThumbnail(ee.footericon)
            return message.reply({
                embeds: [embed],
                components: [buttonrow]
            })
        }
        if (args[0]) {
            if (!["1", "2", "3", "4", "5", "6"].includes(args[0])) {
                const buttonrow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setStyle(`LINK`)
                        .setURL(`https://discord.gg/pxySje4GPC`)
                        .setLabel(`Support`)
                    )
                    .addComponents(
                        new MessageButton()
                        .setStyle(`LINK`)
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=904757023797813339&permissions=517543939136&scope=bot%20applications.commands`)
                        .setLabel(`Invite`)
                    );

                let embed = new MessageEmbed()
                    .setColor(ee.color)
                    .setTitle(`PizzaParadise | Help`)
                    .setDescription(`Use \`${prefix}help [page]\` to swap between the pages.`)
                    .addField(`PizzaParadise Tutorial`, `View the bot tutorial with the command \`${prefix}tutorial\` if you need some extra help!`)
                    .addField(`Page 1: Business Commands`, `View all our main Business commands.`)
                    .addField(`Page 2: Gambling Commands`, `Gamble? Sure, view some gambling commands.`)
                    .addField(`Page 3: Leaderboard Commands`, `View all our public leaderboards.`)
                    .addField(`Page 4: Misc Commands`, `View all the Misc Commands.`)
                    .addField(`Page 5: Other Commands`, `Some extra commands to PizzaParadise.`)
                    .setFooter(`Current server prefix: ${prefix}`)
                    .setThumbnail(ee.footericon)
                return message.reply({
                    embeds: [embed],
                    components: [buttonrow]
                })
            }

            if (args[0] == "1") {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setTitle(`PizzaParadise | Business Commands`)
                        .addField(`bake [type] [amount]`, `Bake pizzas`)
                        .addField(`business`, `Business information`)
                        .addField(`buy`, `Buy stuff from the shop & market`)
                        .addField(`daily`, `Daily PizzaParadise money`)
                        .addField(`extradaily`, `Daily premium PizzaParadise money`)
                        .addField(`inventory`, `Your business inventory`)
                        .addField(`levelup`, `Have you maxed out a level? Then use this to level up`)
                        .addField(`market`, `Display the crypto market`)
                        .addField(`menu`, `Your business menu, what you are selling`)
                        .addField(`profile`, `View your private profile account`)
                        .addField(`recipe`, `All owned recipes you can bake from`)
                        .addField(`register`, `Register your business & private account`)
                        .addField(`sell`, `Sell your newly baked pizzas to your customers`)
                        .addField(`shop`, `Purchase lots of stuff from the shop, recipes and much more`)
                        .addField(`wallet`, `Your crypto wallet, purchase one and collect crypto currency`)
                        .setFooter(`Current server prefix: ${prefix}`)
                    ]
                })
            }

            if (args[0] == "2") {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setTitle(`PizzaParadise | Gambling Commands`)
                        .addField(`flip [heads/tails] [bet]`, `Coinflip to double your bet`)
                        .addField(`slots [bet]`, `Play a slotmachine`)
                        .addField(`scratch`, `Buy a scratch ticket`)
                        .addField(`roulette [color] [bet]`, `Play blackjack and hope for the best`)
                        .setFooter(`Current server prefix: ${prefix}`)
                    ]
                })
            }

            if (args[0] == "3") {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setTitle(`PizzaParadise | Leaderboard Commands`)
                        .addField(`moneylb`, `Display the top 10 richest players`)
                        .addField(`agelb`, `Display the top 10 oldest Businesses`)
                        .addField(`soldlb`, `Display the top 10 highest selling pizza Businesses`)
                        .setFooter(`Current server prefix: ${prefix}`)
                    ]
                })
            }

            if (args[0] == "4") {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setTitle(`PizzaParadise | Miscellaneous Commands`)
                        .addField(`donate`, `Donate to the bot developers, show some appreciation for rewards`)
                        .addField(`invite`, `Invite the bot to your own server, mobile pizza business`)
                        .addField(`links`, `All the important bot links you can imagine`)
                        .addField(`support`, `Link to our bot support server, need help? use this`)
                        .setFooter(`Current server prefix: ${prefix}`)
                    ]
                })
            }

            if (args[0] == "5") {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setTitle(`PizzaParadise | Other Commands`)
                        .addField(`claim`, `Claim your vote rewards`)
                        .addField(`help`, `Display this help command`)
                        .addField(`information`, `Some general information about this bot`)
                        .addField(`ping`, `Current ping of the bot, api and database`)
                        .addField(`redeemkey [key]`, `Redeem your own reward key`)
                        .addField(`shards`, `Whenever the bot is sharded, display some shard information`)
                        .addField(`status`, `Some general status information about the bot`)
                        .addField(`tutorial`, `View a nice bot tutorial`)
                        .addField(`vote`, `Vote for the bot, get some sweet rewards`)
                        .addField(`cooldowns`, `View all your current cooldowns, overview`)
                        .addField(`prefix [set/change] [newprefix]`, `View or change your server prefix`)
                        .addField(`prestige`, `Are you a hardcore PizzaParadise player? Then prestige and get sweet rewards`)
                        .setFooter(`Current server prefix: ${prefix}`)
                    ]
                })
            }
        }
    },
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/