import React from "react";
import firebase from "./firebase";
import Header from "./components/Header";
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
      </div>
    );
  }
}

export default App;
