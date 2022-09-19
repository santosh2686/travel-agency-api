const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const StaffAccount = require('../models/staffAccount');

router.get('/', async (req, res, next) => {
  const { query } = req;
  const { filterData } = query
  const requestQuery = filterData ? JSON.parse(filterData) : {}

  const data = await StaffAccount
  .find(requestQuery)
  .select('-__v')
  .lean();

  try {
    const response = {
      data
    }
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await StaffAccount.findById(id).select('-__v').lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const requestBody = req.body;
  const staffAccount = new StaffAccount({
    _id: new mongoose.Types.ObjectId(),
    ...requestBody,
  });

  try {
    const data = await staffAccount.save();
    res.status(201).json({
      message: 'Added successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
