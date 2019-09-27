//import modules and files
import React from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { Link } from 'react-router-dom';

import './profile-view.scss';

/* ProfileView */
export class ProfileView extends React.Component {
  constructor() {
    super();

    this.state = {
      username: null,
      password: null,
      email: null,
      birthday: null,
      userData: null,
      FavoriteMovies: [],
      usernameForm: null,
      passwordForm: null,
      emailForm: null,
      birthdayForm: null
    };

  }

  componentDidMount() {
    //authentication
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(accessToken);
    }
  }

  //get user
  getUser(token) {
    let username = localStorage.getItem('user');
    console.log("username: " + username);
    axios.get(`https://cf-movie-list-api.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          userData: response.data,
          username: response.data.Username,
          password: response.data.Password,
          email: response.data.Email,
          birthday: response.data.Birthday,
          FavoriteMovies: response.data.FavoriteMovies
        });
        console.log("email", this.state.email)
      })
      .catch(function (error) {
        console.log('errors', error);
      });
  }

  //delete user
  deleteUser(event) {
    event.preventDefault();
    axios.delete(`https://cf-movie-list-api.herokuapp.com/users/${localStorage.getItem('user')}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        alert('Your Account has been deleted!');
        //clears storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        //opens login view
        window.open('/', '_self');
      })
      .catch(event => {
        alert('failed to delete user');
      });
  }

  // delete movie from list
  deleteMovie(event, FavoriteMovies) {
    event.preventDefault();
    axios.delete(`https://cf-movie-list-api.herokuapp.com/users/${localStorage.getItem('user')}/movies/${FavoriteMovies}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        // update state with current movie data
        this.getUser(localStorage.getItem('token'));
      })
      .catch(event => {
        alert('Snap something went wrong while deleting this movie from favorite list');
      });
  }

  //handle the changes
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  //update user data
  handleSubmit(event) {
    event.preventDefault();
    axios.put(`https://cf-movie-list-api.herokuapp.com/users/${localStorage.getItem('user')}`, {
      Username: this.state.usernameForm,
      Password: this.state.passwordForm,
      Email: this.state.emailForm,
      Birthday: this.state.birthdayForm
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        alert('Your data has been updated!');
        //update localStorage
        localStorage.setItem('user', this.state.usernameForm);
        // call getUser() to dusplay changed userdata after submission
        this.getUser(localStorage.getItem('token'));
        // reset form after submitting data
        document.getElementsByClassName('changeDataForm')[0].reset();
      })
      .catch(event => {
        console.log('error updating the userdata');
        alert('Oops... Something went wrong, can\'t update your info!');
      });
  };

  //toggle CHangeData form
  toggleForm() {
    let form = document.getElementsByClassName('changeDataForm')[0];
    let toggleButton = document.getElementById('toggleButton');
    form.classList.toggle('show-form');
    if (form.classList.contains('show-form')) {
      toggleButton.innerHTML = 'Update Profile Data &uarr;';
    } else {
      toggleButton.innerHTML = 'Update Profile Data &darr;';
    }
  }

  render() {
    const { userData, username, email, birthday, FavoriteMovies } = this.state;
    if (!userData) return null;
    return (
      <div className="profile-view">
        <h2>Profile Data</h2>
        <div className="username">
          <div className="label">Name</div>
          <div className="value">{username}</div>
          {console.log("username in renders return: ", username)}
        </div>
        <div className="password">
          <div className="label">Password</div>
          <div className="value">******</div>
        </div>
        <div className="birthday">
          <div className="label">Birthday</div>
          <div className="value">{birthday.substr(-24, 10)}</div>
        </div>
        <div className="email">
          <div className="label">Email</div>
          <div className="value">{email}</div>
        </div>
        <div className="FavoriteMovies">
          <div className="label">Favorite Movies</div>
          {FavoriteMovies.length === 0 &&
            <div className="value">You don't have any favorite movies.</div>
          }
          {FavoriteMovies.length > 0 &&
            <div className="value">{FavoriteMovies.map(FavoriteMovies => (<p key={FavoriteMovies}>{JSON.parse(localStorage.getItem('movies')).find(movie => movie._id === FavoriteMovies).Title}<span style={{ fontSize: '70%', cursor: 'pointer' }} onClick={(event) => this.deleteMovie(event, FavoriteMovies)}> [Remove from list.]</span></p>))}</div>
          }

          {console.log("FavoriteMovies in renders return: ", FavoriteMovies)}
        </div>


        <Button id="toggleButton" className="view-btn" variant="primary" type="button" onClick={() => this.toggleForm()}>Change Profile Data &darr;</Button>
        <Button className="view-btn" variant="primary" type="button" onClick={(event) => this.deleteUser(event)}>Delete Profile</Button>


        <Form className="changeDataForm">
          <h2>Update Profile Data</h2>
          <Form.Group controlId="formBasicUsername">
            <Form.Label >Username</Form.Label>
            <Form.Control type="text" name="usernameForm" onChange={event => this.handleChange(event)} placeholder="Enter Username" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="passwordForm" onChange={event => this.handleChange(event)} placeholder="Password" />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="emailForm" onChange={event => this.handleChange(event)} placeholder="example@email.com" />
          </Form.Group>

          <Form.Group controlId="formBasicBirthday">
            <Form.Label>Birthday</Form.Label>
            <Form.Control type="date" name="birthdayForm" onChange={event => this.handleChange(event)} placeholder="dd/mm/yyyy" />
          </Form.Group>

          <Button variant="primary" type="button" onClick={event => this.handleSubmit(event)} >Update Profile</Button>
        </Form>

        <p><Link to={'/'}><Button variant="outline-info" size="sm" type="button">Back to Movie List</Button></Link></p>
      </div >
    );//return
  }//render
}


