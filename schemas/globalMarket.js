const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const { Types: {Long} } = mongoose;

const globalMarket = new mongoose.Schema({
    MarketPrice: {
        type: Number,
        required: true
    },
    MarketID: {
        type: Long,
        required: true,
        unique: true
    },
    PokemonName: {
        type: String,
        required: true
    },
    PokemonLevel: {
        type: String,
        required: true
    },
    PokemonPicture: {
        type: String,
        required: true
    },
    PokemonID: {
        type: String,
        required: true
    },
    PokemonOwner: {
        type: Long,
        required: true
    },
    PokemonOriginalOwner: {
        type: Number,
        required: true
    },
    PokemonXP: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model("globalMarket", globalMarket)