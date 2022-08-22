const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;

const globalData = new mongoose.Schema({
    accessString: {
        type: String,
        required: true,
        unique: true
    },
    totalCaught: {
        type: Long,
        required: true
    },
    MythicalCaught: {
        type: Long,
        required: true
    },
    LegendaryCaught: {
        type: Long,
        required: true
    },
    UBCaught: {
        type: Long,
        required: true
    },
    ShinyCaught: {
        type: Long,
        required: true
    },
    Registered: {
        type: Long,
        required: true
    },
    NextMarketID: {
        type: Long,
        required: true,
        default: 1
    }
});

module.exports = mongoose.model("globalData", globalData)