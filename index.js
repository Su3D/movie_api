//import/require modules: express, morgan
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

//declare variable to use the Express functionality
const app = express();

app.use(bodyParser.json());

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
app.get('/movies', (req, res) => {
  res.send(Movies);
});

//returns data for a single movie (by title) [GET]
app.get('/movies/:title', (req, res) => {
  res.json(Movies.find((movie) => {
    return movie.title === req.params.title
  }));
});

//returns data for all genres [GET]
app.get('/genres', (req, res) => {
  res.send(Genres);
});

//returns data for a single genre (by type) [GET]
app.get('/genres/:type', (req, res) => {
  res.json(Genres.find((genre) => {
    return genre.type === req.params.type
  }));
});

//returns data for all directors [GET]
app.get('/directors', (req, res) => {
  res.send(Directors);
});

//returns data for a single director (by name) [GET]
app.get('/directors/:name', (req, res) => {
  res.json(Directors.find((director) => {
    return director.name === req.params.name
  }));
});

//allow new users to register for an account/profile [POST]
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.email) {
    const message = `Missing email in request body.`;
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    Users.push(newUser);
    res.status(201).send(newUser);
  }
});

//allow users to get their ID, and other information (by email) [GET]
app.get('/users/:email', (req, res) => {
  res.json(Users.find((user) => {
    return user.email === req.params.email
  }));
})

//allow users to update their information
app.put('/users/:id', (req, res) => {
  res.send('Successful PUT request updating user information.');
});

//allow users to add a movie to their favorties list (by ids) [POST]
app.post('/favorites/:id/', (req, res) => {
  res.send('Successful POST request to add a movie to the favorites list.');
});

//allow users to remove a movie from their favorties list (by ids) [DELETE]
app.delete('/favorites/:id', (req, res) => {
  res.send('Successful DELETE request to remove a movie from the favorites list.');
});

//allows existing users to delete their account/profile (by ID) [DELETE]
app.delete('/users/:id', (req, res) => {
  res.send('Successful DELETE request to remove user account/profile.');
});



//Users JSON
let Users = [
{
  id : '01',
  username : 'BellaBean',
  email : 'bella@bella.com',
  pwd : 'bellapwd',
  dob : '08-07-2006'
},
{
  id : '02',
  username : 'Su3D',
  email : '3333sd@gmail.com',
  pwd : 'moviespwd',
  dob : '05-17-1970'
}
]

//Directors JSON
let Directors = [
{
  name : 'Rob Reiner',
  bio : 'Robert Reiner was born in New York City, to Estelle Reiner (née Lebost) and Emmy-winning actor, comedian, writer, and producer Carl Reiner.',
  dob : '03-06-1947',
  dod : ''
},
{
  name : 'Jean-Pierre Jeunet',
  bio : 'Jean-Pierre Jeunet is a self-taught director who was very quickly interested by cinema, with a predilection for a fantastic cinema where form is as important as the subject.',
  dob : '09-03-1953',
  dod : ''
},
{
  name : 'Joe Wright',
  bio : 'Joe Wright is an English film director who has always had an interest in the arts, especially painting. He would also make films on his Super 8 camera as well as spend time in the evenings acting in a drama club.',
  dob : '08-25-1972',
  dod : ''
},
{
  name : 'Rob Marshall',
  bio : 'Rob Marshall grew up in the Squirrel Hill neighborhood of Pittsburgh, Pennsylvania. His father, Robert D. Marshall, was a professor and, later, a dean at the University of Pittsburgh. Marshall graduated from Taylor Allderdice High School and the Carnegie Mellon School of Drama. He is the brother of a twin sister, Maura, an interior decorator, and a younger sister, choreographer Kathleen Marshall.',
  dob : '10-17-1960',
  dod : ''
},
{
  name : 'George Roy Hill',
  bio : 'George Roy Hill was never able to \'hit it off\' with the critics despite the fact that 2 of his films - Butch Cassidy and the Sundance Kid (1969), and The Sting (1973) - had remained among the top 10 box office hits by 1976.',
  dob : '12-20-1921',
  dod : '12-27-2002'
},
{
  name : 'Frank Darabont',
  bio : 'Three-time Oscar nominee Frank Darabont was born in a refugee camp in 1959 in Montbeliard, France, the son of Hungarian parents who had fled Budapest during the failed 1956 Hungarian revolution. Brought to America as an infant, he settled with his family in Los Angeles and attended Hollywood High School.',
  dob : '01-28-1959',
  dod : ''
},
{
  name : 'Michael Curtiz',
  bio : 'Curtiz began acting in and then directing films in his native Hungary in 1912. After WWI, he continued his filmmaking career in Austria and Germany and into the early 1920s when he directed films in other countries in Europe. Moving to the US in 1926, he started making films in Hollywood for Warner Bros.',
  dob : '12-24-1886',
  dod : '04-10-1962'
},
{
  name : 'Victor Fleming',
  bio : 'Victor Fleming entered the film business as a stuntman in 1910, mainly doing stunt driving - which came easy to him, as he had been a mechanic and professional race-car driver. He became interested in working on the other side of the camera, and eventually got a job as a cameraman on many of the films of Douglas Fairbanks.',
  dob : '02-23-1889',
  dod : '01-06-1949'
},
{
  name : 'Adam Shankman',
  bio : 'Adam Shankman was born on November 27, 1964 in Los Angeles, California, USA as Adam Michael Shankman. He is known for his work on Hairspray (2007), A Walk to Remember (2002) and Cheaper by the Dozen 2 (2005).',
  dob : '11-27-1964',
  dod : ''
},
{
  name : 'Phyllida Lloyd',
  bio : 'Phyllida Lloyd was born on June 17, 1957 in Bristol, England as Phyllida Christian Lloyd. She is known for her work on Mamma Mia! (2008), The Iron Lady (2011) and Mamma Mia! Here We Go Again (2018).',
  dob : '06-17-1957',
  dod : ''
},
{
  name : 'Joel Coen',
  bio : 'Joel Coen was born on November 29, 1954 in Minneapolis, Minnesota, USA as Joel Daniel Coen. He is a producer and writer, known for The Ballad of Buster Scruggs (2018), A Serious Man (2009) and Fargo (1996).',
  dob : '11-29-1954',
  dod : ''
}
]


//Genres JSON
let Genres = [
{
  type : 'Fantasy',
  description : 'Fantasy films are films with fantastic themes, usually involving magic, supernatural events, incredible creatures, or exotic fantasy worlds. (wikipedia)'
},
{
  type : 'Comedy',
  description : 'A Comedy Film is a genre of film in which the main emphasis is on humour. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect. (wikipedia)'
},
{
  type : 'Drama',
  description : 'In film and television, drama is a genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone. (wikipedia)'
},
{
  type : 'Musical',
  description : 'Musical film is a film genre in which songs sung by the characters are interwoven into the narrative, sometimes accompanied by dancing. (wikipedia)'
}
]

//Movies JSON
let Movies = [
{
  id : '01',
  title : 'The Princess Bride',
  year: '1987',
  rating: 'PG',
  director: 'Rob Reiner',
  description: 'While home sick in bed, a young boy\'s grandfather reads him the story of a farmboy-turned-pirate who encounters numerous obstacles, enemies and allies in his quest to be reunited with his true love.',
  genre: 'Fantasy',
  imageURL: 'https://m.media-amazon.com/images/M/MV5BMGM4M2Q5N2MtNThkZS00NTc1LTk1NTItNWEyZjJjNDRmNDk5XkEyXkFqcGdeQXVyMjA0MDQ0Mjc@._V1_SY1000_CR0,0,676,1000_AL_.jpg',
  featured: 'false'
},
{
  id : '02',
  title : 'Amelie',
  year: '2001',
  rating: 'R',
  director: 'Jean-Pierre Jeunet',
  description: 'Amélie is an innocent and naive girl in Paris with her own sense of justice. She decides to help those around her and, along the way, discovers love.',
  genre: 'Comedy',
  imageURL: 'https://m.media-amazon.com/images/M/MV5BNDg4NjM1YjMtYmNhZC00MjM0LWFiZmYtNGY1YjA3MzZmODc5XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SY1000_CR0,0,666,1000_AL_.jpg',
  featured: 'false'
},
{
  id : '03',
  title : 'Pride and Prejudice',
  year: '2005',
  rating: 'PG',
  director: 'Joe Wright',
  description: 'Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy. But Mr. Darcy reluctantly finds himself falling in love with a woman beneath his class. Can each overcome their own pride and prejudice?',
  genre: 'Drama',
  imageURL: 'https://m.media-amazon.com/images/M/MV5BMTA1NDQ3NTcyOTNeQTJeQWpwZ15BbWU3MDA0MzA4MzE@._V1_SY1000_CR0,0,674,1000_AL_.jpg',
  featured: 'false'
},
{
  id : '04',
  title : 'Chicago',
  year: '2002',
  rating: 'PG-13',
  director: 'Rob Marshall',
  description: 'Two death-row murderesses develop a fierce rivalry while competing for publicity, celebrity, and a sleazy lawyer\'s attention.',
  genre: 'Musical',
  imageURL: 'https://m.media-amazon.com/images/M/MV5BN2E3NDU1ZTktNzZjNy00MWU3LWI4YmMtMjdjNTIzMDU0MDdiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,677,1000_AL_.jpg',
  featured: 'false'
},
{
  id : '05',
  title : 'The Sting',
  year: '1973',
  rating: 'PG',
  director: 'George Roy Hill',
  description: 'Two grifters team up to pull off the ultimate con.',
  genre: 'Comedy',
  imageURL: 'https://m.media-amazon.com/images/M/MV5BNGU3NjQ4YTMtZGJjOS00YTQ3LThmNmItMTI5MDE2ODI3NzY3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg',
  featured: 'false'
},
{
  id : '06',
  title : 'The Shawshank Redemption',
  year: '1994',
  rating: 'R',
  director: 'Frank Darabont',
  description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
  genre: 'Drama',
  imageURL: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
  featured: 'false'
},
{
  id : '07',
  title : 'Casablanca',
  year: '1942',
  rating: 'PG',
  director: 'Michael Curtiz',
  description: 'A cynical American expatriate struggles to decide whether or not he should help his former lover and her fugitive husband escape French Morocco.',
  genre: 'Drama',
  imageURL: 'https://m.media-amazon.com/images/M/MV5BY2IzZGY2YmEtYzljNS00NTM5LTgwMzUtMzM1NjQ4NGI0OTk0XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_.jpg',
  featured: 'false'
},
{
  id : '08',
  title : 'Gone with the Wind',
  year: '1939',
  rating: 'passed',
  director: '',
  description: 'A manipulative woman and a roguish man conduct a turbulent romance during the American Civil War and Reconstruction periods.',
  genre: 'Drama',
  imageURL: 'https://m.media-amazon.com/images/M/MV5BYjUyZWZkM2UtMzYxYy00ZmQ3LWFmZTQtOGE2YjBkNjA3YWZlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_CR0,0,652,1000_AL_.jpg',
  featured: 'false'
},
{
  id : '09',
  title : 'Hairspray',
  year: '2007',
  rating: 'PG',
  director: 'Adam Shankman',
  description: 'Pleasantly plump teenager Tracy Turnblad teaches 1962 Baltimore a thing or two about integration after landing a spot on a local TV dance show.',
  genre: 'Musical',
  imageURL: 'https://m.media-amazon.com/images/M/MV5BZmFhMzFkZTMtNmUxNS00OWQ1LTlhNjMtYzhmNTU4NmUzZDQwXkEyXkFqcGdeQXVyMTkzODUwNzk@._V1_SY1000_SX675_AL_.jpg',
  featured: 'false'
},
{
  id : '10',
  title : 'Mamma Mia!',
  year: '2008',
  rating: 'PG-13',
  director: 'Phyllida Lloyd',
  description: 'The story of a bride-to-be trying to find her real father told using hit songs by the popular 1970s group ABBA.',
  genre: 'Musical',
  imageURL: 'https://m.media-amazon.com/images/M/MV5BMTA2MDU0MjM0MzReQTJeQWpwZ15BbWU3MDYwNzgwNzE@._V1_.jpg',
  featured: 'false'
},
{
  id : '11',
  title : 'O Brother, Where Art Thou?',
  year: '2000',
  rating: 'PG-13',
  director: 'Joel Coen',
  description: 'In the deep south during the 1930s, three escaped convicts search for hidden treasure while a relentless lawman pursues them.',
  genre: 'Comedy',
  imageURL: 'https://m.media-amazon.com/images/M/MV5BMjZkOTdmMWItOTkyNy00MDdjLTlhNTQtYzU3MzdhZjA0ZDEyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,674,1000_AL_.jpg',
  featured: 'false'
}
]

//listener
app.listen(8080, () => {
  console.log('The Movie List app is listening on port 8080.');
});
