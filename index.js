const express = require('express');
const app = express();
// const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const port = process.env.PORT;

/*
const customerCategory = require('./src/routes/config/customerCategory');
const expenseCategory = require('./src/routes/config/expenseCategory');
const expenseType = require('./src/routes/config/expenseType');
const packageCategory = require('./src/routes/config/packageCategory');
const paymentMethod = require('./src/routes/config/paymentMethod');
const requestCategory = require('./src/routes/config/requestCategory');
const requestType = require('./src/routes/config/requestType');
const staffCategory = require('./src/routes/config/staffCategory')
const vehicleCategory = require('./src/routes/config/vehicleCategory');
const vehicleType = require('./src/routes/config/vehicleType');


// Routes import
const appConfig = require('./src/routes/appConfig');
const advancedBooking = require('./src/routes/advancedBooking');
const customer = require('./src/routes/customer');
const expense = require('./src/routes/expense');
const requestPackage = require('./src/routes/package');
const regularRequest = require('./src/routes/regularRequest');
const fixedRequest = require('./src/routes/fixedRequest');
const staff = require('./src/routes/staff');
const user = require('./src/routes/user');
const vehicle = require('./src/routes/vehicle');
const vehicleDetail = require('./src/routes/vehicleDetail');
const report = require('./src/routes/report');
const fixedVehiclePayment = require('./src/routes/fixedVehiclePayment');
const vehicleReport = require('./src/routes/vehicleReport');
const staffAccount = require('./src/routes/staffAccount');
const advancedPayment = require('./src/routes/advancedPayment');

const uri = 'mongodb+srv://admin:admin@travel.ecepf.mongodb.net/test?retryWrites=true&w=majority&ssl=true';
// mongodb+srv://admin:<password>@travel.ecepf.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
  useFindAndModify: false,
});

mongoose.connection.on("error", function(error) {
  console.log(error)
})

mongoose.connection.on("open", function() {
  console.log("Connected to MongoDB database.")
})

// mongoose.set('useCreateIndex', true)

// app.use(morgan('dev')); //Request Logging
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json()); // Make sure it comes back as json
app.use(compression());

// Handling CORS requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // instead of * we can specify the domain for which we need access. (* means global)
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next()
});
*/

//Routes which should handle requests
/*
app.use('/customer-category', customerCategory);
app.use('/expense-category', expenseCategory);
app.use('/expense-type', expenseType);
app.use('/package-category', packageCategory);
app.use('/payment-method', paymentMethod);
app.use('/request-category', requestCategory);
app.use('/request-type', requestType);
app.use('/staff-category', staffCategory);
app.use('/vehicle-category', vehicleCategory);
app.use('/vehicle-type', vehicleType);


app.use('/app-config', appConfig);

app.use('/advanced-booking', advancedBooking);
app.use('/customer', customer);
app.use('/expense', expense);
app.use('/package', requestPackage);
app.use('/regular-request', regularRequest);
app.use('/fixed-request', fixedRequest)
app.use('/staff', staff);
app.use('/user', user);
app.use('/vehicle', vehicle);
app.use('/vehicle-detail', vehicleDetail);
app.use('/report', report);
app.use('/vehicle-report', vehicleReport)
app.use('/fixed-vehicle-payment', fixedVehiclePayment)
app.use('/staff-account', staffAccount)
app.use('/advanced-payment', advancedPayment)

// Error Handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json(error)
});
*/
app.get('/', (req, res) => {
  res.json({ "message": "The app is working fine" })
})
app.listen(port, () => {
  console.log('travel-agency-api application running on port: ' + port);
});
