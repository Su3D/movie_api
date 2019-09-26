/*
* @description Index.js manages all HTTP requests
* @class Router
* @requires express, a server framework for Node.js
* @requires body-parser, a parsing middleware for node.js that is needed to read HTTP POST data which is stored in req.body
* @requires uuid, which generates user ids
* @requires mongoose, an object data modeling library (ODM) for MongoDB database
* @requires passport, authentication middleware for Node.js
* @requires cors, Express middleware that manages the CORS settings (Cross-Origin-Resource-Sharing)
* @requires validator, Express middleware that provide validators sanitizer functions
* @requires path, part of Node.js core, manages file and folder paths
*/
// import required modules
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
//const validator = require('express-validator');
const path = require('path');


// importg mongoose schemas
/* @requires models.js, contains the data schema for this application */
const Models = require('./models.js');
/* @const Movies data schema for Movies object  */
const Movies = Models.Movie;
/* @const Users data schema for Users object  */
const Users = Models.User;

/* @const app encapsulate express functionality */
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cors()); //CORS enabled for all origins
//app.use(validator());
var auth = require('./auth')(app);

//connect to mongo DB
//mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true});

//connect mongoose
//local
//mongoose.connect('mongodb://localhost:27017/MovieListDB', {useNewUrlParser: true});
//MongoDB.Atlas
mongoose.connect('mongodb+srv://cf-dbs-admin:m0ng0Adm1n@cf-dbs-2kghc.mongodb.net/MovieListDB?retryWrites=true&w=majority', { useNewUrlParser: true });

//make Mongoose use `findOneAndUpdate()`
//`true` by default, must be set to false.
//https://mongoosejs.com/docs/deprecations.html#findandmodify
mongoose.set('useFindAndModify', false);

// In case of any CORS restrictions uncomment and add trusted origins
// var allowedOrigins = ['http://localhost:8080', 'http://localhost:3000','http://someTrustedURL.com'];
// app.use(cors({
//   origin: function(origin, callback){
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
//       var message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message ), false);
//     }
//     return callback(null, true);
//   }
// }));

//////////////////
//MOVIE ENDPOINTS
//////////////////
/*
* @function GET /movies
* @example response: JSON file, data of all movies:
*[
*   {
*     "genre": {
*       "type": "",
*       "description": ""
*     },
*     "rating": {
*       "type": "",
*       "description": ""
*     },
*     "director": {
*       "name": "",
*       "bio": ""
*       "birth": "",
*       "death": ""
*     },
*     "_id": "",
*     "movieId": "",
*     "title": "",
*     "description": "",
*     "imagePath": "",
*     "featured": ""
*   },
*   {},...
*]
*/
//, passport.authenticate('jwt', { session: false })
//returns data for all movies [GET]
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies)
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//, passport.authenticate('jwt', { session: false })
//returns data for a single movie (by title) [GET]
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then(function (movie) {
      res.json(movie)
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//returns data for a single rating (by type) [GET]
app.get('/movies/ratings/:Type', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Rating.Type': req.params.Type })
    .then(function (movies) {
      res.json(movies.Rating)
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//, passport.authenticate('jwt', { session: false })
//returns data for a single genre (by type) [GET]
app.get('/movies/genres/:Type', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Type': req.params.Type })
    .then(function (movies) {
      res.json(movies.Genre)
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//returns data for a single director (by name) [GET]
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
    .then(function (movies) {
      res.json(movies.Director)
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//////////////////
//USER ENDPOINTS
//////////////////
// For postman testing purposes, returns a list of all users
// app.get('/users', function (req, res) {
//   Users.find()
//   .then(function (users) {
//     res.status(201).json(users)
//   })
//   .catch(function (err) {
//     console.error(err);
//     res.status(500).send('Error: ' + err);
//   })
// });


//allow new users to register for an account/profile [POST]
/*JSON should be formatted:
{
 ID : Integer,
 Username : String,
 Password : String,
 Email : String,
 Birthday : Date
}*/
app.post("/users", function (req, res) {
  req.checkBody("Username", "Username is required.").notEmpty();
  req.checkBody("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric();
  req.checkBody("Password", "Password is required").notEmpty();
  req.checkBody("Email", "Email is required.").notEmpty();
  req.checkBody("Email", "Email does not appear to be valid.").isEmail();

  // check the validation object for errors
  var errors = req.validationErrors();

  if (errors) {
    return res.status(422).json({
      errors: errors
    });
  }

  var hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({
    Username: req.body.Username
  })
    .then(function (user) {
      if (user) {
        return res.status(400).send("This username already exists.");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
          .then(function (user) {
            res.status(201).json(user);
          })
          .catch(function (error) {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});


//allow users to update their account/profile [put]
/*JSON should be formatted:
{
 ID : Integer,
 Username : String,
 Password : String,
 Email : String,
 Birthday : Date
}*/
app.put("/users/:Username", passport.authenticate("jwt", {
  session: false
}),
  function (req, res) {
    req.checkBody("Username", "Username is required.").notEmpty();
    req
      .checkBody(
        "Username",
        "Username contains non alphanumeric characters - not allowed."
      )
      .isAlphanumeric();
    req.checkBody("Password", "Password is required").notEmpty();
    req.checkBody("Email", "Email is required.").notEmpty();
    req.checkBody("Email", "Email does not appear to be valid.").isEmail();

    // check the validation object for errors
    var errors = req.validationErrors();

    if (errors) {
      return res.status(422).json({
        errors: errors
      });
    }

    var hashedPassword = Users.hashPassword(req.body.Password);
    Users.update({
      Username: req.params.Username
    }, {
      $set: {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    }, {
      new: true
    }, // This line makes sure that the updated document is returned
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Allows users to add a movie to their list of favorites
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", {
    session: false
  }),
  function (req, res) {
    Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $push: {
        FavoriteMovies: req.params.MovieID
      }
    }, {
      new: true
    }, // This line makes sure that the updated document is returned
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Allows users to remove a movie from their list of favorites
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", {
    session: false
  }),
  function (req, res) {
    Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $pull: {
        FavoriteMovies: req.params.MovieID
      }
    }, {
      new: true
    }, // This line makes sure that the updated document is returned
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Allows existing users to deregister by username
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", {
    session: false
  }),
  function (req, res) {
    Users.findOneAndRemove({
      Username: req.params.Username
    })
      .then(function (user) {
        if (!user) {
          res
            .status(400)
            .send(req.params.Username + "'s user profile was not found");
        } else {
          res
            .status(200)
            .send(
              req.params.Username +
              "'s user profile was successfully deleted from CineStock."
            );
        }
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);




// Serves documentation file
app.get('/documentation', (req, res) => {
  res.sendFile('/public/documentation.html', { root: __dirname })
});

//Deploy to heroku
app.use(express.static(path.join(__dirname, 'client2/build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client2/build/index.html'))
});

//environment variable port
var port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}`)
});


