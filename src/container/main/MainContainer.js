import React, { Component } from "react";

import JoinLink from "component/JoinLink";
import LoginLink from "component/LoginLink";

import "./MainContainer.scss";

import main_font from "img/main_font.jpg";
import tablet from "img/tablet.jpg";

class MainContainer extends Component {
  componentDidMount() {
    console.log("Main");
  }

  render() {
    return (
      <div className="main_container">
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
              <img src={main_font} alt="main_font" width="75%" height="90%" />
              <img src={tablet} alt="tablet" width="22%" height="60%" />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default MainContainer;
