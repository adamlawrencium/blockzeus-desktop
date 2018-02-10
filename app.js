const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const http = require('http');
const mongoose = require('mongoose')

// ROUTES
const landingPage = require('./routes/landingPage/landingPage');
const poloniex = require('./routes/poloniex/poloniex');
const auth = require('./routes/auth/auth');


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
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'routes/landingPage')));
app.use(express.static(path.join(__dirname, 'client/build')));

// LANDING PAGE
app.use('/', landingPage);

// SEND REACT APP
app.get('/demo', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

// POLONIEX ROUTE
app.use('/poloniex/', poloniex);
app.use('/auth/', auth);

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
