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
const validator = require('express-validator');
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
app.use(cors());
app.use(validator());
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
* Returns a list of ALL movies to the user
*/
//, passport.authenticate('jwt', { session: false })
app.get('/movies', passport.authenticate('jwt', { session: false }), function (req, res) {
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
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
/*
* Returns data about a single movie by title to the user
*/
//, passport.authenticate('jwt', { session: false })
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), function (req, res) {
  /*
* @function GET /movies/:title
* @param title {string} - movie title
* @example requests:
* @example response: JSON file with movie data:
*movie = [
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
*   }
*]
*/
  Movies.findOne({
    Title: req.params.Title
  })
    .then(function (movie) {
      res.json(movie)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/*
* Returns data about a genre description by name/title (e.g., “Thriller”)
*/
//, passport.authenticate('jwt', { session: false })
app.get('/movies/:Title/Genre', passport.authenticate('jwt', { session: false }), function (req, res) {
  /*
  * @function GET /movies/:title
  * @param title {string} - movie title
  * @example requests:
  * @example response: JSON file with movie data:
  *movie = [
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
  *   }
  *]
  */
  Movies.findOne({
    Title: req.params.Title
  })
    .then(function (movie) {
      if (movie) {
        res.status(201).send('The genre of ' + movie.Title + ' is ' + movie.Genre);
      } else {
        res.status(404).send('Movie with the title ' + req.params.Title + ' was not found.');
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
/*
* Returns data about a director bio
*/
//, passport.authenticate('jwt', { session: false })
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), function (req, res) {
  /*
  * @function GET /movies/directors/:name
  * @param title {string} name - movie director's name
  * @example request:
  * @example JSON file, director's data:
  *{
  *   "name": "",
  *   "bio": "",
  *   "birth": "",
  *   "death": ""
  * }
  */
  Movies.findOne({
    'Director.Name': req.params.Name
  })
    .then(function (director) {
      res.json(director)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
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

/*
* Allow new users to register
*/
app.post('/users', function (req, res) {
  /*
  * @function POST /users
  * @example request body format JSON file:
  *{
  *   "username": "",
  *   "password": "",
  *   "email": "",
  *   "birthday": ""
  * }
  */
  // Validation logic here for request
  req.checkBody('Username', 'Username is required').notEmpty();
  req.checkBody('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric()
  req.checkBody('Password', 'Password is required').notEmpty();
  req.checkBody('Email', 'Email is required').notEmpty();
  req.checkBody('Email', 'Email does not appear to be valid').isEmail();
  // check the validation object for errors
  var errors = req.validationErrors();
  if (errors) {
    return res.status(422).json({ errors: errors });
  }

  var hashedPassword = Users.hashPassword(req.body.Password); // stores the hashed password
  Users.findOne({ Username: req.body.Username })// Search to see if a user with the requested username already exists
    .then(function (user) {
      if (user) {
        //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then(function (user) {
            res.status(201).json(user)
          })
          .catch(function (error) {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    }).catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// get specific user
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(201).json(user)
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/*
* Allow users to update their info (Username, Password, Email and Birthday)
*/
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
  /*
  * @function PUT /users/:username
  * @param username {string} username - username
  * @example request body format JSON file:
  *{
  *   "username": "",
  *   "password": "",
  *   "email": "",
  *   "birthday": ""
  * }
  */
  // Validation logic here for request
  req.checkBody('Username', 'Username is required').notEmpty();
  req.checkBody('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric()
  req.checkBody('Password', 'Password is required').notEmpty();
  req.checkBody('Email', 'Email is required').notEmpty();
  req.checkBody('Email', 'Email does not appear to be valid').isEmail();
  // check the validation object for errors
  var errors = req.validationErrors();
  if (errors) {
    return res.status(422).json({ errors: errors });
  }

  // hash password of new User
  let hashedPassword = Users.hashPassword(req.body.Password);

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
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser)
      }
    })
});


/*
* Allow users to add a movie to their list of favorites
*/
app.post('/users/:Username/FavoriteMovies/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
  /*
  * @function PUT /users/:username/favoritemovies/:id
  * @param username {string} username - username
  * @param id {string} id - user's id
  * @example JSON file:
  *{
  *   "favoritemovies": [],
  *   "_id": "",
  *   "username": "",
  *   "password": "",
  *   "email": "",
  *   "birthday": "",
  *   "__v": 0
  * }
  */
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
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser)
      }
    })
});

/*
*  Allow users to remove a movie from their list of favorites
*/
app.delete('/users/:Username/FavoriteMovies/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
  /*
  * @function DELETE /users/:username/favoritemovies/:id
  * @param username {string} username - username
  * @param id {string} id - movie's id
  * @example  response:
  *message:
  *The account with the username: [username] is deleted.'
  */
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
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser)
      }
    }
  )
});

/*
* Allow users to delete profile
*/
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
  /*
  * @function DELETE /users/:username
  * @param username {string} username - username
  * @example  response:
  *message:
  *The account with the username: [username] is deleted.'
  */

  Users.findOneAndRemove({
    Username: req.params.Username
  })
    .then(function (user) {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


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





