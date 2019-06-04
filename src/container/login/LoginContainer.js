import React, { Component } from "react";

import config from "_variable";

import "./LoginContainer.css";

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      password: "",
      token: "",
      error: ""
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleLogin() {
    let bodyData = {
      username: this.state.id,
      password: this.state.password
    };
    fetch(config.serverUrl + "/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: Object.keys(bodyData)
        .map(
          key =>
            encodeURIComponent(key) + "=" + encodeURIComponent(bodyData[key])
        )
        .join("&")
    })
      .then(res => res.json())
      .then(res => {
        switch (res.code) {
          case 200:
            this.setState({
              token: res.token
            });
            this.props.handleToken({
              token: res.token,
              nickname: res.nickname
            });
            this.props.routeMethod.history.push("/chat");
            break;
          case 400:
            this.setState({
              error: res.alert.wrong || res.alert.username || res.alert.password
            });
            break;
          default:
            break;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <div className="login_container">
        <>
          <div className="left">
            <div className="logo">MakeAChat</div>
            <br />
            <br />
            <div className="announce">
              Login with
              <br /> Make A Chat Account
            </div>
            <div className="login-box">
              <input
                className="login_input"
                type="text"
                name="id"
                onChange={this.handleChange}
                value={this.state.id}
                placeholder="ID"
              />
              <input
                className="login_input"
                name="password"
                type="password"
                onChange={this.handleChange}
                value={this.state.password}
                placeholder="Password"
              />
            </div>
            <div className="login_button" onClick={this.handleLogin}>
              Login
            </div>
            <div className="signup_button">Sign Up</div>
          </div>

          <div className="right">
            <div className="main-text">
              <h1>
                Download MakeAChat,
                <br />
                Make Chat Better!
              </h1>
            </div>
            <div className="check-box">
              <br />
              <p>
                <img src="/img/check-box.png" alt="img" /> 1:1 Chat
              </p>
              <p>
                <img src="/img/check-box.png" alt="img" /> Group Message
              </p>
              <p>
                <img src="/img/check-box.png" alt="img" /> Modern UI
              </p>
            </div>
          </div>
          <div>{this.state.error}</div>
        </>
      </div>
    );
  }
}

export default LoginContainer;
