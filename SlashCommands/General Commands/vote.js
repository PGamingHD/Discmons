    const {
        Client,
        CommandInteraction,
        MessageEmbed,
        MessageActionRow,
        MessageButton
    } = require('discord.js');
    const ee = require('../../botconfig/embed.json');
    const emoji = require('../../botconfig/embed.json')
    const prettyMilliseconds = require('pretty-ms');
    const config = require('../../botconfig/config.json')
    const axios = require('axios');
    const userData = require('../../schemas/userData');
    const {
        EmbedBuilder
    } = require('@discordjs/builders');

    module.exports = {
        name: 'vote',
        description: 'Vote for the Pokémon bot and gain some special benefits!',
        /** 
         * @param {Client} client 
         * @param {Message} message 
         * @param {String[]} args 
         */
        run: async (client, interaction, args) => {

            let votes = await axios.get(`https://top.gg/api/bots/904757023797813339/check?userId=${interaction.user.id}`, { //BOTID AT 487!
                headers: {
                    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkwNDc1NzAyMzc5NzgxMzMzOSIsImJvdCI6dHJ1ZSwiaWF0IjoxNjM3NTIzNjM4fQ.GpNVwNqoDgSDX4DPA_OlDwiG5HFZkgZ3caOrw97tMeo'
                }
            });
            const voted = votes.data.voted;
            console.log(voted)

            const user = await userData.findOne({
                OwnerID: parseInt(interaction.user.id)
            })

            const votedbefore = user.VotedData.Voted;

            let cooldown = 43201000;
            if (Date.now() >= user.VotedData.VotedCooldown + cooldown || user.VotedData.VotedCooldown === 0) {

                if (voted) {

                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setTitle(`Voting Rewards`)
                            .setDescription(`Thank you for voting for us on [top.gg](https://top.gg/bot/904757023797813339/vote), you have been awarded for doing so!`)
                        ],
                        ephemeral: true
                    })

                    await user.updateOne({
                        "VotedData.VotedCooldown": Date.now(),
                        $inc: {
                            Poketokens: 10
                        }
                    });
                    return;
                } else if (!voted) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(ee.color)
                            .setTitle(`Voting Rewards`)
                            .setDescription(`Vote for us on [top.gg](https://top.gg/bot/904757023797813339/vote) to recieve tokens that can then be spent in the Shop. You can vote once per 12 hours!`)
                            .addFields([{
                                name: 'Voting Timer',
                                value: `Your vote seems to be ready, vote and get your rewards now!`
                            }])
                        ],
                        ephemeral: true
                    })
                }
            } else {
                let cooldown = 43201000;
                const timetobe = user.VotedData.VotedCooldown + cooldown;
                const timenow = Date.now();
                const timeleft = timetobe - timenow


            }
        }
    }