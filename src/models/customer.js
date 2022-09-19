const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema, model } = mongoose;

const { validationPattern, messages } = require('../utils');
const { contact, email } = validationPattern
const { required, invalidEmail, invalidContact } = messages

const customerSchema = Schema({
  _id: Schema.Types.ObjectId,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'CustomerCategory',
    required,
  },
  name: {
    type: String,
    required,
    trim: true
  },
  address: {
    addressLine1: {
      type: String,
      required,
      trim: true
    },
    addressLine2: {
      type: String,
      required,
      trim: true
    },
    city: {
      type: String,
      required,
      trim: true
    },
    state: {
      type: String,
      required,
      trim: true
    },
    pinCode: {
      type: Number,
      required,
      trim: true
    }
  },
  contact: {
    type: String,
    required,
    unique: true,
    uniqueCaseInsensitive: true,
    match: [contact, invalidContact],
    trim: true
  },
  whatsAppNumber: {
    type: String,
    required,
    unique: true,
    uniqueCaseInsensitive: true,
    match: [contact, invalidContact],
    trim: true
  },
  email: {
    type: String,
    unique: true,
    uniqueCaseInsensitive: true,
    match: [email, invalidEmail],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true,
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

customerSchema.plugin(uniqueValidator);

module.exports = model('Customer', customerSchema);
