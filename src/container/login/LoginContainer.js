import React, { Component } from "react";

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      password: "",
      token: "",
      error: "",
      isLogin: false
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleLogin() {
    let bodyData = {
      username: this.state.id,
      password: this.state.password
    };
    fetch("http://localhost:3001/api/users/login", {
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
        console.log(res);
        console.log(this.props);
        switch (res.code) {
          case 200:
            this.setState({
              token: res.token,
              isLogin: true
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
      <div>
        {this.state.isLogin === false ? (
          <>
            <input
              type="text"
              name="id"
              onChange={this.handleChange}
              value={this.state.id}
            />
            <input
              name="password"
              type="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
            <button onClick={this.handleLogin}>로그인</button>
            <div>{this.state.error}</div>
          </>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default LoginContainer;
