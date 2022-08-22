const mongoose = require('mongoose');

const purchasedOrders = new mongoose.Schema({
    PaymentID: {
        type: String,
        required: true
    },
    RedeemedUser: {
        type: String,
        required: true
    },
    PurchasedProduct: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("purchasedOrders", purchasedOrders)