const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema, model } = mongoose;
const { messages } = require('../../utils');
const { required } = messages
// regular, operators
const customerCategorySchema = Schema({
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

customerCategorySchema.plugin(uniqueValidator);

module.exports = model('CustomerCategory', customerCategorySchema);
