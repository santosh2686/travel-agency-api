const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const AdvancedPayment = require('../models/advancedPayment');
const StaffAccount  = require('../models/staffAccount');

const { amountDifference, isYearMonthUpdated } = require('../utils');
const { getYear, getMonth } = require('../utils/date');

router.get('/', async (req, res, next) => {
  const { query } = req;
  const { filterData, sort = { paymentDate: -1 }, page = 1, limit = 10 } = query
  const queryLimit = parseInt(limit)
  const requestQuery = filterData ? JSON.parse(filterData) : {}

  const result = AdvancedPayment
    .find(requestQuery)
    .limit(queryLimit)
    .skip((page - 1) * queryLimit)
    .sort(sort)
    .populate('staff paymentMethod')
    .select('-__v')
    .lean();
  
  const count = AdvancedPayment.countDocuments(requestQuery)
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
    const data = await AdvancedPayment
      .findById(id)
      .select('-__v')
      .populate('staff paymentMethod')
      .lean();
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  const { body } = req;
  const {
    staff,
    staffCategory,
    paymentDate,
    amount
  } = body
  const request = new AdvancedPayment({
    _id: new mongoose.Types.ObjectId(),
    ...body
  });

  try {
    const filter = {
      year: getYear(paymentDate),
      month: getMonth(paymentDate),
      staff,
      staffCategory,
    };

    const requestData = {
      $inc: {
        advancePayment: amount,
      },
    };

    await StaffAccount.findOneAndUpdate(filter, requestData, {
      upsert: true,
    });

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
  const { params: { id }, body } = req;
  const {
    staff, staffCategory, amount, paymentDate,
  } = body
  let amountToUpdate = 0
  try {
    const originalData = await AdvancedPayment.findById(id).lean()
    const {
      staff: originalStaff,
      staffCategory: originalStaffCategory,
      amount: originalAmount,
      paymentDate: originalPaymentDate,
    } = originalData

    if (amount) {
      amountToUpdate = amountDifference(amount, originalAmount)

      const filter = {
        year: getYear(originalPaymentDate),
        month: getMonth(originalPaymentDate),
        staff: originalStaff,
        staffCategory: originalStaffCategory,
      };

      const requestData = {
        $inc: {
          advancePayment: amountToUpdate,
        },
      };

      await StaffAccount.findOneAndUpdate(filter, requestData, {
        upsert: true,
      });
    }

    if (paymentDate) {
      const shouldUpdateReport = isYearMonthUpdated(paymentDate, originalPaymentDate)
      if (shouldUpdateReport) {

        const originalFilter = {
          year: getYear(originalPaymentDate),
          month: getMonth(originalPaymentDate),
          staff: originalStaff,
          staffCategory: originalStaffCategory,
        }

        const originalRequestData = {
          $inc: {
            advancePayment: -(originalAmount + amountToUpdate),
          },
        }

        await StaffAccount.findOneAndUpdate(originalFilter, originalRequestData, {
          upsert: true,
        });

        const currentFilter = {
          year: getYear(paymentDate),
          month: getMonth(paymentDate),
          staff: originalStaff,
          staffCategory: originalStaffCategory,
        }

        const currentRequestData = {
          $inc: {
            advancePayment: originalAmount + amountToUpdate,
          },
        }

        await StaffAccount.findOneAndUpdate(currentFilter, currentRequestData, {
          upsert: true,
        });
      }
    }

    if(staff !== originalStaff && staffCategory !== originalStaffCategory) {
      const staffPaymentDate = paymentDate || originalPaymentDate

      const originalFilter = {
        staff: originalStaff,
        staffCategory: originalStaffCategory,
        year: getYear(staffPaymentDate),
        month: getMonth(staffPaymentDate),
      }

      const originalRequestData = {
        $inc: {
          advancePayment: -(originalAmount + amountToUpdate),
        },
      }

      await StaffAccount.findOneAndUpdate(originalFilter, originalRequestData, {
        upsert: true,
      });

      const currentStaffFilter = {
        staff,
        staffCategory,
        year: getYear(staffPaymentDate),
        month: getMonth(staffPaymentDate),
      }

      const currentStaffRequestData = {
        $inc: {
          advancePayment: originalAmount + amountToUpdate,
        },
      }

      await StaffAccount.findOneAndUpdate(currentStaffFilter, currentStaffRequestData, {
        upsert: true,
      });
    }

    const data = await AdvancedPayment.updateOne({ _id: id }, {
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
    const originalData = await AdvancedPayment.findById(id).lean()
    const {
      paymentDate, amount, staff, staffCategory,
    } = originalData

    const filter = {
      year: getYear(paymentDate),
      month: getMonth(paymentDate),
      staff,
      staffCategory,
    };

    const requestData = {
      $inc: {
        advancePayment: -amount,
      },
    };

    await StaffAccount.findOneAndUpdate(filter, requestData, {
      upsert: true,
    });

    await AdvancedPayment.deleteOne({ _id: id });
    res.status(200).json({
      message: 'deleted successfully',
      id
    })
  } catch (error) {
    next(error)
  }
});

module.exports = router;
