//import modules and files
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import './rating-view.scss';

import { Link } from "react-router-dom";

//declare and export components
export class RatingView extends React.Component {
  constructor() {
    //call the superclass constructor so React can initialize it
    super();
    //initialize the state to an empty object so it can destructured later
    this.state = {};
  }
  render() {
    var { rating } = this.props;

    if (!genre) return null;

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
}

/*
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
  }).isRequired,
  //onClick: PropTypes.func.isRequired
};
*/