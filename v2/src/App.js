import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import firebase, { auth } from "./firebase";
import Header from "./components/Header";
import PlayerList from "./components/PlayerList";
import Login from "./components/Login";
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
          </main>
        </Router>
      </div>
    );
  }
}

export default App;
