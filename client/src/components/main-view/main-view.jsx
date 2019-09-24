//import modules and files
import React from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Collapse from "react-bootstrap/Collapse";

import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";

// #0
import { setMovies } from '../../actions/actions';

import MoviesList from '../movies-list/movies-list';
import { LoginView } from "../login-view/login-view";
import { RegistrationView } from "../registration-view/registration-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { DirectorView } from "../director-view/director-view";
import { GenreView } from "../genre-view/genre-view";
import { RatingView } from "../rating-view/rating-view";
import { ProfileView } from "../profile-view/profile-view";
import { ProfileUpdate } from "../profile-view/profile-view";
import { ProfileDelete } from "../profile-view/profile-view";

import "./main-view.scss";


//declare components 
class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      user: null,
      email: null,
      birthday: null,
      favoriteMovies: []
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }


  getMovies(token) {
    axios.get('https://cf-movie-list-api.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // #1
        this.props.setMovies(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getUser(user, token) {
    axios
      .get("https://cf-movie-list-api.herokuapp.com/users/" + user, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        // Assign the result to the state
        this.setState({
          email: response.data.Email,
          birthday: response.data.Birthday,
          favoriteMovies: response.data.FavoriteMovies,
          token: token
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  onUpdate(user) {
    localStorage.setItem("user", user);
  }

  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username
    });
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  onLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    this.setState({
      user: null,
      email: null,
      birthday: null,
      favoriteMovies: [],
      token: null
    });
  }

  onDelete() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    this.setState({
      user: null,
      email: null,
      favoriteMovies: [],
      token: null
    });
  }

  render() {

    // #2
    let { movies } = this.props;
    let { user, open, email, birthday, token, favoriteMovies } = this.state;

    return (
      <Router basename="/client">
        <div className="main-view">
          <Route exact path="/" render={() => {
            if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
            return <MoviesList movies={movies} />;
          }} />
          <Route path="/register" render={() => <RegistrationView />} />
          <Route path="/movies/:movieId" render={({ match }) => <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />
        </div>
      </Router>
    );
  }
}

// #3
let mapStateToProps = state => {
  return { movies: state.movies }
}

// #4
export default connect(mapStateToProps, { setMovies })(MainView);
