import React, { Component } from "react";

import JoinLink from "component/JoinLink";
import LoginLink from "component/LoginLink";

import "./MainContainer.css";

class MainContainer extends Component {
  render() {
    return (
      <div className="main">
        <header>
          <h1>MAKE A CHAT</h1>
          <nav>
            <JoinLink />
            <LoginLink />
          </nav>
        </header>
        <main>
          <div className="container">
            <div id="font">
              <img
                src="img/main_font.jpg"
                alt="main_font"
                width="75%"
                height="90%"
              />
              <img src="img/tablet.jpg" alt="tablet" width="22%" height="60%" />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default MainContainer;
