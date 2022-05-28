const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;

const userDataSchema = new mongoose.Schema({
    OwnerID: {
        type: Long,
        required: true
    },
    Blacklisted: {
        type: Boolean,
        required: true
    },
    Poketokens: {
        type: Long,
        required: true
    },
    Pokecoins: {
        type: Long,
        required: true
    },
    TotalCaught: {
        type: Number,
        required: true
    },
    MythicalCaught: {
        type: Number,
        required: true
    },
    LegendaryCaught: {
        type: Number,
        required: true
    },
    UBCaught: {
        type: Number,
        required: true
    },
    ShinyCaught: {
        type: Number,
        required: true
    },
    TrainerNumber: {
        type: Number,
        required: true,
        unique: true
    },
    TrainerRank: {
        type: Number, // 0 NORMAL, 1 BRONZE, 2 SILVER, 3 GOLD, 4 PLATINUM, 5 MOD, 6 ADMIN, 7 DEVELOPER
        required: true
    },
    VotedCooldown: {
        type: Long,
        required: true
    },
    LatestAgreed: {
        type: Long,
        required: true
    },
    Items: [{
        ItemName: {
            type: String,
            required: true
        },
        ItemAmount: {
            type: Number,
            required: true
        }
    }],
    Inventory: [{
        PokemonID: {
            type: String,
            required: true,
            unique: true
        },
        PokemonName: {
            type: String,
            required: true
        }, 
        PokemonPicture: {
            type: String,
            required: true
        },
        PokemonSelected: {
            type: Boolean,
            required: true
        },
        PokemonOnMarket: {
            type: Boolean,
            required: true
        },
        PokemonData: {
            PokemonOriginalOwner: {
                type: Number,
                required: true
            },
            PokemonLevel: {
                type: Number,
                required: true
            },
            PokemonXP: {
                type: Number,
                required: true
            },
            PokemonOrder: {
                type: Number,
                required: true
            },
            PokemonIVs: {
                HP: {
                    type: Number,
                    required: true
                },
                Attack: {
                    type: Number,
                    required: true
                },
                Defense: {
                    type: Number,
                    required: true
                },
                SpecialAtk: {
                    type: Number,
                    required: true
                },
                SpecialDef: {
                    type: Number,
                    required: true,
                },
                Speed: {
                    type: Number,
                    required: true
                },
                TotalIV: {
                    type: Number,
                    required: true
                }
            },
        }
    }],
});

module.exports = mongoose.model("userData", userDataSchema)