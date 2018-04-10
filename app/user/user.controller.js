const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const request = require('request');
const User = require('./user.model');

function generateToken(user) {
  const payload = {
    iss: 'my.domain.com',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix(),
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
}

/**
 * Login required middleware
 */
exports.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    console.log("I'M AUTHENTICATED YO");
    next();
  } else {
    console.log('isnt authenticated');
    res.status(401).send({ msg: 'Unauthorized. wrekt.' });
  }
};
/**
   * POST /login
   * Sign in with email and password
   */
exports.loginPost = function (req, res) {
  console.log(req.body);
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    return res.status(400).send(errors);
  }

  console.log('tryna login');

  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.status(401).send([{ // wrapped in array to match express-validator asserts
        msg: `The email address ${req.body.email} is not associated with any account. ` +
          'Double-check your email address and try again.',
      }]);
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(401).send([{ msg: 'Invalid email or password' }]);
      }
      res.send({ token: generateToken(user), accountInfo: user.toJSON() });
    });
  });
};

/**
 * POST /signup
 */
exports.signupPost = function (req, res) {
  // req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirm', 'Passwords must match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();
  console.log('shits wrong', errors);
  console.log('reqbody', req.body);
  if (errors) {
    return res.status(400).send(errors);
  }

  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      console.log('user already in db');
      return res.status(400).send([{
        msg: 'The email address you have entered is already associated with another account.',
      }]);
    }
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    user.save((err) => {
      if (!err) {
        res.send({ token: generateToken(user), accountInfo: user.toJSON() });
      } else {
        throw Error(err);
      }
    });
  });
};


/**
 * PUT /account
 * Updates the following:
 * - email
 * - password
 * - name
 * - poloniexKey
 * - poloniexSecret
 */
exports.accountPut = function (req, res) {
  if ('password' in req.body) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);
  } else {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
  }
  console.log(req.body);
  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  User.findById(req.user.id, (err, user) => {
    if ('password' in req.body) {
      user.password = req.body.password;
    } else {
      user.email = req.body.email;
      user.name = req.body.name;
      user.poloniexKey = req.body.poloniexKey;
      user.poloniexSecret = req.body.poloniexSecret;
    }
    user.save((err) => {
      if ('password' in req.body) {
        res.send({ msg: 'Your password has been changed.' });
      } else if (err && err.code === 11000) {
        res.status(409).send({ msg: 'The email address you have entered is already associated with another account.' });
      } else {
        res.send({ accountInfo: user, msg: 'Your profile information has been updated.' });
      }
    });
  });
};

exports.poloniexPut = function (req, res) {
  if (!req.body.poloniexKey && !req.body.poloniexSecret) {
    res.send({ msg: 'Invalid req' });
    return;
  }
  User.findById(req.user.id, (err, user) => {
    if (!user) {
      return res.status(401).send([{ // wrapped in array to match express-validator asserts
        msg: 'Can\'t find user, shits messed up',
      }]);
    }
    user.poloniexKey = req.body.poloniexKey;
    user.poloniexSecret = req.body.poloniexSecret;
    user.save((err) => {
      if (err) {
        res.send({ msg: err });
      } else {
        res.send({ accountInfo: user });
      }
    });
  });
};

exports.verifyPoloniex = function (req, res) {
  User.findById(req.user.id, (err, user) => {
    if (!user) {
      return res.status(401).send([{ // wrapped in array to match express-validator asserts
        msg: 'Can\'t find user, shits messed up',
      }]);
    }
    user.poloniexVerified = 'true';
    user.save((err) => {
      if (err) {
        res.send({ msg: err });
      } else {
        console.log('saved in db', user);
        res.send(user);
      }
    });
  });
};


/**
 * DELETE /account
 */
exports.accountDelete = function (req, res) {
  User.remove({ _id: req.user.id }, (err) => {
    if (!err) {
      res.send({ msg: 'Your account has been permanently deleted.' });
    } else {
      throw Error(err);
    }
  });
};

/**
 * GET /unlink/:provider
 */
exports.unlink = function (req, res) {
  User.findById(req.user.id, (err, user) => {
    switch (req.params.provider) {
      case 'facebook':
        user.facebook = undefined;
        break;
      case 'google':
        user.google = undefined;
        break;
      case 'twitter':
        user.twitter = undefined;
        break;
      case 'vk':
        user.vk = undefined;
        break;
      case 'github':
        user.github = undefined;
        break;
      default:
        return res.status(400).send({ msg: 'Invalid OAuth Provider' });
    }
    user.save((err) => {
      if (!err) {
        res.send({ msg: 'Your account has been unlinked.' });
      } else {
        throw Error(err);
      }
    });
  });
};

/**
 * POST /forgot
 */
exports.forgotPost = function (req, res) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  async.waterfall([
    function (done) {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          return res.status(400).send({ msg: `The email address ${req.body.email} is not associated with any account.` });
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
        user.save((err) => {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      const transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD,
        },
      });
      const mailOptions = {
        to: user.email,
        from: 'support@yourdomain.com',
        subject: '✔ Reset your password on Mega Boilerplate',
        text: `${'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://'}${req.headers.host}/reset/${token}\n\n` +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };
      transporter.sendMail(mailOptions, (err) => {
        res.send({ msg: `An email has been sent to ${user.email} with further instructions.` });
        done(err);
      });
    },
  ]);
};

/**
 * POST /reset
 */
exports.resetPost = function (req, res) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirm', 'Passwords must match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  async.waterfall([
    function (done) {
      User.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec((err, user) => {
          if (!user) {
            return res.status(400).send({ msg: 'Password reset token is invalid or has expired.' });
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save((err) => {
            done(err, user);
          });
        });
    },
    function (user) {
      const transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD,
        },
      });
      const mailOptions = {
        from: 'support@yourdomain.com',
        to: user.email,
        subject: 'Your Mega Boilerplate password has been changed',
        text: `${'Hello,\n\n' +
          'This is a confirmation that the password for your account '}${user.email} has just been changed.\n`,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (!err) {
          res.send({ msg: 'Your password has been changed successfully.' });
        } else {
          throw Error(err);
        }
      });
    },
  ]);
};
/**
 * POST /auth/google
 * Sign in with Google
 */
exports.authGoogle = function (req, res) {
  const accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  const peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

  const params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code',
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, (err, response, token) => {
    const accessToken = token.access_token;
    const headers = { Authorization: `Bearer ${accessToken}` };

    // Step 2. Retrieve user's profile information.
    request.get({ url: peopleApiUrl, headers, json: true }, (err, response, profile) => {
      if (profile.error) {
        return res.status(500).send({ message: profile.error.message });
      }
      // Step 3a. Link accounts if user is authenticated.
      if (req.isAuthenticated()) {
        User.findOne({ google: profile.sub }, (err, user) => {
          if (user) {
            return res.status(409).send({ msg: 'There is already an existing account linked with Google that belongs to you.' });
          }
          user = req.user;
          user.name = user.name || profile.name;
          user.gender = profile.gender;
          user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
          user.location = user.location || profile.location;
          user.google = profile.sub;
          user.save(() => {
            res.send({ token: generateToken(user), user });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ google: profile.sub }, (err, user) => {
          if (user) {
            return res.send({ token: generateToken(user), user });
          }
          user = new User({
            name: profile.name,
            email: profile.email,
            gender: profile.gender,
            picture: profile.picture.replace('sz=50', 'sz=200'),
            location: profile.location,
            google: profile.sub,
          });
          user.save((err) => {
            if (!err) {
              res.send({ token: generateToken(user), user });
            } else {
              throw Error(err);
            }
          });
        });
      }
    });
  });
};

exports.authGoogleCallback = function (req, res) {
  res.render('loading');
};

/* eslint consistent-return: 0 */
/* eslint no-param-reassign: 0 */
/* eslint no-shadow: 0 */
/* eslint prefer-destructuring: 0 */
/* eslint max-len: 0 */
