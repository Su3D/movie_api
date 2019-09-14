//import modules and files
import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './profile-view.scss';

import { Link } from "react-router-dom";

export function ProfileView(props) {
  const username = props.user,
    email = props.email,
    birthday = props.birthday;

  return (
    <div className="user-profile">
      <Button className="deregister-btn" variant="primary">
        Delete profile
      </Button>
      <div className="container">
        <div className="label h5">User Profile</div>
        <div className="value">Username: {username}</div>
        <div className="value">Password: ********</div>
        <div className="value">Email: {email}</div>
        <div className="value">Birthday: {birthday.substr(0, 10)}</div>
        <Link to={`/userprofile/update`}>
          <Button className="update-btn" variant="link">
            Update user info...
          </Button>
        </Link>
      </div>
      <div className="container">
        <div className="label h5">Favorite movies</div>
      </div>
    </div>
  );
}

export function ProfileUpdate(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const user = props.user;
  const token = props.token;

  const handleUpdate = e => {
    e.preventDefault();
    axios
      .put(
        "https://cf-movie-list-api.herokuapp.com/users/" + user,
        {
          headers: { Authorization: `Bearer ${token}` }
        },
        {
          Username: username,
          Password: password,
          Email: email,
          Birthday: birthday
        }
      )
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(e => {
        console.log("Error updating the user info.");
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
            placeholder="Please provide your birthday in format mm-dd-yyyy"
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