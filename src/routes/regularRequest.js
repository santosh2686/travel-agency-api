const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const RegularRequest = require('../models/regularRequest');
const RequestType = require('../models/config/requestType');
const Report = require('../models/report');
const VehicleReport = require('../models/vehicleReport');

const { amountDifference } = require('../utils');
const { getYear, getMonth } = require('../utils/date');

router.get('/', async (req, res, next) => {
  const { query } = req;
  const { filterData, sort = { pickUpDateTime: -1 }, page = 1, limit = 10 } = query
  const queryLimit = parseInt(limit)
  const requestQuery = JSON.parse(filterData)
  const requestData = RegularRequest
    .find(requestQuery)
    .limit(queryLimit)
    .skip((page - 1) * queryLimit)
    .sort(sort)
    .populate('customer requestType package staff vehicle packageFromProvidedVehicle.package')
    .select('-__v')
    .lean();
  const count = RegularRequest.countDocuments(requestQuery);
  const result = await Promise.all([requestData, count]);
  const data = result[0]
  const total = result[1]
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
    const data = await RegularRequest
      .findById(id)
      .populate('customer requestType package staff vehicle packageFromProvidedVehicle.package')
      .select('-__v')
      .lean();
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  const { body } = req;
  const {
    requestProfit, dropDateTime, vehicle, vehicleCategory,
    requestType,
  } = body;

  const request = new RegularRequest({
    _id: new mongoose.Types.ObjectId(),
    ...body
  });

  try {
    const data = await request.save()
    const requestYear = getYear(dropDateTime)
    const requestMonth = getMonth(dropDateTime)

    const filter = {
      year: requestYear,
      month: requestMonth,
    };

    const requestData = {
      $inc: {
        income: requestProfit,
      },
    };
  
    await Report.findOneAndUpdate(filter, requestData, {
      upsert: true,
    });

    if (vehicleCategory && vehicle) {
      const requestTypeData = await RequestType.findById(requestType).lean();
      const { name: requestTypeName } = requestTypeData
      const isLocalRequest = requestTypeName === 'local'
  
      const vehicleReportFilter = {
        year: requestYear,
        month: requestMonth,
        vehicle,
        vehicleCategory,
      }
  
      const vehicleReportRequestData = {
        $inc: {
          income: requestProfit,
          totalLocalRequests: isLocalRequest ? 1 : 0,
          totalOutStationRequests: isLocalRequest ? 0 : 1,
        },
      }
  
      await VehicleReport.findOneAndUpdate(vehicleReportFilter, vehicleReportRequestData, {
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
    Path Format
    {
        "name":"pulses" // path of the field and value
    }
*/
// TODO: if request type changes on edit
router.patch('/:id', async (req, res, next) => {
  const { params: { id }, body } = req;
  try {
    const {
      requestProfit, dropDateTime,
    } = body
    if (requestProfit) {
      const originalData = await RegularRequest.findById(id).lean()
      const {
        requestProfit: originalRequestProfit, dropDateTime: originalDropDateTime,
        vehicle, vehicleCategory,
      } = originalData
      const amountToUpdate = amountDifference(requestProfit, originalRequestProfit)
      const requestDropDateTime = dropDateTime || originalDropDateTime
      const requestYear = getYear(requestDropDateTime)
      const requestMonth = getMonth(requestDropDateTime)

      const filter = {
        year: requestYear,
        month: requestMonth,
      };
  
      const requestData = {
        $inc: {
          income: amountToUpdate,
        },
      };

      await Report.findOneAndUpdate(filter, requestData, {
        upsert: true,
      });

      if (vehicleCategory && vehicle) {
        const vehicleReportFilter = {
          year: requestYear,
          month: requestMonth,
          vehicle,
          vehicleCategory,
        }
  
        await VehicleReport.findOneAndUpdate(vehicleReportFilter, requestData, {
          upsert: true,
        });
      }
    }
    const data = await RegularRequest.updateOne({ _id: id }, {
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
    const originalData = await RegularRequest.findById(id).lean()
    const {
      requestProfit, dropDateTime, vehicleCategory, vehicle, requestType,
    } = originalData
    const requestYear = getYear(dropDateTime)
    const requestMonth = getMonth(dropDateTime)

    const filter = {
      year: requestYear,
      month: requestMonth,
    };

    const requestData = {
      $inc: {
        income: -requestProfit,
      },
    };

    await Report.findOneAndUpdate(filter, requestData, {
      upsert: true,
    });

    if (vehicleCategory && vehicle) {
      const requestTypeData = await RequestType.findById(requestType).lean();
      const { name: requestTypeName } = requestTypeData
      const isLocalRequest = requestTypeName === 'local'

      const vehicleReportFilter = {
        year: requestYear,
        month: requestMonth,
        vehicle,
        vehicleCategory,
      }
      const vehicleReportRequestData = {
        $inc: {
          income: -requestProfit,
          totalLocalRequests: isLocalRequest ? -1 : 0,
          totalOutStationRequests: isLocalRequest ? 0 : -1,
        },
      }
      await VehicleReport.findOneAndUpdate(vehicleReportFilter, vehicleReportRequestData, {
        upsert: true,
      });
    }

    await RegularRequest.deleteOne({ _id: id });
    res.status(200).json({
      message: 'deleted successfully',
      id
    })
  } catch (error) {
    next(error)
  }
});

module.exports = router;
