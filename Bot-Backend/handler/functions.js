const mongoose = require("mongoose");
const user = require("../schemas/userData");
const purchased = require("../schemas/purchasedOrders");
const chalk = require("chalk");

module.exports.connectToMongo = connectToMongo;
module.exports.addUserCoins = addUserCoins;
module.exports.setUserRank = setUserRank;
module.exports.addUserTokens = addUserTokens;

async function connectToMongo() {
    await mongoose.connect("mongodb://localhost:27017" || '', {
        keepAlive: true,
        dbName: 'Discmons',
    }).then(() => console.log(chalk.green("[DATABASE] <==> || Successfully connected to the MongoDB database! || <==> [DATABASE]")))
}

async function addUserCoins(userid, amount, paymentID) {
    await user.findOneAndUpdate({
        OwnerID: userid
    }, {
        $inc: {
            Pokecoins: amount,
        }
    })

    await purchased.create({
        PaymentID: paymentID,
        RedeemedUser: userid,
        PurchasedProduct: `Money Pack: ${amount}`
    })
}

async function addUserTokens(userid, amount, paymentID) {
    await user.findOneAndUpdate({
        OwnerID: userid
    }, {
        $inc: {
            Poketokens: amount,
        }
    })

    await purchased.create({
        PaymentID: paymentID,
        RedeemedUser: userid,
        PurchasedProduct: `Token Pack: ${amount}`
    })
}

async function setUserRank(userid, ranklevel, paymentID) {
    await user.findOneAndUpdate({
        OwnerID: userid
    }, {
        TrainerRank: ranklevel
    })

    await purchased.create({
        PaymentID: paymentID,
        RedeemedUser: userid,
        PurchasedProduct: `Trainer rank: ${ranklevel}`
    })
}