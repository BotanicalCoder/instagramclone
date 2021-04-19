import React, { useState, useRef, useContext } from "react";
import "./NavbarComponent.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import Alert from "react-bootstrap/Alert";

import { AiFillHome } from "react-icons/ai";
import { IoExitOutline } from "react-icons/io5";
import { FiPlusCircle } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App.js";
const NavbarComponent = () => {
  const [show, setShow] = useState(false);
  const myRef = React.createRef();
  const target = useRef(myRef);
  const { state, dispatch } = useContext(UserContext);
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();
  const signOut = () => {
    console.log("signed out");
    setShowAlert(true);
  };
  return (
    <>
      <Navbar className="Navbar Navbar--large">
        <Navbar.Brand as="h2" href="#home" className=" Navbar__brand">
          <Link to={state == null ? "/signin" : "/"}>Instagram</Link>
        </Navbar.Brand>

        <Nav className="justify-content-end  Navbar__list">
          <Nav.Link as="p">
            <Link to={state == null ? "/signin" : "/"}>
              <AiFillHome />
            </Link>
          </Nav.Link>

          <Nav.Link as="li">
            <Link to={state == null ? "/signin" : "/createpost"}>
              <FiPlusCircle />
            </Link>
          </Nav.Link>

          <Nav.Link as="li" ref={target}>
            <FaRegUserCircle
              id="collasible-nav-dropdown"
              onClick={() => {
                return !state ? "" : setShow(!show);
              }}
            />
            <Overlay target={target.current} show={show} placement="bottom">
              {(props) => (
                <Tooltip
                  id="overlay-example"
                  placememt="bottom"
                  variant="light"
                  {...props}
                >
                  <Nav.Link as="p" onClick={() => setShow(!show)}>
                    {" "}
                    <Link to={`/profile/${state.username}`}>
                      {" "}
                      My profile{" "}
                    </Link>{" "}
                  </Nav.Link>
                  <Nav.Link as="p" onClick={() => setShow(!show)}>
                    {" "}
                    <Link to="/signin"> Signin</Link>{" "}
                  </Nav.Link>
                </Tooltip>
              )}
            </Overlay>
          </Nav.Link>

          <Nav.Link as="li">
            <AiOutlineHeart />
          </Nav.Link>

          <Nav.Link as="li">
            <IoExitOutline
              onClick={
                state == null
                  ? history.push("/signin")
                  : () => {
                      signOut();
                    }
              }
            />
          </Nav.Link>
        </Nav>
      </Navbar>
      <Alert show={showAlert} variant="danger">
        <Alert.Heading>Are you sure you want to sign out</Alert.Heading>
        <Button
          block
          variant="outline-danger"
          onClick={() => {
            localStorage.clear();
            dispatch({ type: "CLEAR" });
            history.push("/signin");
          }}
        >
          Yes I am sure{" "}
        </Button>{" "}
        <br />{" "}
        <Button
          block
          variant="outline-danger"
          onClick={() => {
            setShowAlert(false);
          }}
        >
          NO{" "}
        </Button>
      </Alert>
    </>
  );
};

export default NavbarComponent;
