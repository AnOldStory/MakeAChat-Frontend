import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import MainContainer from "container/main/MainContainer";
import JoinContainer from "container/join/JoinContainer";
import LoginContainer from "container/login/LoginContainer";
import ChatContainer from "container/chat/ChatContainer";

class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      nickname: ""
    };
    this.handleToken = this.handleToken.bind(this);
  }

  handleToken(value) {
    this.setState({ token: value.token, nickname: value.nickname });
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={MainContainer} />
          <Route
            exact
            path="/join"
            component={routeMethod => (
              <JoinContainer routeMethod={routeMethod} />
            )}
          />
          <Route
            exact
            path="/login"
            component={routeMethod => (
              <LoginContainer
                routeMethod={routeMethod}
                handleToken={this.handleToken}
              />
            )}
          />
          {this.state.token !== "" ? (
            <Route
              path="/chat"
              component={() => <ChatContainer token={this.state.token} />}
            />
          ) : (
            ""
          )}
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
