const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema, model } = mongoose;
const { messages } = require('../utils');
const { required } = messages

const packageSchema = Schema({
  _id: Schema.Types.ObjectId,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'PackageCategory',
    required,
  },
  packageCode: {
    type: String,
    required,
    trim: true,
    unique: true,
  },
  baseAmount: {
    type: Number,
    required,
  },
  minimumKm: {
    type: Number,
    required,
  },
  extraKmPerKmRate: {
    type: Number,
    required,
  },
  minimumHr: {
    type: Number,
    required,
  },
  extraHrPerHrRate: {
    type: Number,
    required,
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

packageSchema.plugin(uniqueValidator);

module.exports = model('Package', packageSchema);
