//import modules and files
import React from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './director-view.scss';


/* DirectorView */
function DirectorView(props) {
  const { movies, directorName } = props;

  if (!movies || !movies.length) return null;

  const director = movies.find(movie => movie.Director.Name === directorName).Director;
  const death = director.Death ? director.Death : "n/a";

  return (
    <div className="director-view">
      <h2>Director</h2>
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
      <Link to={'/'}><Button variant="outline-info" size="sm">Back to Movie List</Button></Link>
    </div>
  );
}

export default connect(({ movies }) => ({ movies }))(DirectorView);




