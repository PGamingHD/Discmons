const mongoose = require('mongoose');

const PokemonSchema = new mongoose.Schema({
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
    PokemonRarity: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("pokemons", PokemonSchema)