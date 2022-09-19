const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const CustomerCategory = require('../models/config/customerCategory');
const ExpenseCategory = require('../models/config/expenseCategory');
const ExpenseType = require('../models/config/expenseType');
const PackageCategory = require('../models/config/packageCategory');
const PaymentMethod = require('../models/config/paymentMethod');
const RequestCategory = require('../models/config/requestCategory');
const RequestType = require('../models/config/requestType');
const StaffCategory = require('../models/config/staffCategory');
const VehicleCategory = require('../models/config/vehicleCategory');
const VehicleType = require('../models/config/vehicleType');

const keyMap = {
  customerCategory: CustomerCategory,
  expenseCategory: ExpenseCategory,
  expenseType: ExpenseType,
  packageCategory: PackageCategory,
  paymentMethod: PaymentMethod,
  requestCategory: RequestCategory,
  staffCategory: StaffCategory,
  vehicleCategory: VehicleCategory,
  vehicleType: VehicleType,
}

router.get('/', async (_, res, next) => {
  const customerCategory = CustomerCategory.find().select('-__v -createdAt').lean();
  const expenseCategory = ExpenseCategory.find().select('-__v -createdAt').lean();
  const expenseType = ExpenseType.find().select('-__v -createdAt').lean();
  const packageCategory = PackageCategory.find().select('-__v -createdAt').lean();
  const paymentMethod = PaymentMethod.find().select('-__v -createdAt').lean();
  const requestCategory = RequestCategory.find().select('-__v -createdAt').lean();
  const requestType = RequestType.find().select('-__v -createdAt').lean();
  const staffCategory = StaffCategory.find().select('-__v -createdAt').lean();
  const vehicleCategory = VehicleCategory.find().select('-__v -createdAt').lean();
  const vehicleType = VehicleType.find().select('-__v -createdAt').lean();

  const data = await Promise.all([
    customerCategory, expenseCategory, expenseType,
    packageCategory, paymentMethod, requestCategory,
    requestType, staffCategory, vehicleCategory, vehicleType,
  ])

  try {
    const response = {
      customerCategory: data[0],
      expenseCategory: data[1],
      expenseType: data[2],
      packageCategory: data[3],
      paymentMethod: data[4],
      requestCategory: data[5],
      requestType: data[6],
      staffCategory: data[7],
      vehicleCategory: data[8],
      vehicleType: data[9]
    }
    res.status(200).send(response);
  } catch (error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  const { body } = req;
  const { key, name, comment } = body

  const model = keyMap[key]

  const modelInstance = new model({
    _id: new mongoose.Types.ObjectId(),
    name,
    comment,
  });

  try {
    const data = await modelInstance.save();
    res.status(201).json({
      message: 'Added successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  const { body, params: { id } } = req;
  const { key, name, comment = '' } = body
  const model = keyMap[key]
  try {
    const data = await model.updateOne(
      { _id: id },
      {
        $set: {
          name,
          comment,
        },
      }
    );
    res.status(200).json({
      message: 'Updated successful',
      data
    })
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { body, params: { id } } = req;
  const { key } = body
  const model = keyMap[key]
  try {
    await model.deleteOne({ _id: id });
    res.status(200).json({
      message: 'Deleted successfully',
      id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
