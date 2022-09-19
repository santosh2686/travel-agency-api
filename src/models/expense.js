const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const { messages } = require('../utils');
const { required } = messages

const expenseSchema = Schema({
  _id: Schema.Types.ObjectId,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'ExpenseCategory',
    required,
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'ExpenseType',
    required,
  },
  date: {
    type: Date,
    default: Date.now
  },
  staffCategory: {
    type: Schema.Types.ObjectId,
    ref: 'StaffCategory',
    default: null
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: () => this.staffCategory,
    default: null
  },
  vehicleCategory: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleCategory',
    default: null,
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: () => this.vehicleCategory,
    default: null
  },
  paymentMethod: {
    type: Schema.Types.ObjectId,
    ref: 'PaymentMethod',
  },
  amount: {
    type: Number,
    required,
    default: 0,
  },
  location: {
    type: String,
    trim: true
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

module.exports = model('Expense', expenseSchema);
