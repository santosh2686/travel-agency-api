const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema, model } = mongoose;

const { validationPattern, messages } = require('../utils');
const { contact } = validationPattern
const { required, invalidContact } = messages

const fixedRequestSchema = Schema({
  _id: Schema.Types.ObjectId,
  requestType: {
    type: Schema.Types.ObjectId,
    ref: 'RequestType',
    required,
  },
  vehicleType: {
    type: String,
    enum: ['regular', 'existing', 'new'],
    default: 'regular'
  },
  staffType: {
    type: String,
    enum: ['regular', 'existing','new'],
    default: 'existing'
  },
  customerCategory: {
    type: Schema.Types.ObjectId,
    ref: 'CustomerCategory',
    required
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required,
  },
  vehicleCategory: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleCategory',
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  regularVehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  vehicleDetails: {
    ownerName: {
      type: String,
      trim: true
    },
    ownerContact: {
      type: String,
      trim: true
    },
    ownerEmail: {
      type: String,
      trim: true
    },
    manufacturer: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    registrationNo: {
      type: String,
      trim: true
    },
  },
  ac: {
    type: Boolean,
    default: true,
  },
  packageFromProvidedVehicle: {
    packageCategory: {
      type: Schema.Types.ObjectId,
      ref: 'PackageCategory',
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
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
  staffCategory: {
    type: Schema.Types.ObjectId,
    ref: 'StaffCategory',
    default: null,
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    default: null
  },
  staffDetails: {
    name: {
      type: String,
      trim: true
    },
    contact: {
      type: String,
      trim: true,
      match: [contact, invalidContact]
    },
    license: {
      type: String,
      trim: true
    },
  },
  pickUpDateTime: {
    type: Date,
    required
  },
  dropDateTime: {
    type: Date,
    required
  },
  openingKm: {
    type: Number,
    default: 0,
  },
  closingKm: {
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
  extraHr: {
    type: Number,
    default: 0,
  },
  advancedPayment: {
    advancedFromCustomer: {
      type: Number,
      default: 0
    },
    advancedToCustomer: {
      type: Number,
      default: 0
    },
    advancedFromProvidedVehicle: {
      type: Number,
      default: 0
    },
    advancedToProvidedVehicle: {
      type: Number,
      default: 0
    }
  },
  otherCharges: {
    toll: {
      amount: {
        type: Number,
        default: 0
      },
      isChargeableToCustomer: {
        type: Boolean,
        default: false,
      }
    },
    parking: {
      amount: {
        type: Number,
        default: 0
      },
      isChargeableToCustomer: {
        type: Boolean,
        default: false,
      }
    },
    nightHalt: {
      amount: {
        type: Number,
        default: 0
      },
      isChargeableToCustomer: {
        type: Boolean,
        default: false,
      }
    },
    driverAllowance: {
      amount: {
        type: Number,
        default: 0
      },
      isChargeableToCustomer: {
        type: Boolean,
        default: false,
      }
    }
  },
  requestNo: {
    type: Number,
    unique: true,
    default: () => {
      const currentDate = new Date();
      return `${currentDate.getYear()}${currentDate.getDate()}${currentDate.getMonth()}${currentDate.getMilliseconds()}`;
    }
  },
  providedVehiclePayment: {
    type: Number,
    default: 0,
  },
  requestExpense: {
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

fixedRequestSchema.plugin(uniqueValidator);

module.exports = model('FixedRequest', fixedRequestSchema);
