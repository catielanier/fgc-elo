import React from "react";
import firebase from "./firebase";
import Header from "./components/Header";
import PlayerList from "./components/PlayerList";
import "./App.css";

class App extends React.Component {
  state = {
    loggedIn: true,
    userId: ""
  };
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
