import React, { Component } from "react";
import io from "socket.io-client";

import LoginLink from "component/LoginLink";

import config from "_variable";

class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.token,
      nickname: this.props.nickname,
      serverUrl: config.serverUrl,
      text: "",
      err: "",
      chats: []
    };
    this.handlePush = this.handlePush.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleResponseErr = this.handleResponseErr.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleMove = this.handleMove.bind(this);
  }

  componentDidMount() {
    /* check global connection */
    this.socket = io.connect(this.state.serverUrl, {
      transports: ["websocket"]
    });
    /* subscribe chat-pull */
    this.socket.on("chat-pull", this.handleResponse);
    this.socket.on("err-pull", this.handleResponseErr);
    this.socket.emit("get-chat-list");
  }

  handlePush() {
    if (this.state.text.trim().length > 0) {
      this.socket.emit(
        "chat-push",
        JSON.stringify({
          token: this.state.token,
          text: this.state.text.trim()
        })
      );
      this.setState({
        text: ""
      });
    }
  }

  handleResponse(msg) {
    if (msg["code"] === 200) {
      let result = this.state.chats;
      result.push(msg);
      this.setState({
        chats: result,
        err: ""
      });
    } else {
      this.setState({
        err: "예상치 못한 오류가 발생하였습니다. 서버 연결을 확인해주세요."
      });
    }
  }

  handleResponseErr(msg) {
    console.log(" - Global err - ");
    console.log(msg.error);
    if (msg["code"] === 400) {
      this.setState({
        err: msg["error"]
      });
    } else {
      this.setState({
        err: "예상치 못한 오류가 발생하였습니다. 서버 연결을 확인해주세요."
      });
    }
  }

  handleTyping(e) {
    this.setState({
      text: e.target.value
    });
  }

  handleMove() {
    this.socket.close();
    this.props.routeMethod.history.push("/privatechat");
  }

  render() {
    return (
      <div>
        {this.state.token ? (
          <>
            <div onClick={this.handleMove}> 개인공간으로 가기 </div>
            안녕하세요 {this.state.nickname}님 공용 채팅 공간
            <div className="chat-send">
              {this.state.chats.map((msg, i) => {
                return (
                  <div key={i}>
                    {msg.nickname} : {msg.text}
                  </div>
                );
              })}
              <input onChange={this.handleTyping} value={this.state.text} />
              <button onClick={this.handlePush}>채팅보내기</button>
              <div className="err">{this.state.err}</div>
            </div>
          </>
        ) : (
          <>
            로그인이 필요합니다.
            <LoginLink />
          </>
        )}
      </div>
    );
  }
}

export default ChatContainer;
