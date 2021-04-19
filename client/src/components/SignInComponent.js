import React, { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./SignInComponent.css";
import Toast from "react-bootstrap/Toast";
import { UserContext } from "../App.js";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [showA, setShowA] = useState(false);
  const [showB, setShowB] = useState(false);
  const { state, dispatch } = useContext(UserContext);

  const postData = () => {
    function validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    const emailValid = validateEmail(email);
    setIsValid(emailValid);
    const body = JSON.stringify({
      email: email,
      password: password,
    });
    if (emailValid) {
      setShowA(false);
      axios
        .post("https://instagramclonebc.herokuapp.com/auth/signin/", body, {
          headers: {
            "content-type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.err) {
            setSignedIn(false);
            setShowB(true);
          } else {
            localStorage.setItem("jwt", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            dispatch({ type: "USER", payload: response.data.user });

            setSignedIn(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("not valid");
      setShowA(true);
    }
  };
  return (
    <Form>
      {signedIn ? (
        <Redirect to="/" />
      ) : (
        <Toast
          className="bg-danger text-white mt-0 d-block"
          onClose={() => {
            setShowB(!showB);
          }}
          show={showB}
          delay={3000}
          autohide
        >
          <Toast.Header className="bg-danger text-white">
            <strong className="mr-auto ">Incorrect Email or Password</strong>
          </Toast.Header>
        </Toast>
      )}
      <Form.Text as="h2">Instagram</Form.Text>
      {isValid ? (
        ""
      ) : (
        <Toast
          className="bg-danger text-white mt-0 d-block"
          onClose={() => {
            setShowA(!showA);
          }}
          show={showA}
          delay={3000}
          autohide
        >
          <Toast.Header className="bg-danger text-white">
            <strong className="mr-auto ">Input a valid Email</strong>
          </Toast.Header>
        </Toast>
      )}
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="email"
          placeholder=" email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        block
        onClick={(e) => {
          e.preventDefault();

          postData();
        }}
      >
        Log in
      </Button>
      <br />
      <Form.Text as="small">
        Don't have an account{" "}
        <Link to="/signup">
          <strong>Sign up</strong>
        </Link>
      </Form.Text>
    </Form>
  );
};

export default SignIn;
