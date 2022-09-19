const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema, model } = mongoose;

const { messages } = require('../utils');
const { required } = messages

const vehicleSchema = Schema({
  _id: Schema.Types.ObjectId,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleCategory',
    required,
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleType',
    required,
  },
  manufacturer: {
    type: String,
    required,
    trim: true,
  },
  name: {
    type: String,
    required,
    trim: true,
  },
  registrationNo: {
    type: String,
    required,
    unique: true,
    trim: true,
  },
  noOfSeats: {
    type: Number,
    required,
  },
  hasAc: {
    type: Boolean,
    default: true,
  },
  isMonthlyFixed: {
    type: Boolean,
    default: false,
  },
  monthlyFixedDetails: {
    customerCategory: {
      type: Schema.Types.ObjectId,
      ref: 'CustomerCategory',
      required: () => this.isMonthlyFixed,
      default: null,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: () => this.isMonthlyFixed,
      default: null,
    },
    packageCategory: {
      type: Schema.Types.ObjectId,
      ref: 'PackageCategory',
      required: () => this.isMonthlyFixed,
      default: null,
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: () => this.isMonthlyFixed,
      default: null,
    },
    staffCategory: {
      type: Schema.Types.ObjectId,
      ref: 'StaffCategory',
      required: () => this.isMonthlyFixed,
      default: null,
    },
    staff: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
      required: () => this.isMonthlyFixed,
      default: null,
    },
    contractStartDate: {
      type: Date,
      default: null,
    },
    contractEndDate: {
      type: Date,
      default: null,
    },
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

vehicleSchema.plugin(uniqueValidator);

module.exports = model('Vehicle', vehicleSchema);
