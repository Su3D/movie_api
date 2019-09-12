//import modules and files
import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './registration-view.scss';

import { Link } from "react-router-dom";

//declare and export components
export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('https://cf-movie-list-api.herokuapp.com/users', {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
    })
      .then(response => {
        const data = response.data;
        console.log(data);
        window.open('/', '_self'); //'_self' opens page in current tab
      })
      .catch(e => {
        console.log('There was an error registering the user.')
      });
  };

  /* old version
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(username, password, email, birthday);
    props.onSignedIn(username);
  };
  */

  return (
    <div className="register-view">
      <h1>The Movie List</h1>
      <h2>Register</h2>
      <Form className="register-form">
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" />
        </Form.Group>

        <Form.Group controlId="formBasicBirthday">
          <Form.Label>Birthday</Form.Label>
          <Form.Control type="text" value={birthday} onChange={e => setBirthday(e.target.value)} placeholder="01-01-2000" />
          <Form.Text className="text-muted">Format: mm-dd-yyyy</Form.Text>
        </Form.Group>

        <Button variant="primary" type="button" onClick={handleSubmit}>Submit</Button>
      </Form>

      <h3>Login</h3>
      <p>If you already have an account login using the button below:</p>
      <Link to="/"><Button variant="outline-secondary" size="sm">Login</Button></Link>
    </div>

  );
}

/*
//validate data existence and type
RegistrationView.propTypes = {
  onSignedIn: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};
*/