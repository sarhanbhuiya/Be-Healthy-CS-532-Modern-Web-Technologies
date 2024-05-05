const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const WeightDataSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  weight: {
    type: Number
  },
  target_weight: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WeightData', WeightDataSchema)