const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const AdvancedBooking = require('../models/advancedBooking');

router.get('/', async (req, res, next) => {
  const { query } = req;
  const { category, sort = { pickUpDateTime: -1 }, page = 1, limit = 10 } = query
  const queryLimit = parseInt(limit)
  const requestQuery = {
    category
  }

  const result = AdvancedBooking
    .find(requestQuery)
    .limit(queryLimit)
    .skip((page - 1) * queryLimit)
    .sort(sort)
    .populate('customer vehicleType', '_id name contact')
    .select('-__v')
    .lean();
  
  const count = AdvancedBooking.countDocuments(requestQuery)
  const [data, total] = await Promise.all([result, count])

  try {
    const response = {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    }
    res.status(200).send(response);
  } catch (error) {
    next(error)
  }
});

router.get('/:id', async (req, res, next) => {
  const { params: { id } } = req;
  try {
    const data = await AdvancedBooking
      .findById(id)
      .select('-__v')
      .populate('customer vehicleType', '_id name contact')
      .lean();
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  const { body } = req;
  const request = new AdvancedBooking({
    _id: new mongoose.Types.ObjectId(),
    ...body
  });

  try {
    const data = await request.save()
    res.status(201).json({
      message: 'added successful',
      data
    })
  } catch (error) {
    next(error)
  }
});
/*
    Path Format
    {
        "name":"pulses" // path of the field and value
    }
*/
router.patch('/:id', async (req, res, next) => {
  const { params: { id } } = req;
  try {
    const data = await AdvancedBooking.updateOne({ _id: id }, {
      $set: req.body
    })
    res.status(200).json({
      message: 'updated successful',
      data
    })
  } catch (error) {
    next(error)
  }
});

router.delete('/:id', async (req, res, next) => {
  const { params: { id } } = req;
  try {
    await AdvancedBooking.deleteOne({ _id: id });
    res.status(200).json({
      message: 'deleted successfully',
      id
    })
  } catch (error) {
    next(error)
  }
});

module.exports = router;
