const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema, model } = mongoose;

const { messages } = require('../utils');
const { required } = messages

const reportSchema = Schema({
  _id: Schema.Types.ObjectId,
  year: {
    type: String,
    required,
  },
  month: {
    type: String,
    required,
  },
  income: {
    type: Number,
    default: 0,
  },
  expense: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

reportSchema.plugin(uniqueValidator);

module.exports = model('Report', reportSchema);
