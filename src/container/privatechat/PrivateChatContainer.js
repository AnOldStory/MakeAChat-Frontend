import React, { Component } from "react";
import io from "socket.io-client";

import LoginLink from "component/LoginLink";

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
    this.handlePush = this.handlePush.bind(this);
    this.handleValid = this.handleValid.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleResponseErr = this.handleResponseErr.bind(this);
    this.handleResponseList = this.handleResponseList.bind(this);
    this.handleResponseAlarm = this.handleResponseAlarm.bind(this);
    this.handleResponseValid = this.handleResponseValid.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleMove = this.handleMove.bind(this);
  }

  componentDidMount() {
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
          { nickname: "시스템", text: "채팅의 시작입니다." }
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
    this.socket.close();
    this.props.routeMethod.history.push("/chat");
  }

  render() {
    return (
      <div className="chat_all">
        <div className="header">Make A Chat</div>
        <div className="list_area">
          <div className="chat-list">
            {this.state.lists.map((msg, i) => {
              return <div key={i}>who {msg}</div>;
            })}
            <div className="err">{this.state.err}</div>
            <input
              name="who"
              onChange={this.handleTyping}
              value={this.state.who}
              className="search_box"
            />
            <button className="search" onClick={this.handleValid}>
              다른사람찾기
            </button>
          </div>
        </div>
        <div className="chat_main">
          <div className="message_area">
            <div>
              안녕하세요 {this.state.nickname}님 개인 채팅 공간
              <div>현재 대화 상대 : {this.state.target}</div>
              <span className="leave">
                <button type="button" name="button1" onClick={this.handleMove}>
                  공용 공간으로 가기
                </button>
              </span>
            </div>

            {this.state.target !== "" && this.state.token ? (
              this.state.chats[this.state.target].map((msg, i) => {
                return (
                  <div key={i}>
                    {msg.nickname} : {msg.text}
                  </div>
                );
              })
            ) : (
              <>
                로그인이 필요합니다.
                <LoginLink />
              </>
            )}
            <div className="other">ggggg : ㅎㅇㅎㅇ</div>
            <div className="me">12345 : 1212</div>
          </div>
          <div className="input_box">
            <input
              type="text"
              id="text_input"
              onChange={this.handleTyping}
              value={this.state.text}
            />
          </div>
          <button type="button" name="button2" onClick={this.handlePush}>
            SEND
          </button>
        </div>
      </div>
    );
  }
}

export default PrivateChatConatiner;
