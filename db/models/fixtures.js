var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FixtureSchema = new Schema({


    api_detail: {
        id: {
            type: Number,
            index: true,
            required: true,
            unique: true
        }
    },

    competitionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Competition",
        index: true,
        required: true
    },

    date: {
        type: Date,
        index: true,
        required: true
    },

    status: {
        type: String,
        enum: ['SCHEDULED', 'TIMED', 'IN_PLAY', 'FINISHED', 'CANCELED', 'POSTPONED']
    },

    matchday: {
        type: Number,
        index: true,
        required: true
    },

    homeTeam: {
        name: {
            type: String,
            required: true
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            index: true,
            required: true
        }
    },

    awayTeam: {
        name: {
            type: String,
            required: true
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true
        }
    },

    result: {
        goalsHomeTeam: {
            type: Number,
            default: -1
        },
        goalsAwayTeam: {
            type: Number,
            default: -1
        }
    },

    odds: {
        homeWin: {
            type: Number,
            default: 1
        },
        awayWin: {
            type: Number,
            default: 1
        },
        draw: {
            type: Number,
            default: 1
        }
    }
});


module.exports = mongoose.model("Fixture", FixtureSchema);