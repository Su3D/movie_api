//import modules and files
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './rating-view.scss';

/* RatingView */
function RatingView(props) {
  const { movies, ratingName } = props;

  if (!movies || !movies.length) return null;

  const rating = movies.find(movie => movie.Rating.Name === ratingName).Rating;

  return (
    <div className="rating-view">
      <div className="rating-type rating-item">
        <div className="label">Type</div>
        <div className="value">{rating.Type}</div>
      </div>
      <div className="rating-description rating-item">
        <div className="label">Description</div>
        <div className="value">{rating.Description}</div>
      </div>
      <Link to="/"><Button variant="outline-dark" size="sm">Back to Movie List</Button></Link>
    </div>
  );
}

export default connect(({ movies }) => ({ movies }))(RatingView);