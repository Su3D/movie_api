//import modules and files
import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './login-view.scss';

/* LoginView */
export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('https://cf-movie-list-api.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(event => {
        alert('no such user: ' + username);
      });
  };

  return (
    <Form className="login-view">
      <h2>Login</h2>
      <Form.Group controlId="formBasicEmail">
        <Form.Label >Username</Form.Label>
        <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Username" />
        <Form.Text className="text-muted">
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      </Form.Group>

      <Button variant="primary" type="button" onClick={handleSubmit}>Login</Button>

      <hr></hr>
      <h3>New user?</h3>
      <p>Register for a Movie List profile.</p>
      <Link to={'/register'}><Button variant="outline-primary" size="sm">Register</Button></Link>
    </Form>
  );//return
}

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired
};

