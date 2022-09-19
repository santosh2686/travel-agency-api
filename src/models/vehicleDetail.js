const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema, model } = mongoose;

const { messages } = require('../utils');
const { required } = messages

const vehicleDetailsSchema = Schema({
  _id: Schema.Types.ObjectId,
  vehicleCategory: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleCategory',
    required,
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required,
  },
  hasLoan: {
    type: Boolean,
    default: false,
  },
  loanDetails: {
    disbursementDate: {
      type: Date,
      default: null,
    },
    amount: {
      type: Number,
      default: 0,
    },
    tenure: {
      type: Number,
      default: 0,
    },
    emiAmount: {
      type: Number,
      default: 0,
    },
    emiDate: {
      type: Date,
      default: null,
    },
    financeFrom: {
      type: String,
    }
  },
  documents: {
    puc: {
      startDate: {
        type: Date,
        default: null,
      },
      endDate: {
        type: Date,
        default: null,
      },
      amount: {
        type: Number,
      },
    },
    tax: {
      startDate: {
        type: Date,
        default: null,
      },
      endDate: {
        type: Date,
        default: null,
      },
      amount: {
        type: Number,
      },
    },
    passing: {
      startDate: {
        type: Date,
        default: null,
      },
      endDate: {
        type: Date,
        default: null,
      },
      amount: {
        type: Number,
      },
    },
    permit: {
      startDate: {
        type: Date,
        default: null,
      },
      endDate: {
        type: Date,
        default: null,
      },
      amount: {
        type: Number,
      },
    },
    authorization: {
      startDate: {
        type: Date,
        default: null,
      },
      endDate: {
        type: Date,
        default: null,
      },
      amount: {
        type: Number,
      },
    },
    insurance: {
      startDate: {
        type: Date,
        default: null,
      },
      endDate: {
        type: Date,
        default: null,
      },
      amount: {
        type: Number,
      },
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

vehicleDetailsSchema.plugin(uniqueValidator);

module.exports = model('VehicleDetail', vehicleDetailsSchema);
