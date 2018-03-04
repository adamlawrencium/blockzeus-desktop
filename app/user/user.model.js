const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
};

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  picture: String,
  google: String,
  vk: String,
  blah: String,
  poloniexKey: String,
  poloniexSecret: String,
  connectedExchanges: { type: mongoose.Schema.Types.Mixed },
}, schemaOptions);

userSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  // } else if (user.isModified('poloniexKey')) {
  //   bcrypt.genSalt(10, (err, salt) => {
  //     bcrypt.hash(user.poloniexKey, salt, null, (err, hash) => {
  //       user.poloniexKey = hash;
  //       next();
  //     });
  //   });
  // } else if (user.isModified('poloniexSecret')) {
  //   bcrypt.genSalt(10, (err, salt) => {
  //     bcrypt.hash(user.poloniexSecret, salt, null, (err, hash) => {
  //       user.poloniexSecret = hash;
  //       next();
  //     });
  //   });
  } else {
    return next();
  }
  // if (!user.isModified('password')) { return next(); }
  // if (!user.isModified('poloniexKey')) { return next(); }
  // if (!user.isModified('poloniexSecret')) { return next(); }
  // bcrypt.genSalt(10, (err, salt) => {
  //   bcrypt.hash(user.password, salt, null, (err, hash) => {
  //     user.password = hash;
  //     next();
  //   });
  // });
});

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

userSchema.virtual('gravatar').get(function () {
  if (!this.get('email')) {
    return 'https://gravatar.com/avatar/?s=200&d=retro';
  }
  const md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=200&d=retro`;
});

userSchema.options.toJSON = {
  transform(doc, ret, options) {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
  },
};

const User = mongoose.model('User', userSchema);

module.exports = User;
