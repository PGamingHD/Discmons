const express = require("express");
const router = express.Router();
const purchased = require("../../../schemas/purchasedOrders");
const {
    setUserRank
} = require("../../../handler/functions");
const {
    WebhookClient,
    EmbedBuilder
} = require('discord.js');
const hook = new WebhookClient({
    url: "https://discord.com/api/webhooks/977707218025734174/YyGBNqUd3q_GHFabsosnF9uM_2LKfswmJYOuFXqpa3hVRzJTtX5x8fjmrIpq1L7VPSzE"
});
const paypal = require('paypal-rest-sdk');
paypal.configure({
    'mode': 'live', //sandbox or live
    'client_id': 'AZedZ1Ra-A6dP0ASGyU87zL09rrQH6ygxwwQ7jff_PLFd06a6xAJEYWdZXtxIDLoiVcizt9u5IRa3LO_',
    'client_secret': 'EEtflHqSqgENvZZSBmB3kg3GoxjomY575mLpEW3tlnV7mEi2eboe-ZYGe3cCbSU7f5HAKvV0BebYiv4v'
});


router.get('/', async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    if (!payerId || !paymentId) {
        return res.send('Payment not found, could not find payment ID!');
    }

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "19.99"
            }
        }]
    }

    const findpay = await purchased.findOne({
        PaymentID: paymentId
    })

    if (!findpay) {
        try {
            paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                if (error) {
                    console.log(error.response);
                    throw error;
                } else {
                    const stringtosplit = payment.transactions[0].description.split("Product paid by: ").pop();
                    const userid = parseInt(stringtosplit);
                    hook.send({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(11141375)
                            .setTitle(`__**New Payment**__`)
                            .setDescription(`> **Purchaser:** <@${userid}>\n> **Purchased Item:** \`${payment.transactions[0].item_list.items[0].name}\`\n> **Purchased Price:** \`$${payment.transactions[0].item_list.items[0].price} ${payment.transactions[0].item_list.items[0].currency}\``)
                            .setFooter({
                                text: 'Order has been successfully added to the users inventory!'
                            })
                        ]
                    })
                    res.send('Order paid for, your order has been successfully paid for and delivered!')

                    setUserRank(userid, 4, paymentId);
                }
            })
        } catch (error) {
            console.log(error)
        }
    } else {
        res.send(`This order has already been claimed, this order was claimed by the user with ID: ${findpay.RedeemedUser} | If this is wrong please take a screenshot of this message and hand this to Support on our Support Server!`)
    }
});


module.exports = router;