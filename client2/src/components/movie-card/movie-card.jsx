//import modules and files
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import CardDeck from "react-bootstrap/CardDeck";
import Card from 'react-bootstrap/Card';

import './movie-card.scss';

/* MovieCard */
export class MovieCard extends React.Component {
  render() {
    const { movie } = this.props;

    return (
      <CardDeck>
        <Card style={{ width: '100%' }} >
          <Link to={`/movies/${movie._id}`}>
            <Card.Img variant="top" src={movie.ImagePath} />
          </Link>
          <Card.Body>
            <Card.Title>{movie.Title}</Card.Title>
            <Card.Text>{movie.Description}</Card.Text>
            <Link to={`/movies/${movie._id}`}>
              <Button variant="primary">Details</Button>
            </Link>
          </Card.Body>
        </Card>
      </CardDeck>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string,
    Description: PropTypes.string,
    ImagePath: PropTypes.string
  }).isRequired
};

