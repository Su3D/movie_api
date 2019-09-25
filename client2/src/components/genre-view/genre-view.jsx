//import modules and files
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './genre-view.scss';

/* GenreView */
function GenreView(props) {
  const { movies, genreName } = props;

  if (!movies || !movies.length) return null;

  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  return (
    <div className="genre-view">
      <div className="genre-type genre-item">
        <div className="label">Type</div>
        <div className="value">{genre.Type}</div>
      </div>
      <div className="genre-description genre-item">
        <div className="label">Description</div>
        <div className="value">{genre.Description}</div>
      </div>
      <Link to="/"><Button variant="outline-dark" size="sm">Back to Movie List</Button></Link>
    </div>
  );
}

export default connect(({ movies }) => ({ movies }))(GenreView);
