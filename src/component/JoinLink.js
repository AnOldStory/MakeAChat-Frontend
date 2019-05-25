import React, { Component } from "react";
import { Link } from "react-router-dom";

class JoinLink extends Component {
  render() {
    return (
      <div>
        <Link to="/join">Join</Link>
      </div>
    );
  }
}

export default JoinLink;
