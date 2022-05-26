const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;

const ShopData = new mongoose.Schema({
    ItemID: {
        type: Number,
        required: true,
        unique: true
    },
    ItemName: {
        type: String,
        required: true
    },
    ItemCost: {
        type: Number,
        required: true,
    },
    CostType: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("shopData", ShopData)