import React, { Component } from "react";

import config from "_variable";

class JoinContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      password: "",
      nickname: "",
      error: ""
    };
    this.handleSignup = this.handleSignup.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSignup() {
    let bodyData = {
      username: this.state.id,
      password: this.state.password,
      nickname: this.state.nickname
    };
    fetch(config.serverUrl + "/api/users/signup", {
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
            this.props.routeMethod.history.push("/login");
            break;
          case 400:
            this.setState({
              error:
                res.alert.wrong ||
                res.alert.username ||
                res.alert.password ||
                res.alert.nickname
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
      <div>
        <>
          <div className="left">
            <div className="logo">MakeAChat</div>
            <br />
            <br />
            <div className="announce">
              Register Account
              <br />
              and Use MakeAChat freely
            </div>
            <div className="login-box">
              <input
                name="id"
                type="text"
                className="login_input"
                onChange={this.handleChange}
                value={this.state.id}
                placeholder="아이디"
              />

              <br />

              <input
                name="password"
                type="password"
                className="login_input"
                onChange={this.handleChange}
                value={this.state.password}
                placeholder="비밀번호"
              />
              <br />

              <input
                name="nickname"
                type="text"
                className="login_input"
                onChange={this.handleChange}
                value={this.state.nickname}
                placeholder="닉네임"
              />
              <br />
            </div>

            <div className="signup_button" onClick={this.handleSignup}>
              회원가입
            </div>
          </div>

          <div className="right">
            <div className="main-text">
              Download MakeAChat,
              <br /> Make Chat Better!
            </div>
            <div className="check-box">
              <br />
              <p>
                <img src="img/check-box.png" /> 1:1 Chat
              </p>
              <p>
                <img src="img/check-box.png" /> Group Message
              </p>
              <p>
                <img src="img/check-box.png" /> Modern UI
              </p>
            </div>
          </div>

          <div>{this.state.error}</div>
        </>
      </div>
    );
  }
}

export default JoinContainer;
