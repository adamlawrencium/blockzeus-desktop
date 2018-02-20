const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const RedisClient = require('../../lib/redis'); // TOOD - drop relative path?

// // // //

// POST /api/auth/register
// { username, password }
exports.register = (req, res) => {
  // Parses username, password parameters from req.body
  const { username, password } = req.body;

  // Create a new User instance if one does not exist
  const create = (user) => {
    // User exists - throw error and return
    if (user) {
      throw new Error('username exists');
    }

    // Creates a new User
    return User.create(username, password);
  };

  // Respond to the client
  const respond = (isAdmin) => {
    res.json({
      message: 'Registered Successfully.',
    });
  };

  // Handle error (username exists)
  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  // check username duplication
  User.findOneByUsername(username)
    .then(create)
    .then(respond)
    .catch(onError);
};

// // // //

// POST /api/auth/login
// { username, password }
exports.login = (req, res) => {
  // Gathers username, password
  const { username, password } = req.body;

  // check the user info & generate the jwt
  // Ensures presence of the User in the database
  // Verifies the supplied password against the database
  const check = (user) => {
    // User does NOT exist
    if (!user) {
      // Invalid password
      throw new Error('login failed');
    }

    // User does exists - verify the password parameter
    if (!user.verify(password)) {
      // Invalid password
      throw new Error('login failed');
    }

    // Assembles JWT User Payload
    const jwt_paylod = {
      id: user._id.toString(),
      admin: user.admin,
      username: user.username,
      iat: Date.now(),
    };

    // JWT Options
    const jwt_options = {
      expiresIn: '7d', // TODO - should these be abstracted into ENV?
      issuer: 'eb.com', // TODO - should issuer be included with Boilerplate?
      subject: 'user_info',
    };

    // TODO - assign 'alg' to JWT options?
    // alg: ''

    // Return a Promise to handle asynchronous JWT generation
    return new Promise((resolve, reject) => {
      // Defines callback to JWT
      const jwtCallback = (err, token) => {
        if (err) return reject(err);
        resolve({ token, user });
      };

      jwt.sign(jwt_paylod, process.env.JWT_SECRET, jwt_options, jwtCallback);
    });
  };

  // Responds with user's authorization payload
  const respond = ({ token, user }) => {
    // Isolates the User's ID to be used as a key
    // in Redis for { user_id: token } records
    const user_id = user._id.toString(); // MongoDB

    // Assembles response_payload
    const response_payload = {
      _id: user_id,
      username: user.username,
      admin: user.admin,
      roles: user.roles,
      token,
    };

    // Stores token in Redis
    // TODO - set Redis cache expiration
    // TODO - scope this Redis cache to hold only authentication tokens?
    return RedisClient.set(user_id, token, (err, reply) => {
      // TODO - abstract HEADER
      const CONTENT_TYPE_JSON = { 'Content-Type': 'application/json' };

      // 500 Internal Server Error
      // Error writing to Redis
      if (err) {
        res.writeHead(500, CONTENT_TYPE_JSON);
        res.end(JSON.stringify({ error: 'An unknown exception has occured.' }));
      }

      // 200 OK - send token to client
      res.writeHead(200, CONTENT_TYPE_JSON);
      res.end(JSON.stringify(response_payload));
    });
  };

  // error occured
  const onError = (error) => {
    res.status(403).json({
      message: error.message,
    });
  };

  // Find the user
  User.findOneByUsername(username)
    .then(check)
    .then(respond)
    .catch(onError);
};

// // // //
// POST /api/auth/logout
// TODO - just apply standard AUTH middleware (requiresLogin)
exports.logout = (req, res) => {
  console.log('LOGOUT HERE');
  console.log(req.user);
  console.log(req.user);
  RedisClient.del(req.user.id);

  // RedisClient.key(req.user.id).clear()
  return res.json({ logout: true });
};
