const mongoose = require('mongoose');

const SpawnedSchema = new mongoose.Schema({
    SpawnedServerID: {
        type: String,
        required: true
    },
    SpawnedChannelID: {
        type: String,
        required: true
    },
    SpawnedMessageID: {
        type: String,
        required: true
    },
    PokemonID: {
        type: String,
        unique: true,
        required: true
    },
    PokemonName: {
        type: String,
        required: true
    },
    PokemonPicture: {
        type: String,
        required: true
    },
    PokemonLevel: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("spawnedpokemon", SpawnedSchema)