//import/require modules:
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  cors = require('cors');

//import/require models.js
const Models = require('./models.js');

//use express-validator for server-side validation
const {check, validationResult} = require('express-validator');

//declare variable to use the Express functionality
const app = express();

app.use(bodyParser.json());

/*just on local
//creates list of allowed origins/domains
var allowedOrigins = ['http://localhost:8080', 'http://127.0.0.1:8080'];
//check the list of allowed origins
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { //IF the origin isn't on the list
      var message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
      return callback(new Error(message),  false);
    }
    return callback(null, true);
  }
}));*/

//declare variables to use the Mongoose models
const Movies = Models.Movie;
const Ratings = Models.Rating;
const Genres = Models.Genre;
const Users = Models.User;

//import auth.js file
var auth = require('./auth')(app);

//import/require passport.js
require('./passport');

//connect mongoose
//local
mongoose.connect('mongodb://localhost:27017/MovieListDB', {useNewUrlParser: true});
//MongoDB.Atlas
//mongoose.connect('mongodb+srv://cf-dbs-admin:m0ng0Adm1n@cf-dbs-2kghc.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

//make Mongoose use `findOneAndUpdate()`
//`true` by default, must be set to false.
//https://mongoosejs.com/docs/deprecations.html#findandmodify
mongoose.set('useFindAndModify', false);

//logger
app.use(morgan('common'));

//error handler
app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send('Doh!');
});

//serve static files
app.use(express.static('public'));

//GET requests
//default welcome message at root
app.get('/', (req, res) => {
  res.send('Welcome to the movie list!');
});

app.get('/documentation', function(req, res) {
  res.sendFile('public/documentation.html', { root : __dirname})
});

//movies, etc
//returns data for all movies [GET]
app.get('/movies', passport.authenticate('jwt', {session : false}), (req, res) => {
  Movies.find()
  .then(function(movies) {
    res.status(201).json(movies)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//returns data for a single movie (by title) [GET]
app.get('/movies/:Title', passport.authenticate('jwt', {session : false}), (req, res) => {
  Movies.findOne({Title: req.params.Title})
  .then(function(movie) {
    res.json(movie)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//returns data for all ratings [GET]
app.get('/ratings', passport.authenticate('jwt', {session : false}), (req, res) => {
  Ratings.find()
  .then(function(ratings) {
    res.status(201).json(ratings)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//returns data for a single rating (by type) [GET]
app.get('/ratings/:Type', passport.authenticate('jwt', {session : false}), (req, res) => {
  Ratings.findOne({Type: req.params.Type})
  .then(function(rating) {
    res.json(rating)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//returns data for all genres [GET]
app.get('/genres', passport.authenticate('jwt', {session : false}), (req, res) => {
  Genres.find()
  .then(function(genres) {
    res.status(201).json(genres)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//returns data for a single genre (by type) [GET]
app.get('/genres/:Type', passport.authenticate('jwt', {session : false}), (req, res) => {
  Genres.findOne({Type: req.params.Type})
  .then(function(genre) {
    res.json(genre)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//returns data for all directors [GET]
/*doesn't work
app.get('/directors', (req, res) => {
  Directors.find()
  .then(function(directors) {
    res.status(201).json(directors)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});*/

//returns data for a single director (by name) [GET]
app.get('/movies/directors/:Name', passport.authenticate('jwt', {session : false}), (req, res) => {
  Movies.findOne({'Director.Name': req.params.Name})
  .then(function(movies) {
    res.json(movies.Director)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//allow new users to register for an account/profile [POST]
/*JSON should be formatted:
{
 ID : Integer,
 Username : String,
 Password : String,
 Email : String,
 Birthday : Date
}*/
app.post('/users',
  /*validation logic for request you can either use a chain of methods like .not().isEmpty() which means "opposite of isEmpty" in plain english "is not empty" or use .isLength({min: 5}) which means minimum value of 5 characters are only allowed*/
  [check('Username', 'Username is required.').isLength({min:5}),
   check('Username', 'Username may only contain alphanumeric characters.').isAlphanumeric(),
   check('Password', 'Password is required.').not().isEmpty(),
   check('Email', 'Email is invalid.').isEmail()],
   (req, res) => {
     //check the validation object for errors
     var errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(422).json({error: errors.array()});
   }
  var hashedPassword = Users.hashPassword(req.body.Password); //hash password when user registers
  Users.findOne({Username: req.body.Username}) //check if the user already exists
  .then(function(user) {
    if (user) { //if yes, return 'error' message
      return res.status(400).send(req.body.Username + ' already exists.');
    } else { // if no, create the user
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      //return completed status & data submitted/created
      .then(function(user) {
        res.status(201).json(user)
      })
      .catch(function(error) { //catch any errors in the creatation of the user
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
    }
  }).catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//returns data for all users [GET]
app.get('/users', passport.authenticate('jwt', {session : false}), (req, res) => {
  Users.find()
  .then(function(users) {
    res.status(201).json(users)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//allow users to get their ID, and other information (by username) [GET]
app.get('/users/:Username', passport.authenticate('jwt', {session : false}), (req, res) => {
  Users.findOne({Username: req.params.Username})
  .then(function(user) {
    res.json(user)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ', + error);
  });
});

//allow users to get their ID, and other information (by email) [GET]
/*doesn't work as you can't have two queries on the same endpoint
app.get('/users/:Email', (req, res) => {
  Users.findOne({Email: req.params.Email})
  .then(function(user) {
    res.json(user)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ', + error);
  });
});*/

//allow users to update their information (by username) [PUT]
/*JSON should be formatted:
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}*/
app.put('/users/:Username', passport.authenticate('jwt', {session : false}),
[check('Username', 'Username is required.').isLength({min:5}),
 check('Username', 'Username may only contain alphanumeric characters.').isAlphanumeric(),
 check('Password', 'Password is required.').not().isEmpty(),
 check('Email', 'Email is invalid.').isEmail()],
 (req, res) => {
   //check the validation object for errors
   var errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(422).json({error: errors.array()});
 }
  Users.findOneAndUpdate({Username: req.params.Username}, {
  $set: {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  }},
  {new: true}) //makes sure the updated data is returned to the user
  .then(function(updatedUser) {
    res.json(updatedUser)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//allow users to update their information (by _id) [PUT]
/*doesn't work as you can't have two queries on the same endpoint
JSON should be formatted:
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}
app.put('/users/:_id', (req, res) => {
  Users.findOneAndUpdate({_id: req.params._id}, {
  $set: {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  }},
  {new: true} //makes sure the updated data is returned to the user
  .then(function(updatedUser) {
    res.json(updatedUser)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});*/

//allow users to add a movie to their favorites list (by username & movie ID) [POST]
app.post('/users/:Username/movies/:_id', passport.authenticate('jwt', {session : false}), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
    $push: {FavoriteMovies: req.params._id}
  },
  {new: true}) //makes sure the updated data is returned to the user
  .then(function(updatedUser) {
    res.json(updatedUser)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//allow users to remove a movie from their favorites list (by username & movie ID) [DELETE]
app.delete('/users/:Username/movies/:_id', passport.authenticate('jwt', {session : false}), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
    $pull: {FavoriteMovies: req.params._id}
  },
  {new: true}) //makes sure the updated data is returned to the user
  .then(function(updatedUser) {
    res.json(updatedUser)
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//allows existing users to delete their account/profile (by username) [DELETE]
app.delete('/users/:Username', passport.authenticate('jwt', {session : false}), (req, res) => {
  Users.findOneAndRemove({Username: req.params.Username})
  .then(function(user) {
    if (!user) {
      res.status(400).send(req,params.Username + ' was not found.');
    } else {
      res.status(200).send(req.params.Username + ' has been removed.');
    }
  })
  .catch(function(error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});


//listener
/*for Heroku
var port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', function() {
  console.log('Listening on Port 3000');
});*/

/*for localhost*/
app.listen(8080, () => {
  console.log('The Movie List app is listening on port 8080.');
});
