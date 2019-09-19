import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./profile-view.scss";

// Axios is a package to send client requests; it hooks frontend code up with API
import axios from "axios";

import { Link } from "react-router-dom";

export function ProfileView(props) {
  const username = props.user,
    email = props.email,
    birthday = props.birthday,
    favoriteMovies = props.favoriteMovies,
    token = props.token;

  const handleDelete = e => {
    e.preventDefault();
    axios
      .delete("https://cf-movie-list-api.herokuapp.com/users/" + username, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        console.log(token);
        window.open("/profile/delete", "_self");
      })
      .catch(e => {
        console.log("Error deleting the user profile.");
      });
  };

  return (

    <div className="profile-view">
      <h1>User Profile</h1>
      <div className="username">
        <div className="label">Name</div>
        <div className="value">{username}</div>
      </div>
      <div className="password">
        <div className="label">Password</div>
        <div className="value">***********</div>
      </div>
      <div className="birthday">
        <div className="label">Birthday</div>
        <div className="value">{birthday}</div>
      </div>
      <div className="email">
        <div className="label">Email</div>
        <div className="value">{email}</div>
      </div>

      <div className="favoriteMovies">
        <div className="label">Favorite Movies</div>
        {favoriteMovies.length === 0 &&
          <div className="value">Your Favorite Movies List is empty.</div>
        }
        {favoriteMovies.length > 0 &&
          <div className="value">{favoriteMovies}</div>
        }
      </div>


      <Link to={`/profile/update`}>
        <Button className="update-btn" variant="primary">
          Update User Data
          </Button>
      </Link>
      <Button
        className="deregister-btn"
        variant="primary"
        onClick={handleDelete}
      >
        Delete profile
      </Button>
    </div>
  );
}

export function ProfileUpdate(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  var user = props.user,
    token = props.token;

  const handleUpdate = e => {
    e.preventDefault();
    axios
      .put(
        "https://cf-movie-list-api.herokuapp.com/users/" + user,
        {
          Username: username,
          Password: password,
          Email: email,
          Birthday: birthday
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(response => {
        if (response.statusText === "OK") {
          props.onUpdate(username);
          window.open("/profile", "_self");
        }
      })
      .catch(e => {
        console.log("Error updating the user info.", e);
      });
  };

  return (
    <div className="user-profile">
      <Form>
        Please update your profile information.
        <Form.Group controlId="formUsername">
          <Form.Label>Username: </Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Pick a username"
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password: </Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Pick a password"
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email: </Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Please provide your email"
          />
        </Form.Group>
        <Form.Group controlId="formBirthday">
          <Form.Label>Birthday: </Form.Label>
          <Form.Control
            type="date"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            placeholder="Please provide your birthday in format mm/dd/yyyy"
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleUpdate}>
          Update
        </Button>
        <Form.Text className="text-muted">
          We will never share your personal information with anyone else.
        </Form.Text>
      </Form>
    </div>
  );
}

export function ProfileDelete(props) {
  const user = props.user;

  return (
    <div className="user-profile">
      <div className="container">
        <div className="label h5">
          Your profile has been successfully deleted from CineStock.
        </div>
        <div className="value">
          We are sorry to see you go but if you change your mind, you are always
          welcome to create a new account.
        </div>
        <div className="value">Have a great day!</div>
        <Button
          variant="primary"
          className="ok-btn"
          onClick={e => window.open("/", "_self") && props.onDelete(user)}
        >
          Ok
        </Button>
      </div>
    </div>
  );
}