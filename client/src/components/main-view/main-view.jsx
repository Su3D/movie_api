//import modules and files
import React from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { RatingView } from '../rating-view/rating-view';
import { ProfileView } from "../profile-view/profile-view";


import './main-view.scss';

//declare and export components
export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      user: null,
      profileData: null
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

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username,
      profileData: authData.user
    });
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  onLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    this.setState({
      user: null
    });

    window.open('/', '_self');
  }


  getMovies(token) {
    axios.get('https://cf-movie-list-api.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({ //assign result to state
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onSignedIn(user) {
    this.setState({
      user: user
    });
  }


  /*possibly don't need anymore???
  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  getBackClick() {
    this.setState({
      selectedMovie: null
    });
  }

  onSignedIn(user) {
    this.setState({
      user: user,
      register: false
    });
  }

  register() {
    this.setState({
      register: true
    })
  }

  alreadyMember() {
    this.setState({
      register: false
    })
  }
  */

  render() {
    const { movies, user, profileData } = this.state;

    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
    if (!movies) return <div className="main-view" />;

    return (
      <Router>
        <div className="main-view">
          <Container>
            <Row className="nav">
              <Button onClick={() => this.onLogout()} className="logout-btn" variant="outline-warning" size="sm">Log Out</Button>
              <Link to="/profile"><Button variant="outline-warning" size="sm">Profile</Button></Link>
            </Row>
            <Row>
              <Route exact path="/" render={() => {
                if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
                return movies.map(m => <MovieCard key={m._id} movie={m} />)
              }
              } />

              <Route path="/register" render={() => <RegistrationView />} />

              <Route exact path="/profile" render={() => <ProfileView />} />

              <Route path="/movies/:movieId" render={({ match }) => <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />

              <Route path="/directors/:name" render={({ match }) => {
                if (!movies) return <div className="main-view" />;
                return <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} />
              }
              } />

              <Route path="/genres/:type" render={({ match }) => {
                if (!movies) return <div className="main-view" />;
                return <GenreView genre={movies.find(m => m.Genre.Type === match.params.type).Genre} />
              }
              } />

              <Route path="/ratings/:type" render={({ match }) => {
                if (!movies) return <div className="main-view" />;
                return <RatingView rating={movies.find(m => m.Rating.Type === match.params.type).Rating} />
              }
              } />
            </Row>
          </Container>
        </div>
      </Router>
    );
  }



  /*old render
  render() {
    const { movies, selectedMovie, user, register } = this.state;

    if (!user && register === false) return <LoginView onClick={() => this.register()} onLoggedIn={user => this.onLoggedIn(user)} />

    if (register) return <RegistrationView onClick={() => this.alreadyMember()} onSignedIn={user => this.onSignedIn(user)} />

    if (!movies) return <div className="main-view" />;
    return (
      <div className="main-view">
        <Container>
          <Row>
            {selectedMovie
              ? <MovieView movie={selectedMovie} onClick={() => this.getBackClick()} />
              : movies.map(movie => (
                <Col key={movie._id} xl={3} md={4} sm={6} xs={12}>
                  <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
                </Col>
              ))
            }
          </Row>
        </Container>
      </div>
    );
  }
  */

}
