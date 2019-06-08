import React, { Component } from "react";
import io from "socket.io-client";

import LoginLink from "component/LoginLink";

import config from "_variable";

import "./ChatContainer.scss";

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
      members: [],
      enter: 0
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
    this.handleWho = this.handleWho.bind(this);
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
        text: "",
        enter: 1
      });
    }
  }

  handleResponse(msg) {
    if (msg["code"] === 200) {
      let result = this.state.chats;
      result.push(msg);
      result.sort((a, b) => new Date(a.time) - new Date(b.time));
      this.setState({
        chats: result,
        err: ""
      });
      if (this.messagesEnd) {
        this.messagesEnd.scrollBy({ top: 9999, behavior: "smooth" });
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
    if (this.state.token) {
      this.socket.close();
    }
    this.props.routeMethod.history.push("/privatechat");
  }

  handleEnter(e) {
    if (e.key === "Enter" && this.state.token && this.state.enter !== 1) {
      this.handlePush();
    } else if (this.state.enter === 1) {
      this.setState({
        text: "",
        enter: 0
      });
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
      this.messagesEnd.scrollTo({ top: 9999, behavior: "smooth" });
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
      this.messagesEnd.scrollTo({ top: 9999, behavior: "smooth" });
    }
  }

  handleMember(msg) {
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

  handleWho(e) {
    if (e.target.getAttribute("name") !== this.state.nickname) {
      this.props.handleWho(e.target.getAttribute("name"));
      this.handleMove();
    }
  }

  render() {
    return (
      <div className="g_chat_all">
        <div className="g_header">
          Make A Chat
          <span className="g_leave">
            <button type="button" name="g_button1" onClick={this.handleMove}>
              Go to Personal Room ▶
            </button>
          </span>
        </div>
        <div className="g_left_area">
          <div className="g_user"> User </div>
          <div className="g_list_area">
            {this.state.members.map((name, i) => (
              <div
                className="g_list"
                name={name}
                key={i}
                onClick={this.handleWho}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
        <div className="g_chat_main">
          <div
            className="g_message_area"
            ref={el => {
              this.messagesEnd = el;
            }}
          >
            {this.state.token ? (
              <>
                <div className="g_text g_system">
                  안녕하세요 {this.state.nickname}님 여기는 공용 채팅
                  공간입니다.
                </div>

                {this.state.chats.reduce((result, msg, i, initial) => {
                  return [
                    ...result,
                    <div key={i}>
                      {initial[i - 1] &&
                      msg.nickname !== initial[i - 1].nickname ? (
                        <div
                          className={
                            "g_nickname " +
                            (msg.nickname === this.state.nickname
                              ? "g_me"
                              : msg.nickname === "시스템"
                              ? "g_system"
                              : "g_other")
                          }
                        >
                          {msg.nickname !== "시스템" ? msg.nickname : ""}
                        </div>
                      ) : (
                        ""
                      )}
                      <div
                        className={
                          "g_text " +
                          (msg.nickname === this.state.nickname
                            ? "g_me"
                            : msg.nickname === "시스템"
                            ? "g_system"
                            : "g_other")
                        }
                      >
                        {msg.text}
                      </div>
                      <div
                        className={
                          "g_time " +
                          (msg.nickname === this.state.nickname
                            ? "g_me"
                            : msg.nickname === "시스템"
                            ? "g_system"
                            : "g_other")
                        }
                      >
                        {msg.time === "system"
                          ? ""
                          : (new Date(msg.time).getFullYear() % 100) +
                            "." +
                            (new Date(msg.time).getMonth() + 1 > 10
                              ? new Date(msg.time).getMonth() + 1 + "."
                              : "0" +
                                (new Date(msg.time).getMonth() + 1) +
                                ".") +
                            (new Date(msg.time).getDate() > 10
                              ? new Date(msg.time).getDate() + " "
                              : "0" + new Date(msg.time).getDate() + " ") +
                            (new Date(msg.time).getHours() > 10
                              ? new Date(msg.time).getHours() + ":"
                              : "0" + new Date(msg.time).getHours() + ":") +
                            (new Date(msg.time).getMinutes() > 10
                              ? new Date(msg.time).getMinutes()
                              : "0" + new Date(msg.time).getMinutes())}
                      </div>
                    </div>
                  ];
                }, [])}
              </>
            ) : (
              <>
                {this.props.routeMethod.history.push("/login")}
                로그인이 필요합니다.
                <LoginLink />
              </>
            )}
          </div>

          <div className="g_bottom_area">
            <input
              type="text"
              id="g_text_input"
              onChange={this.handleTyping}
              value={this.state.text}
              onKeyDown={this.handleEnter}
            />
            <div className="g_send_area">
              <button type="button" name="g_button2" onClick={this.handlePush}>
                SEND
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatContainer;
