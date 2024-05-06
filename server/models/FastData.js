const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const FastSchema = new Schema({
    email: {
        type: String,
        reqiured: true
    },
    date: {
        type: Date, 
        default: Date.now,
        required: true
    },
    startFast: {
        type: Date,
        required: true
    },
    endFast: {
        type: Date,
        required: true
    },
    // weight: {
    //     type: Number,
    //     required: true
    // },
    fastTime: {
        type: Number,
        required: true
    },
    notes: {
        type: String
    }
});

module.exports = mongoose.model('FastData', FastSchema);