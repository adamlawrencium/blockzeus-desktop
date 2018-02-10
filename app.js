const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const http = require('http');

<<<<<<< HEAD

const index = require('./routes/index');
=======
// ROUTES
const landingPage = require('./routes/landingPage/landingPage');
>>>>>>> master
const poloniex = require('./routes/poloniex/poloniex');


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'routes/landingPage')));
app.use(express.static(path.join(__dirname, 'client/build')));

<<<<<<< HEAD
app.use('/', index);
app.use
app.use('/poloniex/', poloniex);
=======
// LANDING PAGE
app.use('/', landingPage);
>>>>>>> master

// SEND REACT APP
app.get('/demo', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

// POLONIEX ROUTE
app.use('/poloniex/', poloniex);

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
