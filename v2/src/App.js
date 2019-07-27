import React from "react";
import firebase, { auth } from "./firebase";
import Header from "./components/Header";
import PlayerList from "./components/PlayerList";
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

  render() {
    return (
      <div className="App">
        <Header />
        <main>
          <PlayerList />
        </main>
      </div>
    );
  }
}

export default App;
