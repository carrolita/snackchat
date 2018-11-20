
import React, { Component } from 'react';
import './Chat.scss';
import io from 'socket.io-client';
import uuid from 'uuid/v4';


class Chat extends Component {
  state = {
    nickName: 'none',
    messages: {},
    name: '',
    roomId: null,
    inputMessage: ''
  }

  componentWillMount() {
    const { id } = this.props.match.params;
    const storedNickName = localStorage.getItem(`chatroom-nickname:${id}`)
    if(storedNickName) {
      this.setState({
        nickName: storedNickName
      })
    }

    fetch(`${process.env.REACT_APP_SERVER_URL}/rooms/${id}`)
      .then(data => data.json())
      .then(data => {
        this.setState({
          name: data.name,
          roomId: data.roomId
        });
        fetch(process.env.REACT_APP_SERVER_URL + `/rooms/${id}/messages` )
          .then(data => data.json())
          .then(data => {
            this.setState({
              messages: data.reduce((obj, item) => {
                obj[item.messageId] = item;
                return obj;
              }, {})
            });
          });
      });

    this.socket = io(process.env.REACT_APP_SERVER_URL, {
      query: {
        roomId: id
      }
    });

    this.socket.on('connect', (socket) => {
      console.log('Connected websocket');
      this.socket.on('message', (data) => {
        console.log(data);
        const messages = this.state.messages;
        messages[data.messageId] = data;
        this.setState({
          messages: messages
        });
      });
    });

    this.socket.on('connect_error', (error) => {
      console.error('failed to connect to websocket', error)
    });
  }

  render() {
    const { match } = this.props;
    return (
      <div className="container-fluid h-100 flex-column d-flex">
        <div className="row">
          <div className="col text-center">
            <span className="display-3">Chatroom {this.state.name}</span>
          </div>
        </div>
        <div className="row flex-grow-1 mt-5">
          <div className="col col-overflow">
            <div className="message-section">
              <ul className="list-group snack-list">
                {
                  Object.keys(this.state.messages).map(key => (
                    <li className="speech-bubble d-flex flex-column" key="key">
                      <span className="text-muted">{this.state.messages[key].from}</span>
                      <span>{this.state.messages[key].message}</span>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col justify-content-center">
            <form className="input-section" onSubmit={this.sendMessage}>
              <input className="form-control form-control-lg" onChange={this.onMessageChange} value={this.state.inputMessage} />
              <button type="submit" className="btn btn-primary btn-lg">send</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  onMessageChange = (event) => {
    this.setState({
      inputMessage: event.target.value
    });

  }

  sendMessage = (event) => {
    event.preventDefault();

    const payload = {
      messageId: uuid(),
      message: this.state.inputMessage,
      from: this.state.nickName
    };

    fetch(`${process.env.REACT_APP_SERVER_URL}/rooms/${this.state.roomId}/messages`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(() => {
      const messages = this.state.messages;
      messages[payload.messageId] = payload;
      this.setState({
        inputMessage: '',
        messages: messages
      });
    })
  }
}




export default Chat;
