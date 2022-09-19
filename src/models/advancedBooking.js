const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const { validationPattern, messages } = require('../utils');
const { contact, email } = validationPattern
const { required, invalidEmail, invalidContact } = messages

const advancedBookingSchema = Schema({
  _id: Schema.Types.ObjectId,
  customerType: {
    type: String,
    enum: ['existing', 'new'],
    default: 'existing'
  },
  customerCategory: {
    type: Schema.Types.ObjectId,
    ref: 'CustomerCategory',
    default: null,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    default: null,
    required: () => this.customerCategory,
  },
  customerDetails: {
    name: {
      type: String,
      trim: true
    },
    contact: {
      type: String,
      trim: true,
      match: [contact, invalidContact]
    },
    email: {
      type: String,
      trim: true,
      match: [email, invalidEmail]
    }
  },
  pickUpLocation: {
    type: String,
    required,
    trim: true
  },
  dropOffLocation: {
    type: String,
    required,
    trim: true
  },
  pickUpDateTime: {
    type: Date,
    required
  },
  vehicleType: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleType',
  },
  noOfSeats: {
    type: Number,
    required
  },
  hasAc: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'OPEN'
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

module.exports = model('AdvancedBookingSchema', advancedBookingSchema);
