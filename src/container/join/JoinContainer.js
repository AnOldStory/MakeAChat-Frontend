import React, { Component } from "react";

import Loading from "component/Loading";

import config from "_variable";

import "./JoinContainer.scss";

import check_box from "img/check-box.png";

class JoinContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      password: "",
      nickname: "",
      error: "",
      loading: 0
    };
    this.handleEnter = this.handleEnter.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleMain = this.handleMain.bind(this);
  }

  componentDidMount() {
    console.log("Join");
  }

  handleEnter(e) {
    if (e.key === "Enter") {
      this.handleSignup();
    }
  }

  handleSignup() {
    this.setState({
      loading: 1
    });
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
            return true;
          case 400:
            this.setState({
              error:
                res.alert.wrong ||
                res.alert.username ||
                res.alert.password ||
                res.alert.nickname,
              loading: 0
            });
            break;
          default:
            break;
        }
        return false;
      })
      .then(res => {
        if (res) this.props.routeMethod.history.push("/login");
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

  handleLogin() {
    this.props.routeMethod.history.push("/login");
  }

  handleMain() {
    this.props.routeMethod.history.push("/");
  }

  render() {
    return (
      <div className="join_container">
        <>
          {this.state.loading ? <Loading /> : ""}
          <div className="left">
            <div className="logo pointer" onClick={this.handleMain}>
              MakeAChat
            </div>
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
                placeholder="ID"
              />

              <br />

              <input
                name="password"
                type="password"
                className="login_input"
                onChange={this.handleChange}
                value={this.state.password}
                placeholder="Password"
              />
              <br />

              <input
                name="nickname"
                type="text"
                className="login_input"
                onChange={this.handleChange}
                value={this.state.nickname}
                placeholder="Nickname"
                onKeyDown={this.handleEnter}
              />
              <br />
            </div>
            <div className="err">{this.state.error}</div>
            <div className="signup_button pointer" onClick={this.handleSignup}>
              회원가입
            </div>
            <div className="BackToLogin">
              이미 회원이신가요?
              <u className="pointer" onClick={this.handleLogin}>
                로그인하기
              </u>
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
                <img src={check_box} alt="img" /> 1:1 Chat
              </p>
              <p>
                <img src={check_box} alt="img" /> Group Message
              </p>
              <p>
                <img src={check_box} alt="img" /> Modern UI
              </p>
            </div>
          </div>
        </>
      </div>
    );
  }
}

export default JoinContainer;
