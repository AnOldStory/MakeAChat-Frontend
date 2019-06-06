import React, { Component } from "react";

import Loading from "component/Loading";

import config from "_variable";

import "./LoginContainer.scss";

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      password: "",
      token: "",
      error: "",
      loading: 0
    };
    this.handleEnter = this.handleEnter.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log("Login");
  }

  handleEnter(e) {
    if (e.key === "Enter") {
      this.handleLogin();
    }
  }

  handleLogin() {
    this.setState({
      loading: 1
    });
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
            this.props.handleToken({
              token: res.token,
              nickname: res.nickname
            });

            return true;
          case 400:
            this.setState({
              error:
                res.alert.wrong || res.alert.username || res.alert.password,
              loading: 0
            });
            break;
          default:
            break;
        }
        return false;
      })
      .then(res => {
        if (res) this.props.routeMethod.history.push("/chat");
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleJoin() {
    this.props.routeMethod.history.push("/join");
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
          {this.state.loading ? <Loading /> : ""}
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
                onKeyDown={this.handleEnter}
              />
            </div>
            <div className="err">{this.state.error}</div>
            <div className="login_button" onClick={this.handleLogin}>
              Login
            </div>
            <div className="signup_button" onClick={this.handleJoin}>
              Sign Up
            </div>
          </div>

          <div className="right">
            <div className="main-text">
              Download MakeAChat,
              <br />
              Make Chat Better!
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
        </>
      </div>
    );
  }
}

export default LoginContainer;
