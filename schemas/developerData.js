const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;

const developerData = new mongoose.Schema({
    developerAccess: {
        type: String,
        required: true,
        unique: true
    },
    globalMaintenance: {
        type: Boolean,
        required: true
    },
    LastTOSUpdate: {
        type: Long,
        required: true
    }
});

module.exports = mongoose.model("developerData", developerData)