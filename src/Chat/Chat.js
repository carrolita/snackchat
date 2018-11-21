
import React, { Component } from 'react';
import './Chat.scss';
import io from 'socket.io-client';
import uuid from 'uuid/v4';


class Chat extends Component {
  state = {
    nickName: '',
    messages: {},
    name: '',
    roomId: null,
    inputMessage: '',
    inputNickName: ''
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
          }).then(() => this.scrollToBottom());
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
        this.scrollToBottom();
      });
    });

    this.socket.on('connect_error', (error) => {
      console.error('failed to connect to websocket', error)
    });
  }

  render() {
    const { match } = this.props;
    return (
      <div className="h-100 chat-container">
        {
          this.state.nickName === '' &&
            <div className={'snack-overlay container-fluid d-flex flex-column justify-content-center'}>
              <div className={'row justify-content-center'}>
                <div className={'col-6 snack-box'}>
                  <form onSubmit={this.onNickNameSubmit}>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Nickname</label>
                      <input type="text" className="form-control" id="nickname" aria-describedby="emailHelp"
                             placeholder="Enter nick name" value={this.state.inputNickName} onChange={this.onNickNameChange}/>
                    </div>
                    <button type="submit" className={'btn btn-primary'}>Choose</button>
                  </form>
                </div>
              </div>
            </div>
        }
        <div className="chat-header text-center d-flex flex-column">
          <span className="display-3">{this.state.name}</span>
          <span className="text-muted">{this.state.nickName}</span>
        </div>
        <div className="chat-main">
          <div className="message-section">
            <ul className="list-group snack-list">
              {
                Object.keys(this.state.messages).map(key => (
                  <li ref={el => { this.messageView = el; }} className={`speech-bubble d-flex flex-column ${this.state.messages[key].from === this.state.nickName ? 'self' : ''}`} key="key">
                    <span className="text-muted">{this.state.messages[key].from}</span>
                    <span>{this.state.messages[key].message}</span>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
        <div className="chat-footer justify-content-center">
          <form className="input-section" onSubmit={this.sendMessage}>
            <input className="form-control form-control-lg" onChange={this.onMessageChange} value={this.state.inputMessage} />
            <button type="submit" className="send-message-button btn btn-primary btn-lg">send</button>
          </form>
        </div>
      </div>
    );
  }

  onNickNameSubmit = (event) => {
    event.preventDefault();

    this.setState({
      nickName: this.state.inputNickName,
      inputNickName: ''
    }, () => {
      const { id } = this.props.match.params;
      localStorage.setItem(`chatroom-nickname:${id}`, this.state.nickName)
    })
  }

  onNickNameChange = (event) => {
    this.setState({
      inputNickName: event.target.value
    })
  }

  onMessageChange = (event) => {
    this.setState({
      inputMessage: event.target.value
    });

  }

  scrollToBottom = () => {
    if(this.messageView) {
      this.messageView.scrollIntoView({ behavior: 'smooth' });
    }
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
