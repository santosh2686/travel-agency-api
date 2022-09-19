const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const VehicleReport = require('../models/vehicleReport');

router.get('/', async (req, res, next) => {
  const { query } = req;
  const { filterData } = query
  const requestQuery = JSON.parse(filterData)

  const data = await VehicleReport
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
    const data = await VehicleReport.findById(id).select('-__v').lean();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const requestBody = req.body;
  const vehicleReport = new VehicleReport({
    _id: new mongoose.Types.ObjectId(),
    ...requestBody,
  });

  try {
    const data = await vehicleReport.save();
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
    const data = await VehicleReport.updateOne(
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
    await VehicleReport.deleteOne({ _id: id });
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
