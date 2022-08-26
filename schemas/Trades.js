const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;

const TradeSchema = new mongoose.Schema({
    initiatorID: {
        type: Long,
        required: true,
        unique: true
    },
    initiatorTag: {
        type: String,
        required: true
    },
    targetID: {
        type: Long,
        required: true,
        unique: true
    },
    targetTag: {
        type: String,
        required: true
    },
    tradeMessage: {
        type: Long,
        required: true,
        unique: true
    },
    tradeChannel: {
        type: Long,
        required: true
    },
    inAcceptStage: {
        type: Boolean,
        required: true
    },
    initiatorOffers: [{
        itemType: {
            type: String,
            required: true
        },
        object: {
            type: Object,
            required: true
        }
    }],
    targetOffers: [{
        itemType: {
            type: String,
            required: true
        },
        object: {
            type: Object,
            required: true
        }
    }],
});

module.exports = mongoose.model("trades", TradeSchema)