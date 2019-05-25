import React, { Component } from "react";
import io from "socket.io-client";

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverUrl: "localhost:3001",
      text: "",
      err: "",
      chats: []
    };
    this.handlePush = this.handlePush.bind(this);
    this.handleType = this.handleType.bind(this);
  }

  componentDidMount() {
    this.socket = io.connect(this.state.serverUrl);

    /* subscribe chat-pull */
    this.socket.on("chat-pull", msg => {
      console.log(msg["text"]);
      if (msg["code"] === 200) {
        let result = this.state.chats;
        result.push(msg);
        console.log(result);
        this.setState({
          chats: result
        });
      } else if (msg["code"] === 400) {
        this.setState({
          err: msg["err"]
        });
      } else {
        this.setState({
          err: "예상치 못한 오류가 발생하였습니다. 서버 연결을 확인해주세요."
        });
      }
    });
  }

  handlePush() {
    this.socket.emit(
      "chat-push",
      JSON.stringify({
        token: this.props.token,
        text: this.state.text
      })
    );
    this.setState({
      text: ""
    });
  }

  handleType(e) {
    this.setState({
      text: e.target.value
    });
  }

  render() {
    return (
      <div>
        {this.props.token !== "" ? (
          <div className="chat-send">
            {this.state.chats.map((msg, i) => {
              return (
                <div key={i}>
                  {msg.nickname} = {msg.text}
                </div>
              );
            })}
            <input onChange={this.handleType} value={this.state.text} />
            <button onClick={this.handlePush}>채팅보내기</button>
            <div className="err">{this.state.err}</div>
          </div>
        ) : (
          "로그인시 채팅이 가능합니다."
        )}
      </div>
    );
  }
}

export default MainContainer;
