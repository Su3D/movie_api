//import/require modules: express, morgan
const express = require('express'),
morgan = require('morgan');

//declare variable to use the Express functionality
const app = express();

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
app.get('/', function(req, res) {
  res.send('Welcome to the movie list!')
});
app.get('/movies', function(req, res) {
  res.json(topMovies)
});

//movies JSON
let topMovies = [ {
  title : 'The Princess Bride',
  year: '1987',
  rating: 'PG'
},
{
  title : 'Amelie',
  year: '2001',
  rating: 'R'
},
{
  title : 'Pride and Prejudice',
  year: '2005',
  rating: 'PG'
},
{
  title : 'Chicago',
  year: '2003',
  rating: 'PG-13'
},
{
  title : 'The Sting',
  year: '1973',
  rating: 'PG'
},
{
  title : 'The Shawshank Redemption',
  year: '1994',
  rating: 'R'
},
{
  title : 'Casablanca',
  year: '1942',
  rating: 'PG'
},
{
  title : 'Gone with the Wind',
  year: '1939',
  rating: 'passed'
},
{
  title : 'Hairspray',
  year: '2007',
  rating: 'PG'
},
{
  title : 'Mamma Mia!',
  year: '2008',
  rating: 'PG-13'
},
{
  title : 'O Brother, Where Art Thou?',
  year: '2000',
  rating: 'PG-13'
}
]

//listener
app.listen(8080, () => {
  console.log('The app is listening on port 8080.');
});
