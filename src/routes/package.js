const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Package = require('../models/package');

router.get('/', async (req, res, next) => {
  const { query, sort } = req;
  const { filterData } = query
  const requestQuery = JSON.parse(filterData)
  const data = await Package
    .find(requestQuery)
    .sort(sort)
    .select('-__v')
    .lean();
  try {
    const response = {
      data,
      total: data.length,
    }
    res.status(200).send(response);
  } catch (error) {
    next(error)
  }
});

router.get('/:id', async (req, res, next) => {
  const { params: { id } } = req;
  try {
    const data = await Package
      .findById(id)
      .select('-__v')
      .lean();
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  const { body } = req;
  const request = new Package({
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
    const data = await Package.updateOne({ _id: id }, {
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
    await Package.deleteOne({ _id: id });
    res.status(200).json({
      message: 'deleted successfully',
      id
    })
  } catch (error) {
    next(error)
  }
});

module.exports = router;
