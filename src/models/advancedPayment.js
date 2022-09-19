const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const { messages } = require('../utils');
const { required } = messages

const advancedPaymentSchema = Schema({
  _id: Schema.Types.ObjectId,
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required,
  },
  staffCategory: {
    type: Schema.Types.ObjectId,
    ref: 'StaffCategory',
    required,
  },
  paymentDate: {
    type: Date,
    required,
  },
  paymentMethod: {
    type: Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    default: null,
  },
  amount: {
    type: Number,
    default: 0,
  },
  comment: {
    type: String,
    maxlength: 200,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('AdvancedPayment', advancedPaymentSchema);
