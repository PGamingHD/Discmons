const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;

const ServerSchema = new mongoose.Schema({
    ServerID: {
        type: Long,
        required: true,
        unique: true
    },
    Blacklisted: {
        type: Boolean,
        required: true
    },
    RedirectChannel: {
        type: Long,
        required: true
    },
    SpawningTime: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model("servers", ServerSchema)