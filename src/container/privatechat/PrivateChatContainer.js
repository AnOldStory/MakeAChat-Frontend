import React, { Component } from "react";
import io from "socket.io-client";

import LoginLink from "component/LoginLink";

import "./PrivateChatContainer.scss";

import config from "_variable";

class PrivateChatConatiner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.token,
      nickname: this.props.nickname,
      serverUrl: config.serverUrl,
      text: "",
      err: "",
      who: "",
      lists: [],
      chats: {},
      target: ""
    };
    this.handleEnter = this.handleEnter.bind(this);
    this.handlePush = this.handlePush.bind(this);
    this.handleValid = this.handleValid.bind(this);
    this.handleButtonValid = this.handleButtonValid.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleResponseErr = this.handleResponseErr.bind(this);
    this.handleResponseList = this.handleResponseList.bind(this);
    this.handleResponseAlarm = this.handleResponseAlarm.bind(this);
    this.handleResponseValid = this.handleResponseValid.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleMove = this.handleMove.bind(this);
  }

  componentDidMount() {
    if (this.state.token) {
      console.log("Private Login");
      /* private-msg */
      this.socket = io(this.state.serverUrl + "/private-msg", {
        transports: ["websocket"],
        forceNew: true
      });
      /* subscribe chat-pull */
      this.socket.on("chat-pull", this.handleResponse);
      this.socket.on("err-pull", this.handleResponseErr);
      this.socket.on("list-pull", this.handleResponseList);
      this.socket.on("alarm-pull", this.handleResponseAlarm);
      this.socket.on("valid-pull", this.handleResponseValid);
      this.socket.emit(
        "get-chat-list",
        JSON.stringify({
          token: this.props.token
        })
      );
    }
  }
  handleEnter(e) {
    if (e.key === "Enter" && this.state.token) {
      this.handlePush();
    }
  }

  handlePush() {
    if (this.state.text.trim().length > 0) {
      this.socket.emit(
        "chat-push",
        JSON.stringify({
          token: this.state.token,
          target: this.state.target,
          text: this.state.text.trim()
        })
      );
      this.setState({
        text: ""
      });
    }
  }

  handleValid() {
    this.socket.emit(
      "get-valid",
      JSON.stringify({
        token: this.state.token,
        nickname: this.state.who
      })
    );
  }

  handleButtonValid(e) {
    this.setState({
      who: e.target.name
    });

    this.socket.emit(
      "get-valid",
      JSON.stringify({
        token: this.state.token,
        nickname: e.target.name
      })
    );
  }

  handleResponse(msg) {
    if (msg["code"] === 200) {
      let result = this.state.chats;
      if (msg) {
        result[this.state.target].push(msg);
      }

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
    console.log(" - Private err - ");
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

  handleResponseList(msg) {
    if (msg["code"] === 200) {
      let result = this.state.lists;

      result.push(msg.nickname);
      /* make a set */
      result = result.reduce(function(a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
      }, []);

      this.setState({
        lists: result,
        err: ""
      });
    } else {
      this.setState({
        err: "예상치 못한 오류가 발생하였습니다. 서버 연결을 확인해주세요."
      });
    }
  }

  handleResponseAlarm(msg) {
    if (msg["code"] === 200) {
      let result = this.state.chats;
      if (msg) {
        if (!result[msg.from]) {
          let lists = this.state.lists;
          lists.push(msg.from);
          this.setState({
            lists: lists
          });
          result[msg.from] = [
            { nickname: "시스템", text: "채팅의 시작입니다." }
          ];
        }
        result[msg.from].push(msg);
      }
      this.setState({
        chats: result
      });
    }
  }

  handleResponseValid(msg) {
    if (msg["code"] === 200) {
      let result = this.state.chats;
      if (!result[this.state.who]) {
        result[this.state.who] = [
          { nickname: "시스템", text: "채팅의 시작입니다.", time: "system" }
        ];
        this.setState({
          chats: result,
          target: this.state.who
        });
        this.socket.emit(
          "get-chat-private",
          JSON.stringify({
            token: this.state.token,
            target: this.state.who
          })
        );
      } else {
        this.setState({
          target: this.state.who
        });
      }
    } else {
      this.setState({
        err: "없는 닉네임입니다."
      });
    }
  }

  handleTyping(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleMove() {
    if (this.state.token) {
      this.socket.close();
    }
    this.props.routeMethod.history.push("/chat");
  }

  render() {
    return (
      <div className="p_chat_all">
        <div className="p_header">
          Make A Chat
          <div className="p_leave">
            <button type="button" name="p_button1" onClick={this.handleMove}>
              Go to Group Room
            </button>
          </div>
        </div>
        <div className="p_list_area">
          <div className="p_user_area">
            <div className="p_user">user</div>
            {this.state.lists.map((msg, i) => (
              <div className="p_user_list" key={i}>
                <button name={msg} onClick={this.handleButtonValid}>
                  {msg}
                </button>
              </div>
            ))}
          </div>
          <div className="p_search">
            <input
              name="who"
              onChange={this.handleTyping}
              value={this.state.who}
            />
            <button onClick={this.handleValid}>SEARCH</button>
          </div>
        </div>
        <div className="p_chat_main">
          <div className="p_message_area">
            {this.state.token ? (
              this.state.target !== "" ? (
                <>
                  <div>안녕하세요 {this.state.nickname}님 개인 채팅 공간</div>
                  <div>현재 대화 상대 : {this.state.target}</div>
                  {this.state.chats[this.state.target].reduce(
                    (result, msg, i, initial) => {
                      return [
                        ...result,
                        <div key={i}>
                          {initial[i - 1] &&
                          msg.nickname !== initial[i - 1].nickname ? (
                            <div
                              className={
                                "p_nickname " +
                                (msg.nickname === this.state.nickname
                                  ? "p_me"
                                  : "p_other")
                              }
                            >
                              {msg.nickname}
                            </div>
                          ) : (
                            ""
                          )}
                          <div
                            className={
                              "p_text " +
                              (msg.nickname === this.state.nickname
                                ? "p_me"
                                : "p_other")
                            }
                          >
                            {msg.text}
                          </div>
                          <div
                            className={
                              "p_time " +
                              (msg.nickname === this.state.nickname
                                ? "p_me"
                                : "p_other")
                            }
                          >
                            {msg.time === "system"
                              ? "system"
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
                    },
                    []
                  )}
                </>
              ) : (
                "대화할 상대를 골라주세요."
              )
            ) : (
              <>
                로그인이 필요합니다.
                <LoginLink />
              </>
            )}
            <div
              className="messagesEnd"
              ref={el => {
                this.messagesEnd = el;
              }}
            />
          </div>

          <div className="p_bottom_area">
            <input
              type="text"
              name="text"
              id="text_input"
              onChange={this.handleTyping}
              value={this.state.text}
              onKeyDown={this.handleEnter}
            />
            <div className="p_send_area">
              <button type="button" name="p_button2" onClick={this.handlePush}>
                SEND
              </button>
            </div>
          </div>
          <div className="err">{this.state.err}</div>
        </div>
      </div>
    );
  }
}

export default PrivateChatConatiner;
