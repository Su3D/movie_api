//import modules and files
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './movie-view.scss';

/* MovieView */
function MovieView(props) {
  const { movies, movieId } = props;

  if (!movies || !movies.length) return null;

  const movie = movies.find(m => m._id === movieId);

  function handleSubmit(event) {
    event.preventDefault();
    axios.post(`https://cf-movie-list-api.herokuapp.com/users/${localStorage.getItem('user')}/FavoriteMovies/${movie._id}`, {
      Username: localStorage.getItem('user')
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        console.log(response);
        alert('The movie has been added to your Favorites List!');
      })
      .catch(event => {
        console.log('error adding movie to list');
        alert('Oops... Something went wrong!');
      });
  };

  return (
    <div className="movie-view">
      <img className="movie-poster" src={movie.ImagePath} alt="movie poster" />
      <div className="movie-title movie-item">
        <div className="label">Title</div>
        <div className="value">{movie.Title}</div>
      </div>
      <div className="movie-year movie-item">
        <div className="label">Year</div>
        <div className="value">{movie.Year}</div>
      </div>
      <div className="movie-description movie-item">
        <div className="label">Description</div>
        <div className="value">{movie.Description}</div>
      </div>
      <div className="movie-rating movie-item">
        <div className="label">Rating</div>
        <div className="value">{movie.Rating.Type}</div>
      </div>
      <div className="movie-genre movie-item">
        <div className="label">Genre</div>
        <div className="value">{movie.Genre.Type}</div>
      </div>
      <div className="movie-director movie-item">
        <div className="label">Director</div>
        <div className="value">{movie.Director.Name}</div>
      </div>
      <h4>More Information</h4>
      <div className="movie-more-info movie-item">
        <Link to={`/directors/${movie.Director.Name}`}><Button variant="outline-secondary">Director</Button></Link>
        <Link to={`/genres/${movie.Genre.Type}`}><Button variant="outline-secondary">Genre</Button></Link>
        <Link to={`/ratings/${movie.Rating.Type}`}><Button variant="outline-secondary">Rating</Button></Link>
      </div>

      <Button variant="outline-info" size="sm" onClick={event => this.handleSubmit(event)}>Add to Favorites</Button>
      <Link to="/"><Button variant="outline-info" size="sm">Back to Movie List</Button></Link>
    </div>//movie-view
  );//return
}
export default connect(({ movies }) => ({ movies }))(MovieView);


