const express = require("express");
const router = express.Router();
const Topgg = require("@top-gg/sdk");
const {
    WebhookClient,
    EmbedBuilder
} = require('discord.js');
const voter = new Topgg.Webhook(`4egaWhYPeFClOjlZI95LFNvF1zqkdAjQRD1k3`)
const userData = require("../../schemas/userData");

const publichook = new WebhookClient({
    url: "https://discord.com/api/webhooks/979390441977962546/LyGcZjJkDCac6XPvl4u6M7ZVtMJD_pL3-LijVJJI7ga14mMSHeZKe7MBh9iQstmPih9n"
})

router.post("/", voter.listener(async (vote) => {
    // vote is your vote object e.g
    console.log(vote.user) // => 321714991050784770

    const founduser = await userData.findOne({
        OwnerID: vote.user
    })

    if (!founduser) {
        publichook.send({
            embeds: [
                new EmbedBuilder()
                .setColor(11141375)
                .setTitle('🎉 A new vote has been registered! 🎉')
                .setDescription(`> **A new vote was registered from** <@${vote.user}>**!**`)
                .setFooter({
                    text: 'User was not found as a registered user and rewards could therefore not be awarded!'
                })
            ]
        })
    } else {
        publichook.send({
            embeds: [
                new EmbedBuilder()
                .setColor(11141375)
                .setTitle('🎉 A new vote has been registered! 🎉')
                .setDescription(`> **A new vote was registered from** <@${vote.user}>**!**`)
                .setFooter({
                    text: 'User has successfully been awarded with their voting rewards!'
                })
            ]
        })

        await founduser.updateOne({
            $inc: {
                Poketokens: 10,
            },
            $set: {
                VotedCooldown: Date.now()
            }
        })
    }
}))


module.exports = router;