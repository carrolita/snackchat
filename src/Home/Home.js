import React, {Component} from 'react';
import './Home.scss';
import {BrowserRouter as Router, Link} from 'react-router-dom';


class Home extends Component {
  state = {
    rooms: []
  }

  componentWillMount() {
    fetch(process.env.REACT_APP_SERVER_URL + '/rooms')
      .then(data => data.json())
      .then((data) => this.setState({
        rooms: data
      }))
      .catch(err => console.error(err))
  }

  render() {
    return (
      <div className="container-fluid snack-gradient snack-cont">
        <div className="row justify-content-center snack-row-hero">
          <div className="col-sm-12 col-md-12 text-center">¨
            <span className="display-1 snack-title welcome-text">Welcome to snackchat</span>
          </div>
          <div className="col-sm-12 col-md-12 text-center">
            <span className="snack-lead">Chat with anyone you want, about anything and have fun!</span>
          </div>
        </div>
        <div className="row justify-content-center snack-row-purple">
          <div className="col-sm-12 col-md-2 text-sm-left text-md-right">
            <span className="display-1">3000</span>
          </div>
          <div className="col-sm-12 col-md-2 text-left">
            <span className="h1 snack-title">Snackchat has a crazy amount of rooms</span>
          </div>
        </div>
        <div className="row justify-content-center snack-row">
          <div className="col">
            <div className="row">
              <div className="col">
                <div className="row">
                  <div className="col text-center">
                    <span className="display-4 snack-title">Some of snackchats most popular</span>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-sm-12 col-md-6">
                    <ul className="snack-ul">
                      {
                        this.state.rooms.map(room => (
                          <Link key={room.roomId} to={'/chat/' + room.roomId} className=" chat-list list-group-item d-flex justify-content-between align-items-center">
                            {room.name}
                            <span className="badge badge-primary badge-pill">14</span>
                          </Link>
                        ))
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center snack-row-purple">
          <div className="col-sm-12 col-md-12 text-center">
            <div className="row">
              <div className="col">
                <span className="display-4 snack-title">Create your own room</span>
              </div>
            </div>
            <div className="row justify-content-center ">
              <div className="col-sm-12 col-md-4 justify-content-center">
                <Link className="btn btn-primary guest-button btn-lg btn-block get-started-button" to="/create-chat">Get
                  started</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }
}

export default Home;
