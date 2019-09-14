//import modules and files
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import './movie-view.scss';

import { Link } from "react-router-dom";

//declare and export components
export class MovieView extends React.Component {
  constructor() {
    //call the superclass constructor so React can initialize it
    super();
    //initialize the state to an empty object so it can destructured later
    this.state = {};
  }
  render() {
    var { movie } = this.props;
    if (!movie) return null;

    return (
      <div className="movie-view">
        <img className="movie-poster" src={movie.ImagePath} />
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

        <Link to="/"><Button variant="outline-dark" size="sm">Back to Movie List</Button></Link>

      </div>
    );
  }
}

//validate data existence and type
MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Year: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired
    }).isRequired,
    ImagePath: PropTypes.string.isRequired
  }).isRequired
  //onClick: PropTypes.func.isRequired
};