import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyD_L93QGk5L-B8tkewVe8kUCrsK_DjIfFQ",
  authDomain: "sailormoon-elo.firebaseapp.com",
  databaseURL: "https://sailormoon-elo.firebaseio.com",
  projectId: "sailormoon-elo",
  storageBucket: "",
  messagingSenderId: "841627538839"
};
firebase.initializeApp(config);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      playerOne: '',
      playerOneELO: '',
      playerOneNewELO: '',
      playerTwo: '',
      playerTwoELO: '',
      playerTwoNewELO: '',
      winner: '',
      rankings: [],
      playerCountry: '',
      playerMain: '',
      adminEmail: '',
      adminPwd: ''
    };
  }

  render() {
    return <div>
        <div className="jumbotron text-center">
          <h1 className="page-header">Sailor Moon S Global Rankings</h1>
          <p>Who's best at fighting evil by moonlight?</p>
        </div>
        <div className="container">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark text-center">
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Main</th>
                <th>Score</th>
              </tr>
            </thead>
            <tr>
              <th>1</th>
              <td>
                <img src="flags/blank.gif" className="flag flag-ca" alt="Canada" /> TTT NeoRussell
              </td>
              <td className="main-char">
                <img src="img/pluto.png" alt="Sailor Pluto" />
              </td>
              <td>1600</td>
            </tr>
            <tr>
              <th>2</th>
              <td>
                <img src="flags/blank.gif" className="flag flag-ca" alt="Canada" /> SMRT SRK Missing Person
              </td>
              <td className="main-char">
                <img src="img/uranus.png" alt="Sailor Uranus" /> <img src="img/mercury.png" alt="Sailor Mercury" />
              </td>
              <td>1500</td>
            </tr>
            <tr>
              <th>3</th>
              <td>
                <img src="flags/blank.gif" className="flag flag-us" alt="United States" /> Echo Fox Justin Wong
              </td>
              <td className="main-char">
                <img src="img/mars.png" alt="Sailor Mars" />
              </td>
              <td>1490</td>
            </tr>
            <tr>
              <th>4</th>
              <td>
                <img src="flags/blank.gif" className="flag flag-ca" alt="Canada" /> 7PA Quiet Anger
              </td>
              <td className="main-char">
                <img src="img/mercury.png" alt="Sailor Mercury" /> <img src="img/neptune.png" alt="Sailor Neptune" />
              </td>
              <td>1480</td>
            </tr>
          </table>
        </div>
      </div>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
