import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Axios is a package to send client requests; it hooks frontend code up with API
import axios from "axios";

export function RegistrationView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleRegister = e => {
    e.preventDefault();
    axios
      .post("https://cf-movie-list-api.herokuapp.com/users", {
        Username: username,
        Password: password,
        Email: email,
        Birthday: birthday
      })
      .then(() => {
        axios
          .post("https://cf-movie-list-api.herokuapp.com/login", {
            Username: username,
            Password: password
          })
          .then(response => {
            console.log(response);
            const data = response.data;
            props.onLoggedIn(data);
            window.open("/movies", "_self");
          });
      })
      .catch(e => {
        console.log("Error registering the user.");
      });
  };

  return (
    <Form>
      <Form.Group controlId="formUsername">
        <Form.Label>Username: </Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Choose a username."
        />
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Password: </Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Choose a password."
        />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Email: </Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Please enter your email address."
        />
      </Form.Group>
      <Form.Group controlId="formBirthday">
        <Form.Label>Birthday: </Form.Label>
        <Form.Control
          type="date"
          value={birthday}
          onChange={e => setBirthday(e.target.value)}
          placeholder="Please enter your birthday as mm-dd-yyyy."
        />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleRegister}>
        Register
      </Button>
    </Form>
  );
}