import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import "./movie-card.scss";

// Axios is a package to send client requests; it hooks frontend code up with API
import axios from "axios";

import { Link } from "react-router-dom";

export class MovieCard extends React.Component {
  constructor(props) {
    super(props);
    var favArray = this.props.favoriteMovies;
    const movieId = this.props.movie._id;

    if (favArray.indexOf(movieId) > -1) {
      var isActive = true;
    } else {
      isActive = false;
    }

    this.state = {
      active: isActive
    };
  }

  toggleClass() {
    this.setState({ active: !this.state.active });

    const user = this.props.user,
      movieId = this.props.movie._id,
      token = this.props.token;

    console.log(this.state.active);

    if (!this.state.active) {
      axios
        .post(
          "https://cf-movie-list-api.herokuapp.com/users/" +
          user +
          "/movies/" +
          movieId,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        .then(response => {
          console.log(response);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      axios
        .delete(
          "https://cf-movie-list-api.herokuapp.com/users/" +
          user +
          "/movies/" +
          movieId,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        .then(response => {
          console.log(response);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  render() {
    const { movie } = this.props;

    return (
      <CardDeck>
        <Card style={{ width: "16rem" }}>
          <Card.Img variant="top" src={movie.ImagePath} />

          <Card.Body>
            <div className="flexbox">
              <div className="fav-btn">
                <span
                  onClick={this.toggleClass.bind(this)}
                  className={this.state.active ? "favme active" : "favme"}
                >
                  &#x2605;
              </span>
              </div>
            </div>
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
    title: PropTypes.string
  }).isRequired
};