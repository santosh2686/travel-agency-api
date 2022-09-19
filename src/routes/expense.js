const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Expense = require('../models/expense');
const Report = require('../models/report');
const VehicleReport = require('../models/vehicleReport');

const { amountDifference, isYearMonthUpdated } = require('../utils');
const { getYear, getMonth } = require('../utils/date');

router.get('/', async (req, res, next) => {
  const { query } = req;
  const { filterData, sort = { date: -1 }, page = 1, limit = 10 } = query
  const queryLimit = parseInt(limit)
  const requestQuery = JSON.parse(filterData)

  const result = Expense
    .find(requestQuery)
    .limit(queryLimit)
    .skip((page - 1) * queryLimit)
    .sort(sort)
    .populate('type paymentMethod vehicle staff', '_id name registrationNo firstName lastName')
    .select('-__v')
    .lean();
  
  const count = Expense.countDocuments(requestQuery)
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
    const data = await Expense
      .findById(id)
      .select('-__v')
      .populate('type paymentMethod vehicle staff', '_id name registrationNo firstName lastName')
      .lean();
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  const { body } = req;
  const { amount, date, vehicle, vehicleCategory } = body;

  const request = new Expense({
    _id: new mongoose.Types.ObjectId(),
    ...body
  });

  try {
    const data = await request.save()
    const filter = {
      year: getYear(date),
      month: getMonth(date),
    };

    const requestData = {
      $inc: {
        expense: amount,
      },
    };

    await Report.findOneAndUpdate(filter, requestData, {
      upsert: true,
    });

    if (vehicle && vehicleCategory) {
      const vehicleFilter = {
        year: getYear(date),
        month: getMonth(date),
        vehicle,
        vehicleCategory,
      }

      const vehicleRequestData = {
        $inc: {
          expense: amount,
        },
      }

      await VehicleReport.findOneAndUpdate(vehicleFilter, vehicleRequestData, {
        upsert: true,
      });
    }

    res.status(201).json({
      message: 'added successful',
      data
    })
  } catch (error) {
    next(error)
  }
});

/*
if amount change: see the amount difference with original amount and update in the report,
get the original date and month for filter

if date has change make new entry for report and decrement the expense from original year and month
*/

router.patch('/:id', async (req, res, next) => {
  const { params: { id }, body } = req;
  try {
    const {
      amount, date, vehicle, vehicleCategory,
    } = body
    const originalData = await Expense.findById(id).lean()
    const {
      date: originalDate, amount: originalAmount,
      vehicle: originalVehicle, vehicleCategory: originalVehicleCategory
    } = originalData
    let amountToUpdate = 0

    if(amount) {
      amountToUpdate = amountDifference(amount, originalAmount)

      const filter = {
        year: getYear(originalDate),
        month: getMonth(originalDate),
      };
  
      const requestData = {
        $inc: {
          expense: amountToUpdate,
        },
      };
  
      await Report.findOneAndUpdate(filter, requestData, {
        upsert: true,
      });

       const vehicleFilter = {
        year: getYear(originalDate),
        month: getMonth(originalDate),
        vehicle: originalVehicle,
        vehicleCategory: originalVehicleCategory
       }
       
       const vehicleRequestData = {
        $inc: {
          expense: amountToUpdate,
        },
       }

       await VehicleReport.findOneAndUpdate(vehicleFilter, vehicleRequestData, {
        upsert: true,
      });
    }
    
    if(date) {
      const shouldUpdateReport = isYearMonthUpdated(date, originalDate)

      if (shouldUpdateReport) {
        const originalFilter = {
          year: getYear(originalDate),
          month: getMonth(originalDate)
        }

        const originalRequestData = {
          $inc: {
            expense: -(originalAmount + amountToUpdate),
          },
        }

        await Report.findOneAndUpdate(originalFilter, originalRequestData, {
          upsert: true,
        });

        const vehicleFilter = {
          year: getYear(originalDate),
          month: getMonth(originalDate),
          vehicle: originalVehicle,
          vehicleCategory: originalVehicleCategory
         }

        await VehicleReport.findOneAndUpdate(vehicleFilter, originalRequestData, {
          upsert: true,
        });

        const currentFilter = {
          year: getYear(date),
          month: getMonth(date)
        }

        const currentRequestData = {
          $inc: {
            expense: originalAmount + amountToUpdate,
          },
        }
        
        await Report.findOneAndUpdate(currentFilter, currentRequestData, {
          upsert: true,
        });

        const vehicleCurrentFilter = {
          year: getYear(date),
          month: getMonth(date),
          vehicle: originalVehicle,
          vehicleCategory: originalVehicleCategory
         }

         await VehicleReport.findOneAndUpdate(vehicleCurrentFilter, currentRequestData, {
          upsert: true,
        });
      }
    }

    if (vehicle !== originalVehicle && vehicleCategory !== originalVehicleCategory) {
      const vehicleExpenseDate = date || originalDate

      const originalFilter = {
        vehicle: originalVehicle,
        vehicleCategory: originalVehicleCategory,
        year: getYear(vehicleExpenseDate),
        month: getMonth(vehicleExpenseDate),
      }

      const originalRequestData = {
        $inc: {
          expense: -(originalAmount + amountToUpdate),
        },
      }

      await VehicleReport.findOneAndUpdate(originalFilter, originalRequestData, {
        upsert: true,
      });

      const currentVehicleFilter = {
        vehicle,
        vehicleCategory,
        year: getYear(vehicleExpenseDate),
        month: getMonth(vehicleExpenseDate),
      }

      const currentVehicleRequestData = {
        $inc: {
          expense: originalAmount + amountToUpdate,
        },
      }

      await VehicleReport.findOneAndUpdate(currentVehicleFilter, currentVehicleRequestData, {
        upsert: true,
      });
    }

    const data = await Expense.updateOne({ _id: id }, {
      $set: body
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
    const originalData = await Expense.findById(id).lean()
    const { amount, date, vehicle, vehicleCategory } = originalData

    const filter = {
      year: getYear(date),
      month: getMonth(date),
    };

    const requestData = {
      $inc: {
        expense: -amount,
      },
    };

    await Report.findOneAndUpdate(filter, requestData, {
      upsert: true,
    });

    if (vehicle && vehicleCategory) {
      const vehicleFilter = {
        year: getYear(date),
        month: getMonth(date),
        vehicle,
        vehicleCategory,
      }

      const vehicleRequestData = {
        $inc: {
          expense: -amount,
        },
      }
      await VehicleReport.findOneAndUpdate(vehicleFilter, vehicleRequestData, {
        upsert: true,
      });
    }

    await Expense.deleteOne({ _id: id });
    res.status(200).json({
      message: 'deleted successfully',
      id
    })
  } catch (error) {
    next(error)
  }
});

module.exports = router;
