const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


function generateToken(user) {
  //1. Dont use password and other sensitive fields
  //2. Use fields that are useful in other parts of the
  //app/collections/models
  const u = {
   name: user,
  };
  return jwt.sign(u, process.env.JWT_SECRET, {
     expiresIn: 60 * 60 * 24 // expires in 24 hours
  });
}

router.get('/fakeSignIn', async (req, res) => {
  const token = generateToken('Birch');
  return res.json(token);
});

router.get('/accessPrivateInfo', async (req, res) => {
  let token = req.headers['authorization'];
  jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Please register Log in using a valid email to submit posts'
      });
    } else {
      console.log('authenticated')
      return res.json('poopoo')
    }
  });
});

module.exports = router;
