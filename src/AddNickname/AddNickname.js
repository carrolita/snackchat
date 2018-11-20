import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './AddNickname.css';


class App extends Component {
  render() {
    return (
      <div className="App">
      <div className="SnackChat-text-container">
        <div className="SnackChat-text">
          <h1>SnackChat</h1>
        </div>
        <div className="landigpage-text">
          <h1>Welcome to SnackChat!😎</h1>
        </div>
      </div>
      <div className="nickname-container">
        <form>
          <div class="form-group">
          <h2>Log in</h2>
            <label for="exampleInputEmail1">Username:</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Username"/>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"/>
          </div>
          <button type="submit" class="btn btn-primary">Yay!</button> Forgat password? To bad...

        </form>
      </div>

      </div>
    );
  }
}

export default App;
