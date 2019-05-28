import React, { Component } from "react";
import io from "socket.io-client";

import LoginLink from "component/LoginLink";

import config from "_variable";

import "./ChatContainer.css";

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
    this.handleEnter = this.handleEnter.bind(this);
  }

  componentDidMount() {
    if (this.state.token) {
      console.log("Global Login");
      /* check global connection */
      this.socket = io.connect(this.state.serverUrl, {
        transports: ["websocket"],
        forceNew: true
      });
      /* subscribe chat-pull */
      this.socket.on("chat-pull", this.handleResponse);
      this.socket.on("err-pull", this.handleResponseErr);
      this.socket.emit("get-chat-list");
    }
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
      if (this.messagesEnd) {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }
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

  handleEnter(e) {
    if (e.key === "Enter" && this.state.token) {
      this.handlePush();
    }
  }

  render() {
    return (
      <div className="chat_all">
        <div className="header">Make A Chat</div>
        <div className="list_area" />
        <div className="chat_main">
          <div className="message_area">
            <span className="leave">
              <button type="button" name="button1" onClick={this.handleMove}>
                Go to Personal Room
              </button>
            </span>
            {this.state.token ? (
              <>
                안녕하세요 {this.state.nickname}님 여기는 공용 채팅 공간입니다.
                {this.state.chats.map((msg, i) => {
                  return (
                    <div key={i}>
                      {msg.nickname} : {msg.text}
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                로그인이 필요합니다.
                <LoginLink />
              </>
            )}

            <div
              ref={el => {
                this.messagesEnd = el;
              }}
            />
          </div>

          <div className="input_box">
            <input
              type="text"
              id="text_input"
              onChange={this.handleTyping}
              value={this.state.text}
              onKeyDown={this.handleEnter}
            />
          </div>
          <button type="button" name="button2" onClick={this.handlePush}>
            SEND
          </button>
          <div className="err">{this.state.err}</div>
        </div>
      </div>
    );
  }
}

export default ChatContainer;
