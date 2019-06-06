import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import MainContainer from "container/main/MainContainer";
import JoinContainer from "container/join/JoinContainer";
import LoginContainer from "container/login/LoginContainer";
import ChatContainer from "container/chat/ChatContainer";
import PrivateChatContainer from "container/privatechat/PrivateChatContainer";

class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      nickname: "",
      who: ""
    };
    this.handleToken = this.handleToken.bind(this);
    this.handleWho = this.handleWho.bind(this);
  }

  handleToken(value) {
    this.setState({ token: value.token, nickname: value.nickname });
  }

  handleWho(value) {
    this.setState({ who: value });
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
          <Route
            exact
            path="/chat"
            component={routeMethod => (
              <ChatContainer
                routeMethod={routeMethod}
                token={this.state.token}
                nickname={this.state.nickname}
                handleWho={this.handleWho}
              />
            )}
          />
          <Route
            exact
            path="/privatechat"
            component={routeMethod => (
              <PrivateChatContainer
                routeMethod={routeMethod}
                token={this.state.token}
                nickname={this.state.nickname}
                who={this.state.who}
              />
            )}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
