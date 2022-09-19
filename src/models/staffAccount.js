const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const { messages } = require('../utils');
const { required } = messages

const staffAccountSchema = Schema({
  _id: Schema.Types.ObjectId,
  year: {
    type: String,
    required,
  },
  month: {
    type: String,
    required,
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
  },
  staffCategory: {
    type: Schema.Types.ObjectId,
    ref: 'StaffCategory',
  },
  advancePayment: {
    type: Number,
    default: 0,
  },
  totalNightHalt: {
    type: Number,
    default: 0,
  },
  totalDriverAllowance: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('StaffAccount', staffAccountSchema);
