const {
    Message,
    Client,
    MessageEmbed
} = require("discord.js");
const emoji = require("../../botconfig/emojis.json")
const ee = require("../../botconfig/embed.json");
const config = require("../../botconfig/config.json")
const {
    inspect
} = require(`util`);

module.exports = {
    name: "eval", //userMoney, userBank, userBitcoin, userID (ALL USERVALUES)
    aliases: ['evaluate'],
    cooldown: 1,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (!config.ownerID.includes(message.author.id)) return;
        if (!args[0]) {
            const embed = new MessageEmbed();
            return message.reply({
                embeds: [
                    embed
                    .setColor(ee.color)
                    .setDescription(`Please insert arguments to evaluate.`),
                ],
            });
        }
        let evaled;
        try {
            if (args.join(` `).includes(`token`))
                return console.log(`ERROR, NO TOKEN GRABBING`.red);

            evaled = await eval(args.join(` `));
            //make string out of the evaluation
            let string = inspect(evaled);
            //if the token is included return error
            if (string.includes(client.token))
                return console.log(`ERROR, NO TOKEN GRABBING`.red);
            //define queueembed
            let evalEmbed = new MessageEmbed().setTitle(
                `${client.user.username} | EVALUTION`
            );
            //set code to evaled
            evalEmbed.setDescription(`
                          
                          ***Input:***
                          \`\`\`js\n${args}\n\`\`\`
                          
                          ***Output:***
                          \`\`\`js\n${string}\n\`\`\``);
            //send embed
            message.reply({
                embeds: [evalEmbed.setColor(ee.color)]
            });
        } catch (e) {
            console.log(String(e.stack));
            const evalEmbed2 = new MessageEmbed();
            evalEmbed2.setTitle(`Something went very wrong`);
            evalEmbed2.setDescription(`\`\`\`${e.message}\`\`\``);
            return message.reply({
                embeds: [evalEmbed2.setColor(ee.wrongcolor)]
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