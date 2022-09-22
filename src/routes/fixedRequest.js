const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const FixedRequest = require('../models/fixedRequest');
const RequestType = require('../models/config/requestType');
const FixedVehiclePayment = require('../models/fixedVehiclePayment');
const VehicleReport = require('../models/vehicleReport');

const { amountDifference } = require('../utils');
const { getYear, getMonth } = require('../utils/date');

router.get('/', async (req, res, next) => {
  const { query } = req;
  const { filterData, sort = { pickUpDateTime: -1 }, page = 1, limit = 10 } = query
  const queryLimit = parseInt(limit)
  const requestQuery = JSON.parse(filterData)
  const requestData = FixedRequest
    .find(requestQuery)
    .limit(queryLimit)
    .skip((page - 1) * queryLimit)
    .sort(sort)
    .populate('customer requestType vehicle staff packageFromProvidedVehicle.package')
    .select('-__v')
    .lean();
  const count = FixedRequest.countDocuments(requestQuery);
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
    const data = await FixedRequest
      .findById(id)
      .select('-__v')
      .populate('customer requestType package staff vehicle packageFromProvidedVehicle.package')
      .populate({
        path: 'vehicle',
        populate: {
          path: 'monthlyFixedDetails.customer monthlyFixedDetails.staff monthlyFixedDetails.package'
        }
      })
      .lean();
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
});

const getTotalOtherCharges = (otherCharges = {}) => {
  const { toll, parking, nightHalt, driverAllowance } = otherCharges
  return {
    toll: toll.isChargeableToCustomer ? toll.amount : 0,
    parking: parking.isChargeableToCustomer ? parking.amount : 0,
    nightHalt: nightHalt.isChargeableToCustomer ? nightHalt.amount : 0,
    driverAllowance: driverAllowance.isChargeableToCustomer ? driverAllowance.amount : 0,
  }
}

router.post('/', async (req, res, next) => {
  const { body } = req;
  const {
    dropDateTime, requestType, totalKm, totalHr,
    extraHr, regularVehicle, otherCharges, requestPackage,
    vehicleCategory, vehicle,
  } = body

  const requestTypeData = await RequestType.findById(requestType).lean();
  const { name: requestTypeName } = requestTypeData

  const isLocalRequest = requestTypeName === 'local'
  const requestYear = getYear(dropDateTime)
  const requestMonth = getMonth(dropDateTime)

  const filter = {
    vehicle: regularVehicle,
    year: requestYear,
    month: requestMonth,
  }

  const {
    toll, parking, nightHalt, driverAllowance,
  } = getTotalOtherCharges(otherCharges)

  const requestData = {
    requestPackage,
    $inc: {
      totalKm,
      totalHr,
      totalExtraHr: extraHr,
      totalToll: toll,
      totalParking: parking,
      totalNightHalt: nightHalt,
      totalDriverAllowance: driverAllowance,
      totalLocalRequests: isLocalRequest ? 1 : 0,
      totalOutStationRequests: isLocalRequest ? 0 : 1,
    },
  }

  const request = new FixedRequest({
    _id: new mongoose.Types.ObjectId(),
    ...body
  });

  try {
    await FixedVehiclePayment.findOneAndUpdate(filter, requestData, {
      upsert: true,
    });

    if (vehicleCategory && vehicle) {
      const vehicleReportFilter = {
        year: requestYear,
        month: requestMonth,
        vehicle,
        vehicleCategory,
      }

      const vehicleReportRequestData = {
        $inc: {
          totalLocalRequests: isLocalRequest ? 1 : 0,
          totalOutStationRequests: isLocalRequest ? 0 : 1,
        },
      }
      await VehicleReport.findOneAndUpdate(vehicleReportFilter, vehicleReportRequestData, {
        upsert: true,
      });
    }

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
    dropDateTime, otherCharges = {}, totalKm, totalHr,
    extraHr, requestType, vehicleCategory, vehicle,
  } = body
  try {
    let totalRequestCount = {}
    const originalData = await FixedRequest.findById(id).lean()
    const {
      dropDateTime: originalDropDateTime, regularVehicle,
      otherCharges: originalOtherCharges,
      totalKm: originalTotalKm,
      totalHr: originalTotalHr,
      extraHr: originalExtraHr,
      requestType: originalRequestType,
      vehicleCategory: originalVehicleCategory,
      vehicle: originalVehicle
    } = originalData
    const requestDropDateTime = dropDateTime || originalDropDateTime
    const vehicleReportVehicleCategory = vehicleCategory || originalVehicleCategory
    const vehicleReportVehicle = vehicle || originalVehicle

    const {
      toll, parking, nightHalt, driverAllowance,
    } = getTotalOtherCharges(otherCharges)

    const {
      toll: originalToll, parking: originalParking,
      nightHalt: originalNightHalt, driverAllowance: originalDriverAllowance,
    } = getTotalOtherCharges(originalOtherCharges)

    if (requestType !== originalRequestType) {
      const requestTypeData = await RequestType.findById(requestType).lean();
      const { name: requestTypeName } = requestTypeData
      const isLocalRequest = requestTypeName === 'local'
      totalRequestCount = {
        totalLocalRequests: isLocalRequest ? 1 : -1,
        totalOutStationRequests: isLocalRequest ? -1 : 1,
      }
      if (vehicleReportVehicleCategory && vehicleReportVehicle) {
          const vehicleReportFilter = {
            vehicleCategory: vehicleReportVehicleCategory,
            vehicle: vehicleReportVehicle,
            year: getYear(requestDropDateTime),
            month: getMonth(requestDropDateTime),
          }

          const vehicleReportRequestData = {
            $inc: totalRequestCount,
          }

          await VehicleReport.findOneAndUpdate(vehicleReportFilter, vehicleReportRequestData, {
            upsert: true,
          });
      }
    }

    const filter = {
      vehicle: regularVehicle,
      year: getYear(requestDropDateTime),
      month: getMonth(requestDropDateTime),
    }

    const requestData = {
      $inc: {
        totalKm: amountDifference(totalKm, originalTotalKm),
        totalHr: amountDifference(totalHr, originalTotalHr),
        totalExtraHr: amountDifference(extraHr, originalExtraHr),
        totalToll: amountDifference(toll, originalToll),
        totalParking: amountDifference(parking, originalParking),
        totalNightHalt: amountDifference(nightHalt, originalNightHalt),
        totalDriverAllowance: amountDifference(driverAllowance, originalDriverAllowance),
        ...totalRequestCount,
      }
    }

    await FixedVehiclePayment.findOneAndUpdate(filter, requestData, {
      upsert: true,
    });

    const data = await FixedRequest.updateOne({ _id: id }, {
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
    const originalData = await FixedRequest.findById(id).lean()
    const {
      dropDateTime, regularVehicle, otherCharges, requestType,
      totalKm, totalHr, extraHr, vehicleCategory, vehicle,
    } = originalData

    const requestTypeData = await RequestType.findById(requestType).lean();
    const { name: requestTypeName } = requestTypeData

    const isLocalRequest = requestTypeName === 'local'
    const requestYear = getYear(dropDateTime)
    const requestMonth = getMonth(dropDateTime)

    const filter = {
      vehicle: regularVehicle,
      year: requestYear,
      month: requestMonth,
    }

    const {
      toll, parking, nightHalt, driverAllowance,
    } = getTotalOtherCharges(otherCharges)

    const requestData = {
      $inc: {
        totalKm: -totalKm,
        totalHr: -totalHr,
        totalExtraHr: -extraHr,
        totalToll: -toll,
        totalParking: -parking,
        totalNightHalt: -nightHalt,
        totalDriverAllowance: -driverAllowance,
        totalLocalRequests: isLocalRequest ? -1 : 0,
        totalOutStationRequests: isLocalRequest ? 0 : -1,
      },
    }

    await FixedVehiclePayment.findOneAndUpdate(filter, requestData, {
      upsert: true,
    });

    if (vehicleCategory && vehicle) {
      const vehicleReportFilter = {
        year: requestYear,
        month: requestMonth,
        vehicle,
        vehicleCategory,
      }

      const vehicleReportRequestData = {
        $inc: {
          totalLocalRequests: isLocalRequest ? -1 : 0,
          totalOutStationRequests: isLocalRequest ? 0 : -1,
        },
      }
      await VehicleReport.findOneAndUpdate(vehicleReportFilter, vehicleReportRequestData, {
        upsert: true,
      });
    }

    await FixedRequest.deleteOne({ _id: id });
    res.status(200).json({
      message: 'deleted successfully',
      id
    })
  } catch (error) {
    next(error)
  }
});

module.exports = router;
