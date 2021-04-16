import React, { useState, useEffect, useMemo } from "react";
import { Link, Redirect } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import "./SignInComponent.css";
import axios from "axios";
const SignUp = () => {
  const [userName, setUsername] = useState("");
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidMail, setInvalidMail] = useState();
  const [formCompleted, setFormCompleted] = useState(false);
  const [showA, setShowA] = useState(false);
  const [isSignedUp, setIsSignedup] = useState(false);

  const postData = useMemo(() => {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      console.log("invalid mail");
      setShowA(true);
      setInvalidMail(true);
      return;
    } else if (formCompleted === false) {
      return;
    } else {
      setInvalidMail(false);
      console.log("form submitted");
      const body = JSON.stringify({
        username: userName,
        name: fullName,
        email: email,
        password: password,
      });
      axios
        .post("https://instagramclonebc.herokuapp.com/auth/signup", body, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          if (response.data.success) {
            console.log(response);
            setIsSignedup(true);
          } else {
            console.log(response);
            console.log("please enter all fields");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userName, fullName, email, password, formCompleted]);

  useEffect(() => {
    if (formCompleted) {
      return postData;
    }
  }, [postData, formCompleted]);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {isSignedUp ? (
        <Redirect to="/signin" />
      ) : (
        <>
          <Form.Text as="h2">Instagram</Form.Text>
          <Form.Group controlId="formBasicTextFullname">
            <Form.Control
              type="text"
              placeholder="fullname"
              onChange={(e) => {
                setFullname(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="formBasicTextUsername">
            <Form.Control
              type="text"
              placeholder="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </Form.Group>

          {!invalidMail ? (
            ""
          ) : (
            <Toast
              className="bg-danger text-white mt-0 d-block"
              onClose={() => {
                setShowA(!showA);
              }}
              show={showA}
              delay={1000}
              autohide
            >
              <Toast.Header className="bg-danger text-white">
                <strong className="mr-auto ">Input a valid Email format</strong>
              </Toast.Header>
            </Toast>
          )}

          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
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
              console.log("submit clicked");

              setFormCompleted(true);
            }}
          >
            Sign Up
          </Button>
          <br />
          <Form.Text as="small">
            Already have an account{" "}
            <Link to="/signin">
              <strong>Sign in</strong>
            </Link>
          </Form.Text>
        </>
      )}
    </Form>
  );
};

export default SignUp;
