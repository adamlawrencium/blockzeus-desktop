const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')

// // // //

// Password encryption helper function
function encryptPassword (password) {
    return crypto.createHmac('sha1', process.env.PASSWORD_ENCRYPTION_SECRET)
        .update(password)
        .digest('base64')
}

// // // //

// User Schema definition
// TODO - generator must add additional attributes
const User = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    roles: {
        type: [String],
        default: []
    }
})

// Create new User document
User.statics.create = function (username, password) {

    // Instantiates new User model
    const user = new this({
        username,
        password: encryptPassword(password)
    })

    // Return User.save() Promise
    return user.save()
}

// findOneByUsername
// Find one User by username
User.statics.findOneByUsername = function (username) {
    // Executes MongoDb query
    return this.findOne({ username }).exec()
}

// verify
// Verifies the password parameter of POST /auth/login requests
User.methods.verify = function (password) {
    // Verifies saved password against a request's password
    return this.password === encryptPassword(password)
}

// assignAdmin
// Assigns admin priviledges to a user
User.methods.assignAdmin = function () {
    // Assigns true to `admin` attribute
    this.admin = true

    // Returns `save` Promise
    return this.save()
}

// // // //

module.exports = mongoose.model('User', User)
