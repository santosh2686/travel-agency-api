const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema, model } = mongoose;
const { messages } = require('../../utils');
const { required } = messages

// own, indirect, operator, other
// along with owner details

const vehicleCategorySchema = Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required,
    unique: true,
    uniqueCaseInsensitive: true,
    trim: true
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

vehicleCategorySchema.plugin(uniqueValidator);

module.exports = model('VehicleCategory', vehicleCategorySchema);
