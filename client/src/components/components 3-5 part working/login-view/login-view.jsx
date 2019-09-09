//import modules and files
import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './login-view.scss';

//declare and export components
export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    //send request to server for authentication
    axios.post('https://cf-movie-list-api.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(e => {
        console.log('No user with that username.');
      });
  };

  return (
    <div className="login-view">
      <h1>The Movie List</h1>
      <h2>Login</h2>
      <Form className="login-form">
        <Form.Group controlId="formBasicEmail">
          <Form.Label >Username</Form.Label>
          <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <Form.Text className="text-muted">Enter your username above.</Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <Form.Text className="text-muted">Enter your password above.</Form.Text>
        </Form.Group>

        <Button type="button" variant="primary" onClick={handleSubmit}>Login</Button>
      </Form>

      <h3>New User</h3>
      <p>New to The Movie List? Sign-up for access using the button below:</p>
      <Button type="button" variant="outline-secondary" size="sm" onClick={() => props.onClick()}>Register</Button>
    </div>
  )
}

//validate data existence and type
LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};