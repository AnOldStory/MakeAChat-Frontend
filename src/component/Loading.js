import React, { Component } from "react";

class Loding extends Component {
  render() {
    return (
      <div className="loading-white">
        <div className="loading-container">
          <div className="loading" />
          <div id="loading-text">loading</div>
        </div>
      </div>
    );
  }
}

export default Loding;
