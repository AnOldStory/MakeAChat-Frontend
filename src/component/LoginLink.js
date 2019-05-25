import React, { Component } from "react";
import { Link } from "react-router-dom";

class LoginLink extends Component {
  render() {
    return (
      <div>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export default LoginLink;
