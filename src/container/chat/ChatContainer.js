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
      chats: [],
      members: []
    };
    this.handlePush = this.handlePush.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleResponseErr = this.handleResponseErr.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleMemberIn = this.handleMemberIn.bind(this);
    this.handleMemberOut = this.handleMemberOut.bind(this);
    this.handleMember = this.handleMember.bind(this);
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
      this.socket.on("member-in", this.handleMemberIn);
      this.socket.on("member-out", this.handleMemberOut);
      this.socket.on("member-list", this.handleMember);
      this.socket.emit(
        "get-chat-list",
        JSON.stringify({
          token: this.props.token
        })
      );
      this.socket.emit("get-member-list");
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

  handleMemberIn(msg) {
    if (msg["code"] === 200) {
      let result = this.state.chats;
      let info = {
        text: msg.nickname + "님이 입장하셨습니다.",
        nickname: "시스템",
        time: "system"
      };
      result.push(info);
      let members = this.state.members;
      members.push(msg.nickname);
      this.setState({
        chats: result,
        members: members,
        err: ""
      });
    } else {
      this.setState({
        err: "예상치 못한 오류가 발생하였습니다. 서버 연결을 확인해주세요."
      });
    }
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  }

  handleMemberOut(msg) {
    if (msg["code"] === 200) {
      let result = this.state.chats;
      let info = {
        text: msg.nickname + "님이 퇴장하셨습니다.",
        nickname: "시스템",
        time: "system"
      };
      result.push(info);
      let members = this.state.members;
      members.splice(members.indexOf(msg.nickname), 1);

      this.setState({
        chats: result,
        members: members,
        err: ""
      });
    } else {
      this.setState({
        err: "예상치 못한 오류가 발생하였습니다. 서버 연결을 확인해주세요."
      });
    }
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  }

  handleMember(msg) {
    console.log(msg);
    if (msg["code"] === 200) {
      this.setState({
        members: msg.members
      });
    } else {
      this.setState({
        err: "예상치 못한 오류가 발생하였습니다. 서버 연결을 확인해주세요."
      });
    }
  }

  render() {
    return (
      <div className="chat_all">
        <div className="header">Make A Chat</div>
        <div className="list_area">
          <div className="list_area">
            <div className="user">user</div>
            {this.state.members.map((name, i) => (
              <div className="list" key={i}>
                {name}
              </div>
            ))}
          </div>
        </div>
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
                {this.state.chats.reduce((result, msg, i, initial) => {
                  return [
                    ...result,
                    <div key={i}>
                      {initial[i - 1] &&
                      msg.nickname !== initial[i - 1].nickname ? (
                        <div
                          className={
                            "nickname " +
                            (msg.nickname === this.state.nickname
                              ? "me"
                              : "other")
                          }
                        >
                          {msg.nickname}
                        </div>
                      ) : (
                        ""
                      )}
                      <div
                        className={
                          "text " +
                          (msg.nickname === this.state.nickname
                            ? "me"
                            : "other")
                        }
                      >
                        {msg.text}
                      </div>
                      <div
                        className={
                          "time " +
                          (msg.nickname === this.state.nickname
                            ? "me"
                            : "other")
                        }
                      >
                        {msg.time
                          .replace(/T|:|\./g, "-")
                          .split("-")
                          .reduce((init, now, index) => {
                            switch (index) {
                              case 1:
                                if (init === "system") {
                                  return "";
                                } else {
                                  return init.substring(2) + "." + now;
                                }
                              case 2:
                                return init + "." + now;
                              case 3:
                                return init + " " + now;
                              case 4:
                                return init + ":" + now;
                              default:
                                return init;
                            }
                          })}
                      </div>
                    </div>
                  ];
                }, [])}
                <div
                  className="messagesEnd"
                  ref={el => {
                    this.messagesEnd = el;
                  }}
                />
              </>
            ) : (
              <>
                로그인이 필요합니다.
                <LoginLink />
              </>
            )}
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
