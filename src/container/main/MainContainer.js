import React, { Component } from "react";

import JoinLink from "component/JoinLink";
import LoginLink from "component/LoginLink";

class MainContainer extends Component {
  render() {
    return (
      <div>
        <JoinLink />
        <LoginLink />
      </div>
    );
  }
}

export default MainContainer;
