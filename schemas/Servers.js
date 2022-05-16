const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
    ServerID: {
        type: Number,
        required: true,
        unique: true
    },
});

module.exports = mongoose.model("servers", ServerSchema)