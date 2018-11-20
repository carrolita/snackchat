import React, { Component } from 'react';
import AddNickname from './AddNickname/AddNickname';
import Footer from './Footer/Footer.js';
import Chat from './Chat/Chat';
import Home from './Home/Home';
import NotFound from './NotFound/NotFound';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import CreateChat from './CreateChat/CreateChat';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/chat/:id" component={Chat}/>
            <Route path="/create-chat" exact component={CreateChat}/>
            <Route path="**" component={NotFound}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
