const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Report = require('../models/report');

router.get('/', async (req, res, next) => {
  const { query } = req;
  const data = await Report.find(query).select('-__v').lean();
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
    const data = await Report.findById(id).select('-__v').lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const requestBody = req.body;
  const report = new Report({
    _id: new mongoose.Types.ObjectId(),
    ...requestBody,
  });

  try {
    const data = await report.save();
    res.status(201).json({
      message: 'Added successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
});
/*
router.patch('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const data = await Report.updateOne(
      { _id: id },
      {
        $set: req.body,
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
  const id = req.params.id;
  try {
    await Report.deleteOne({ _id: id });
    res.status(200).json({
      message: 'Deleted successfully',
      id,
    });
  } catch (error) {
    next(error);
  }
});
*/
module.exports = router;
