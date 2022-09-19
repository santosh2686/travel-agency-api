const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const { messages } = require('../utils');
const { required } = messages

const fixedVehiclePaymentSchema = Schema({
  _id: Schema.Types.ObjectId,
  year: {
    type: String,
    required,
  },
  month: {
    type: String,
    required,
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  requestPackage: {
    type: Schema.Types.ObjectId,
    ref: 'Package',
  },
  totalLocalRequests: {
    type: Number,
    default: 0,
  },
  totalOutStationRequests: {
    type: Number,
    default: 0,
  },
  totalKm: {
    type: Number,
    default: 0,
  },
  totalHr: {
    type: Number,
    default: 0,
  },
  totalExtraHr: {
    type: Number,
    default: 0,
  },
  totalToll: {
    type: Number,
    default: 0,
  },
  totalParking: {
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

module.exports = model('FixedVehiclePaymentSchema', fixedVehiclePaymentSchema);
