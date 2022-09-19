const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const { messages } = require('../utils');
const { required } = messages

const vehicleReportSchema = Schema({
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
  vehicleCategory: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleCategory',
  },
  totalLocalRequests: {
    type: Number,
    default: 0,
  },
  totalOutStationRequests: {
    type: Number,
    default: 0,
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

module.exports = model('VehicleReport', vehicleReportSchema);
