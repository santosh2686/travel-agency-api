const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema, model } = mongoose;

const { validationPattern, messages } = require('../utils');
const { contact, email } = validationPattern
const { required, invalidEmail, invalidContact } = messages

const userSchema = Schema({
  _id: Schema.Types.ObjectId,
  userName: {
    type: String,
    required,
    unique: true,
  },
  password: {
    type: String,
    required,
  },
  agencyName: {
    type: String,
    required,
  },
  agencyAddress: {
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
    required,
    unique: true,
    uniqueCaseInsensitive: true,
    match: [email, invalidEmail],
    trim: true
  },
  userRole: {
    type: String,
    trim: true,
  }
})

userSchema.plugin(uniqueValidator);

module.exports = model('User', userSchema);
