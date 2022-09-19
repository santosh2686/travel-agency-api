const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema, model } = mongoose;

const { validationPattern, messages } = require('../utils');
const { contact, email } = validationPattern
const { required, invalidEmail, invalidContact } = messages

const regularRequestSchema = Schema({
  _id: Schema.Types.ObjectId,
  requestType: {
    type: Schema.Types.ObjectId,
    ref: 'RequestType',
    required,
  },
  customerType: {
    type: String,
    enum: ['existing', 'new'],
    default: 'existing'
  },
  vehicleType: {
    type: String,
    enum: ['existing', 'new'],
    default: 'existing'
  },
  staffType: {
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
  vehicleCategory: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleCategory',
    default: null,
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null
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
  packageCategory: {
    type: Schema.Types.ObjectId,
    ref: 'PackageCategory',
    required,
  },
  package: {
    type: Schema.Types.ObjectId,
    ref: 'Package',
    required,
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
  paymentDetails: {
    status: {
      type: String,
      enum: ['', 'BILL_GENERATED', 'BILL_SENT_TO_CUSTOMER', 'PAYMENT_RECEIVED'],
      default: '',
    },
    paymentDate: {
      type: Date,
    },
    paymentMethod: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentMethod',
      default: null,
    },
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
  requestTotal: {
    type: Number,
    default: 0,
  },
  providedVehiclePayment: {
    type: Number,
    default: 0,
  },
  requestExpense: {
    type: Number,
    default: 0,
  },
  requestProfit: {
    type: Number,
    default: 0,
  },
  customerBill: {
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

regularRequestSchema.plugin(uniqueValidator);

module.exports = model('RegularRequest', regularRequestSchema);
