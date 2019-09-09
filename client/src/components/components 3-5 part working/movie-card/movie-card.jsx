//import modules and files
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card';

import './movie-card.scss';

//declare and export components
export class MovieCard extends React.Component {
  render() {
    const { movie, onClick } = this.props;

    return (
      <div className="movie-card">
        <CardDeck>
          <Card style={{ width: '16rem' }}>
            <Card.Img variant="top" src={movie.ImagePath} />
            <Card.Body>
              <Card.Title>{movie.Title}</Card.Title>
              <Card.Text>{movie.Description}</Card.Text>
              <Button onClick={() => onClick(movie)} variant="outline-primary">Details</Button>
            </Card.Body>
          </Card>
        </CardDeck>
      </div>
    );
  }
}

//validate data existence and type
MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired
};



/*non-bootatrap way to call movie-card
<div onClick={() => onClick(movie)} className="movie-card">{movie.Title}</div>
*/
