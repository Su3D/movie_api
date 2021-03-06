//import modules and files
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Link } from 'react-router-dom';

import { setMovies, setLoggedInUser } from '../../actions/actions';

import MoviesList from '../movies-list/movies-list';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import MovieView from '../movie-view/movie-view';
import DirectorView from '../director-view/director-view';
import RatingView from '../rating-view/rating-view';
import GenreView from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';

import Button from 'react-bootstrap/Button';

import './main-view.scss';

export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    //authentication
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
      this.getUser(accessToken);
    }
  }

  //get list of all movies
  getMovies(token) {
    axios.get('https://cf-movie-list-api.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setMovies(response.data);
        localStorage.setItem('movies', JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // get user
  getUser(token) {
    let username = localStorage.getItem('user');
    axios.get(`https://cf-movie-list-api.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setLoggedInUser(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //logging in
  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username
    });
    this.props.setLoggedInUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  //registrate new user
  onSignedIn(user) {
    this.setState({
      user: user
    });
  }

  //logut function for LogOut button
  logOut() {
    //clears storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('movies');

    //resets user state to render again
    this.setState({
      user: null
    });

    //make sure login screen appears after logging out
    window.open('/', '_self');
  }

  render() {
    const { user } = this.state;

    return (
      <Router>
        <header>
          <h1 className="appName">The Movie List</h1>
        </header>
        <div className="main-view">
          {user &&
            <div className="navbar">
              <Link to={'/profile'}><Button variant="outline-dark">Profile</Button></Link>
              <Button variant="outline-dark" onClick={() => this.logOut()}>Logout</Button>
            </div>
          }

          <Route exact path="/" render={() => {
            if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
            return <MoviesList />;
          }}
          />

          <Route exact path="/movies/:id" render={({ match }) => <MovieView movieId={match.params.id} />} />

          <Route exact path="/ratings/:type" render={({ match }) => <RatingView ratingType={match.params.type} />} />

          <Route exact path="/genres/:type" render={({ match }) => <GenreView genreType={match.params.type} />} />

          <Route exact path="/directors/:name" render={({ match }) => <DirectorView directorName={match.params.name} />} />

          <Route exact path="/register" render={() => <RegistrationView onSignedIn={user => this.onSignedIn(user)} />} />

          <Route exact path="/profile" render={() => <ProfileView />} />
        </div>
      </Router>
    );//return
  }//render
}

export default connect(null, { setMovies, setLoggedInUser })(MainView);


