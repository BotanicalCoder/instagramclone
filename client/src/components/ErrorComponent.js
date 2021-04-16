import React from "react";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <section>
      <h1> 404 </h1>
      <h4>page not found</h4>
      <Link to="/signin">
        <Button>Sign In</Button>
      </Link>
    </section>
  );
};

export default Error;
