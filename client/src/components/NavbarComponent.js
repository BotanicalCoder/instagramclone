import React, { useState, useRef, useContext } from "react";
import "./NavbarComponent.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import { AiFillHome } from "react-icons/ai";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { ImCompass2 } from "react-icons/im";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { UserContext } from "../App.js";
const NavbarComponent = () => {
  const [show, setShow] = useState(false);
  const myRef = React.createRef();
  const target = useRef(myRef);
  const { state } = useContext(UserContext);
  return (
    <Navbar className="Navbar Navbar--large">
      <Navbar.Brand as="h2" href="#home" className=" Navbar__brand">
        <Link to="/">Instagram</Link>
      </Navbar.Brand>

      <Nav className="justify-content-end  Navbar__list">
        <Nav.Link as="p">
          <Link to="/">
            <AiFillHome />
          </Link>
        </Nav.Link>
        <Nav.Link as="li">
          <IoPaperPlaneOutline />
        </Nav.Link>
        <Nav.Link as="li">
          <ImCompass2 />
        </Nav.Link>
        <Nav.Link as="li">
          <AiOutlineHeart />
        </Nav.Link>
        <Nav.Link as="li" ref={target}>
          <FaRegUserCircle
            id="collasible-nav-dropdown"
            onClick={() => setShow(!show)}
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
      </Nav>
    </Navbar>
  );
};

export default NavbarComponent;
