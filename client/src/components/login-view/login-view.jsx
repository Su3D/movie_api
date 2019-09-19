import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./login-view.scss";

// Axios is a package to send client requests; it hooks frontend code up with API
import axios from "axios";

export function LoginView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post("https://cf-movie-list-api.herokuapp.com/login", {
        Username: username,
        Password: password
      })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
        window.open("/movies", "_self");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <Form>
      <Form.Group controlId="loginUsername">
        <Form.Label>Username: </Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </Form.Group>
      <Form.Group controlId="loginPassword">
        <Form.Label>Password: </Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleSubmit}>Login</Button>
    </Form>
  );
}