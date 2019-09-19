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

import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";

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


//declare and export components
export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      movies: [],
      user: null,
      email: null,
      birthday: null,
      favoriteMovies: []
    };
  }

  getMovies(token) {
    axios
      .get("https://cf-movie-list-api.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(error => {
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

  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      let user = localStorage.getItem("user");
      this.setState({
        user: localStorage.getItem("user")
      });
      this.getMovies(accessToken);
      this.getUser(user, accessToken);
    }
  }

  onUpdate(user) {
    localStorage.setItem("user", user);
  }

  onLoggedIn = authData => {
    this.setState({
      user: authData.user.Username
    });
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
  };

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
    const {
      movies,
      user,
      open,
      email,
      birthday,
      token,
      favoriteMovies
    } = this.state;

    if (!user)
      return (
        <div className="login-page">
          <div className="container">
            <div className="label">
              Welcome! Please login to access The Movie List:
            </div>
            <div className="value">
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </div>
          </div>
          <div className="container">
            <div className="label">
              New to The Movie List? Please
              <Button
                onClick={() => this.setState({ open: !open })}
                aria-controls="example-collapse-text"
                aria-expanded={open}
                variant="link"
              >register</Button> below
            </div>
            <Collapse in={this.state.open}>
              <div className="value">
                <RegistrationView onLoggedIn={user => this.onLoggedIn(user)} />
              </div>
            </Collapse>
          </div>
        </div>
      );

    if (user && movies.length < 1)
      return (
        <Router>
          <Route
            exact
            path="/profile/delete"
            render={() => (
              <ProfileDelete
                user={user}
                onDelete={user => this.onDelete(user)}
              />
            )}
          />
        </Router>
      );

    // Before the movies have been loaded
    if (!movies || !movies.length) return <div className="main-view" />;

    return (
      <Router>
        <div className="main-view">
          <Container>
            <Navbar bg="primary" variant="dark">
              <Link to={`/`}>
                <Button
                  onClick={() => this.onLogout()}
                  className="logout-btn"
                  variant="primary"
                >
                  Log out
              </Button>
              </Link>
              <Nav>
                {/*<Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                  Hello, {user}!
              </Nav.Link>
              </Nav.Item>*/}
                <Nav.Item>
                  <Nav.Link href="/profile">Profile</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/movies">Movies</Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar>

            <Row>
              <Route
                exact
                path="/"
                render={() =>
                  movies.map(m => (
                    <MovieCard
                      key={m._id}
                      movie={m}
                      user={user}
                      token={token}
                      favoriteMovies={favoriteMovies}
                    />
                  ))
                }
              />
              <Route
                exact
                path="/movies"
                render={() =>
                  movies.map(m => (
                    <MovieCard
                      key={m._id}
                      movie={m}
                      user={user}
                      token={token}
                      favoriteMovies={favoriteMovies}
                    />
                  ))
                }
              />
              <Route
                exact
                path="/movies/:movieId"
                render={({ match }) => (
                  <MovieView
                    movie={movies.find(m => m._id === match.params.movieId)}
                  />
                )}
              />
              <Route
                exact
                path="/profile"
                render={() => (
                  <ProfileView
                    user={user}
                    email={email}
                    birthday={birthday}
                    favoriteMovies={favoriteMovies}
                    token={token}
                  />
                )}
              />
              <Route
                exact
                path="/profile/update"
                render={() => (
                  <ProfileUpdate
                    user={user}
                    token={token}
                    onUpdate={user => this.onUpdate(user)}
                  />
                )}
              />
              <Route
                path="/directors/:name"
                render={({ match }) => {
                  if (!movies || !movies.length)
                    return <div className="main-view" />;
                  return (
                    <DirectorView
                      director={
                        movies.find(m => m.Director.Name === match.params.name)
                          .Director
                      }
                    />
                  );
                }}
              />
              <Route
                path="/genres/:type"
                render={({ match }) => {
                  if (!movies || !movies.length)
                    return <div className="main-view" />;
                  return (
                    <GenreView
                      genre={
                        movies.find(m => m.Genre.Type === match.params.type).Genre
                      }
                    />
                  );
                }}
              />
              <Route
                path="/ratings/:type"
                render={({ match }) => {
                  if (!movies || !movies.length)
                    return <div className="main-view" />;
                  return (
                    <RatingView
                      rating={
                        movies.find(m => m.Rating.Type === match.params.type).Rating
                      }
                    />
                  );
                }}
              />
            </Row>
          </Container>
        </div>
      </Router >
    );
  }
}
