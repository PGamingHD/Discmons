const {
    Message,
    Client,
    MessageEmbed
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const config = require("../../botconfig/config.json")

module.exports = {
    name: "reload", //userMoney, userBank, userBitcoin, userID (ALL USERVALUES)
    aliases: ['reloadcmd'],
    cooldown: 1,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (!config.ownerID.includes(message.author.id)) return;
        try {
            let reload = false;
            for (let i = 0; i < client.categories.length; i += 1) {
                let dir = client.categories[i];
                try {
                    if (!args[0])
                        return message.reply({
                            embeds: [
                                new MessageEmbed()
                                .setColor(ee.wrongcolor)
                                .setDescription(`Please include an argument.`),
                            ],
                        });

                    delete require.cache[
                        require.resolve(`../../commands/${dir}/${args[0]}.js`)
                    ]; // usage !reload <name>
                    client.commands.delete(args[0]);
                    const pull = require(`../../commands/${dir}/${args[0]}.js`);
                    client.commands.set(args[0], pull);
                    reload = true;
                } catch {}
            }
            if (reload)
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor(ee.color)
                        .setDescription(
                            `Successfully reloaded command \`[ ${args[0]} ]\``
                        ),
                    ],
                });

            return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription(`Could not reload command: \`[ ${args[0]} ]\``),
                ],
            });
        } catch (e) {
            console.log(String(e.stack));

            return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setTitle(`${emoji.error} | Something went very wrong`)
                    .setDescription(`\`\`\`${e.message}\`\`\``),
                ],
            });
        }
    },
};

/*

Code used in this script has been written by original PizzaParadise developer - PGamingHD#0666
Require assistance with scripts? Join the discord and get help right away! - https://discord.gg/pxySje4GPC
Other than that, please do note that it is required if you are using this to mention the original developer
Original Developer - PGamingHD#0666

*/