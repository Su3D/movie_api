//import/require modules
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  cors = require('cors');

//import/require models.js
const Models = require('./models.js');

//import/require passport.js
require('./passport');

//use express-validator for server-side validation
const { check, validationResult } = require('express-validator');

//declare variable to use the Express functionality
const app = express();

//declare variables to use the Mongoose models
const Movies = Models.Movie;
const Ratings = Models.Rating;
const Genres = Models.Genre;
const Users = Models.User;

//connect mongoose
//local
//mongoose.connect('mongodb://localhost:27017/MovieListDB', {useNewUrlParser: true});
//MongoDB.Atlas
mongoose.connect('mongodb+srv://cf-dbs-admin:m0ng0Adm1n@cf-dbs-2kghc.mongodb.net/MovieListDB?retryWrites=true&w=majority', { useNewUrlParser: true });

//make Mongoose use `findOneAndUpdate()`
//`true` by default, must be set to false.
//https://mongoosejs.com/docs/deprecations.html#findandmodify
mongoose.set('useFindAndModify', false);

//logger
app.use(morgan('common'));

//body-parser for POST requests
app.use(bodyParser.json());

app.use(cors()); //CORS enabled for all origins

//import auth.js file
var auth = require('./auth')(app);


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

app.get('/documentation', function (req, res) {
  res.sendFile('public/documentation.html', { root: __dirname })
});

//movies, etc
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
  [check('Username', 'Username is required.').isLength({ min: 5 }),
  check('Username', 'Username may only contain alphanumeric characters.').isAlphanumeric(),
  check('Password', 'Password is required.').not().isEmpty(),
  check('Email', 'Email is invalid.').isEmail()],
  (req, res) => {
    //check the validation object for errors
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() });
    }
    var hashedPassword = Users.hashPassword(req.body.Password); //hash password when user registers
    Users.findOne({ Username: req.body.Username }) //check if the user already exists
      .then(function (user) {
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
            .then(function (user) {
              res.status(201).json(user)
            })
            .catch(function (error) { //catch any errors in the creatation of the user
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      }).catch(function (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

//returns data for all users [GET]
//removed [ passport.authenticate('jwt', { session: false }), ] from app.get to allow all access to list
app.get('/users', (req, res) => {
  Users.find()
    .then(function (users) {
      res.status(201).json(users)
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//allow users to get their ID, and other information (by username) [GET]
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then(function (user) {
      res.json(user)
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ', + error);
    });
});

//allow users to update their information (by username) [PUT]
/*JSON should be formatted:
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}*/
// passport.authenticate('jwt', { session: false }),
/*mine
app.put('/users/:Username',
  [check('Username', 'Username is required.').isLength({ min: 5 }),
  check('Username', 'Username may only contain alphanumeric characters.').isAlphanumeric(),
  check('Password', 'Password is required.').not().isEmpty(),
  check('Email', 'Email is invalid.').isEmail()],
  (req, res) => {
    //check the validation object for errors
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() });
    }
    var hashedPassword = Users.hashPassword(req.body.Password); //hash password for updates
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set: {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
      { new: true }) //makes sure the updated data is returned to the user
      .then(function (updatedUser) {
        res.json(updatedUser)
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });
*/


//Allows to update user info
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
  "/users/:Username/movies/:_id",
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
  "/users/:Username/movies/:_id",
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




/* mine  
//allow users to add a movie to their favorites list (by username & movie ID) [POST]
//passport.authenticate('jwt', { session: false }),
app.post('/users/:Username/movies/:_id', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params._id }
  },
    { new: true }) //makes sure the updated data is returned to the user
    .then(function (updatedUser) {
      res.json(updatedUser)
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});




//allow users to remove a movie from their favorites list (by username & movie ID) [DELETE]
app.delete('/users/:Username/movies/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params._id }
  },
    { new: true }) //makes sure the updated data is returned to the user
    .then(function (updatedUser) {
      res.json(updatedUser)
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});
*/



//allows existing users to delete their account/profile (by username) [DELETE]
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then(function (user) {
      if (!user) {
        res.status(400).send(req, params.Username + ' was not found.');
      } else {
        res.status(200).send(req.params.Username + ' has been removed.');
      }
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});



//listener
/*for running on Heroku*/
var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function () {
  console.log("Listening on Port 3000");
});

/*for running on localhost
app.listen(8080, () => {
  console.log('The Movie List app is listening on port 8080.');
});*/
