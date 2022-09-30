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
    },
    PokemonEvolve: {
        currentStage: {
            type: Number,
            required: true
        },
        totalStages: {
            type: Number,
            required: true
        },
        stageOne: {
            newName: {
                type: String,
                required: true
            },
            newLevel: {
                type: Number,
                required: true
            }
        },
        stageTwo: {
            newName: {
                type: String,
                required: true
            },
            newLevel: {
                type: Number,
                required: true
            }
        },
        stageThree: {
            newName: {
                type: String,
                required: true
            },
            newLevel: {
                type: Number,
                required: true
            }
        }
    }
});

module.exports = mongoose.model("pokemons", PokemonSchema)