const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ExpenseType = require('../../models/config/expenseType');

router.get('/', async (req, res, next) => {
  const { query, sort } = req;
  const data = await ExpenseType
    .find(query)
    .sort(sort)
    .select('-__v')
    .lean();
  try {
    const response = {
      count: data.length,
      data,
    }
    res.status(200).send(response);
  } catch (error) {
    next(error)
  }
});

router.get('/:id', async (req, res, next) => {
  const { params: { id } } = req;
  try {
    const data = await ExpenseType
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
  const request = new ExpenseType({
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
    const data = await ExpenseType.updateOne({ _id: id }, {
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
    await ExpenseType.deleteOne({ _id: id });
    res.status(200).json({
      message: 'deleted successfully',
      id
    })
  } catch (error) {
    next(error)
  }
});

module.exports = router;
