const mongoose = require('mongoose');

const developerMaintenance = new mongoose.Schema({
    developerAccess: {
        type: String,
        required: true,
        unique: true
    },
    globalMaintenance: {
        type: Boolean,
        required: true
    },
});

module.exports = mongoose.model("developerMaintenance", developerMaintenance)