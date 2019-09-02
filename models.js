const mongoose = require('mongoose'),
  bcrypt = require('bcrypt');

var movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Rating: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating'
  }],
  Year: String,
  Genre: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre'
  }],
  Director: {
    Name: String,
    Bio: String
  },
  ImagePath: String,
  Featured: Boolean
});

var ratingSchema = mongoose.Schema ({
  Type: {type: String, required: true},
  Description: {type: String, required: true}
});

var genreSchema = mongoose.Schema ({
  Type: {type: String, required: true},
  Description: {type: String, required: true}
});

var userSchema = mongoose.Schema ({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }]
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = (password) => {
  return bcrypt.compareSync(password, this.Password);
};

var Movie = mongoose.model('Movie', movieSchema, 'movies');
var Rating = mongoose.model('Rating', ratingSchema, 'ratings');
var Genre = mongoose.model('Genre', genreSchema, 'genres');
var User = mongoose.model('User', userSchema, 'users');

module.exports = {
  Movie, Rating, Genre, User
};

/* expanded version of above?
module.exports.Movie = Movie;
module.exports.Rating = Rating;
module.exports.Genre = Genre;
module.exports.User = User;
*/
