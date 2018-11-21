import React, { Component } from 'react';
import './CreateChat.scss';
import uuid from 'uuid/v4';
import {withRouter} from "react-router";


class CreateChat extends Component {
  state = {
    name: '',
    private: false
  }

  render(){
    return(
      <div className="container">
        <h3 className="text display-5 snack-title create-chat-text">Create your own chatroom</h3>
        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-6">
            <form className="create-chat-container" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label for="exampleInputEmail1">Chatroom name:</label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter chat name" value={this.state.name} onChange={this.onNameChange}/>
              </div>
              <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" checked={this.state.private} onChange={this.onPrivateChange}/>
                <label className="form-check-label" htmlFor="exampleCheck1">Private chat</label>
              </div>
              <button type="submit" className="btn btn-primary create-button">Create</button>
            </form>
          </div>
        </div>
        <div class="row link-information-text justify-content-center mt-5">
          <div className="col-sm-12 col-md-6 link-information-text">
            <p className="tips-text">
              Few small tips to know before creating your own chatroom:
            </p>
            <p>
              1️⃣ You will need to invite people to your chatroom, otherwise it will be forever empty!
            </p>
            <p>
              2️⃣ Every chatroom has its own unique number. Example of two different chatrooms:
            </p>
            <p>
              http://www.e-chat.co/room/1
            </p>
            <p>
              http://www.e-chat.co/room/40
            </p>
            <p>
              3️⃣ To invite people to your chatroom, you will need to send the link to e-chat website with your room number. You will get the number once you create the chatroom.
            </p>
            <p>
              4️⃣ As a chatroom owner you will get access to the moderator panel, where you can customize your chatroom. In addition, you will be able to kick/ban people and remove messages from the chat. We are planning to build more features soon
            </p>
            </div>
        </div>
      </div>
    )
  }

  onNameChange = (event) => {
    this.setState({
      name: event.target.value
    });
  }

  onPrivateChange = (event) => {
    this.setState({
      private: !this.state.private
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
    if(this.state.name !== '') {
      const payload = {
        roomId: uuid(),
        name: this.state.name,
        private: this.state.private
      }

      fetch(process.env.REACT_APP_SERVER_URL + '/rooms', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(payload)
      })
        .then(() => this.setState({
          name: '',
          private: false
        }))
        .then(() => {
          this.props.history.push('/chat/' + payload.roomId)
        })
    }
  }
}


export default withRouter(CreateChat);
