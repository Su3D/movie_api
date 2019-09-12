//import modules and files
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import './director-view.scss';

import { Link } from "react-router-dom";

//declare and export components
export class DirectorView extends React.Component {
  constructor() {
    //call the superclass constructor so React can initialize it
    super();
    //initialize the state to an empty object so it can destructured later
    this.state = {};
  }
  render() {
    var { director } = this.props;
    if (!director) return null;

    return (
      <div className="director-view">
        <div className="director-name director-item">
          <div className="label">Director</div>
          <div className="value">{director.Name}</div>
        </div>
        <div className="director-bio director-item">
          <div className="label">Bio</div>
          <div className="value">{director.Bio}</div>
        </div>
        <div className="director-birth director-item">
          <div className="label">Director</div>
          <div className="value">{director.Name}</div>
        </div>
        <div className="director-birthyear director-item">
          <div className="label">Born:</div>
          <div className="value">{director.BirthYear}</div>
        </div>
        <div className="director-deathyear director-item">
          <div className="label">Died:</div>
          <div className="value">{director.DeathYear}</div>
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