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
    const death = director.Death ? director.Death : "n/a";
    if (!director) return null;

    return (
      <div className="director-view">
        <div className="director-name director-item">
          <div className="label">Name</div>
          <div className="value">{director.Name}</div>
        </div>
        <div className="director-bio director-item">
          <div className="label">Bio</div>
          <div className="value">{director.Bio}</div>
        </div>
        <div className="director-birthyear director-item">
          <div className="label">Born</div>
          <div className="value">{director.Birth}</div>
        </div>
        <div className="director-deathyear director-item">
          <div className="label">Died</div>
          <div className="value">{death}</div>
        </div>


        <Link to="/"><Button variant="outline-dark" size="sm">Back to Movie List</Button></Link>

      </div>
    );
  }
}


//validate data existence and type
DirectorView.propTypes = {
  director: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Bio: PropTypes.string.isRequired,
    Birth: PropTypes.string,
    Death: PropTypes.string
  }).isRequired
  //onClick: PropTypes.func.isRequired
};
