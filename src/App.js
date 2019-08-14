import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { auth } from "./firebase";
import Header from "./components/Header";
import AddTournament from "./components/AddTournament";
import AddPlayer from "./components/AddPlayer";
import PlayerList from "./components/PlayerList";
import Login from "./components/Login";
import Player from "./components/Player";
import EditPlayer from "./components/EditPlayer";
import Tournament from "./components/Tournament";
import "./App.css";

class App extends React.Component {
  state = {
    user: null
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      }
    });
  }

  doLogin = user => {
    this.setState({ user });
  };

  releaseUser = () => {
    this.setState({
      user: null
    });
  };

  render() {
    return (
      <div className="App">
        <Router>
          <Header user={this.state.user} releaseUser={this.releaseUser} />
          <main>
            <Route exact path="/" component={PlayerList} />
            <Route
              path="/login"
              component={() => <Login doLogin={this.doLogin} />}
            />
            <Route path="/add-tournament" component={AddTournament} />
            <Route path="/add-player" component={AddPlayer} />
            <Route
              path="/player/:key"
              component={() => <Player user={this.state.user} />}
            />
            <Route
              path="/edit-player/:key"
              component={() => <EditPlayer user={this.state.user} />}
            />
            <Route
              path="/tournament/:key"
              component={() => <Tournament user={this.state.user} />}
            />
          </main>
        </Router>
      </div>
    );
  }
}

export default App;
