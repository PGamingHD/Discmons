const mongoose = require('mongoose');

const SpawnedSchema = new mongoose.Schema({
    PokemonID: {
        type: Number,
        unique: true,
        required: true
    },
    PokemonName: {
        type: String,
        unique: true,
        required: true
    },
    PokemonPicture: {
        type: String,
        unique: true,
        required: true
    },
    PokemonLevel: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("spawnedpokemon", SpawnedSchema)