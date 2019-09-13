const mongoose = require('mongoose'),
  bcrypt = require('bcrypt');

var movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Rating: {
    Type: String,
    Description: String
  },
  Year: String,
  Genre: {
    Type: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: String,
    Death: String
  },
  ImagePath: String,
  Featured: Boolean
});

/*
var ratingSchema = mongoose.Schema({
  Type: { type: String, required: true },
  Description: { type: String, required: true }
});

var genreSchema = mongoose.Schema({
  Type: { type: String, required: true },
  Description: { type: String, required: true }
});
*/

var userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }]
});

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

var Movie = mongoose.model('Movie', movieSchema, 'movies');
//var Rating = mongoose.model('Rating', ratingSchema, 'ratings');
//var Genre = mongoose.model('Genre', genreSchema, 'genres');
var User = mongoose.model('User', userSchema, 'users');

//add back Rating, Genre
module.exports = {
  Movie, User
};

/* expanded version of above?
module.exports.Movie = Movie;
module.exports.Rating = Rating;
module.exports.Genre = Genre;
module.exports.User = User;
*/
