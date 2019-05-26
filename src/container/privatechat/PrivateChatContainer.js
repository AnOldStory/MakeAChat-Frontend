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
      nicknameList: [],
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
    /* private-msg */
    this.socket = io(this.state.serverUrl + "/private-msg", {
      transports: ["websocket"]
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
        token: this.state.token
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
      <div>
        {this.state.token ? (
          <>
            <div onClick={this.handleMove}> 공용 공간으로 가기 </div>
            안녕하세요 {this.state.nickname}님 개인 채팅 공간
            <div>누구랑? {this.state.target}</div>
            <div className="chat-list">
              {this.state.lists.map((msg, i) => {
                return <div key={i}>who {msg}</div>;
              })}
            </div>
            채팅리스트끝
            <div className="chat-send">
              {this.state.target !== ""
                ? this.state.chats[this.state.target].map((msg, i) => {
                    return (
                      <div key={i}>
                        {msg.nickname} : {msg.text}
                      </div>
                    );
                  })
                : ""}
              <input
                name="text"
                onChange={this.handleTyping}
                value={this.state.text}
              />
              <button onClick={this.handlePush}>채팅보내기</button>
            </div>
            <div className="err">{this.state.err}</div>
            <input
              name="who"
              onChange={this.handleTyping}
              value={this.state.who}
            />
            <button onClick={this.handleValid}>닉네임 검색</button>
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

export default PrivateChatConatiner;
