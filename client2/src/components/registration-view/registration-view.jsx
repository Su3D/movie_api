import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { Link } from 'react-router-dom';

import './registration-view.scss';

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
        window.open('/', '_self');
      })

  };

  return (
    <div className="registration-view">
      <Form>
        <h2>Sign In</h2>
        <Form.Group controlId="formBasicUsername">
          <Form.Label >Your Username*</Form.Label>
          <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Username" />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Your Password*</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Your Email*</Form.Label>
          <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email must have valid format " />
        </Form.Group>

        <Form.Group controlId="formBasicBirthday">
          <Form.Label>Your Birthday*</Form.Label>
          <Form.Control type="date" value={birthday} onChange={e => setBirthday(e.target.value)} placeholder="dd.mm.yyyy" />
        </Form.Group>

        <Form.Group>
          <p>
            *All fields are required
      </p>
        </Form.Group>

        <Button variant="primary" type="button" onClick={handleSubmit}>
          SIGN IN
        </Button>

        <p>
          <Link to={'/'}><span>Already Member? Login</span></Link>
        </p>
      </Form>
    </div>//registration-view
  );//return
}