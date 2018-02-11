const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const expressValidator = require('express-validator');


// Controllers
const landingPage = require('./app/landingPage/landingPage');
const poloniex = require('./app/poloniex/poloniex');
const userController = require('./app/user/user.controller');

// Models
const User = require('./app/user/user.model');


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });


const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_URI, { useMongoClient: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'routes/landingPage')));
app.use(express.static(path.join(__dirname, 'client/build')));


/**
 * Auth Middleware
 */
app.use((req, res, next) => {
  req.isAuthenticated = function () {
    // console.log(req.headers.authorization);
    const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    try {
      console.log(token);
      console.log(process.env.JWT_SECRET);
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return false;
    }
  };
  if (req.isAuthenticated()) {
    const payload = req.isAuthenticated();
    // console.log(payload);
    User.findById(payload.sub, (err, user) => {
      req.user = user;
      next();
    });
  } else {
    next();
  }
});


// SEND REACT APP
app.get('/demo', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

// ROUTES
app.use('/', landingPage);
app.use('/poloniex/', poloniex);
app.post('/signup', userController.signupPost);
app.post('/login', userController.loginPost);

app.get('/privbro', userController.ensureAuthenticated, (req, res) => {
  res.json('hi');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('unhandledRejection', r => console.log(r));

module.exports = app;

setInterval(() => {
  http.get('http://blockzeus.herokuapp.com');
}, 300000); // every 5 minutes (300000)
