//import modules and files
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import './genre-view.scss';

import { Link } from "react-router-dom";

//declare and export components
export class GenreView extends React.Component {
  constructor() {
    //call the superclass constructor so React can initialize it
    super();
    //initialize the state to an empty object so it can destructured later
    this.state = {};
  }
  render() {
    var { genre } = this.props;

    if (!genre) return null;

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
}


//validate data existence and type
GenreView.propTypes = {
  genre: PropTypes.shape({
    Type: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired
  }).isRequired
  //onClick: PropTypes.func.isRequired
};
