let jwtSecret = 'your_jwt_secret'; //must be the same key used in JWTStrategy
let jwt = require('jsonwebtoken');
const passport = require('passport');
require('./passport'); //the local passport file


function generateJWTToken(user) {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, //the username that's being encoded in the JWT
    expiresIn: '7d', //specifies the token will expire in 7 days
    algorithm: 'HS256' //algorithm used to 'sign'/encode the JWT values
  });
}


/* POST login. */
module.exports = (app) => {
  app.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        var token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}