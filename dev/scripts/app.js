import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import firebase from 'firebase';
import Table from 'react-bootstrap/lib/Table';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

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
      adminPwd: '',
      show: false
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePlayerOne = this.handlePlayerOne.bind(this);
    this.handlePlayerTwo = this.handlePlayerTwo.bind(this);
    this.handleWinner = this.handleWinner.bind(this);
    this.calculateELO = this.calculateELO.bind(this);
  }

  handleShow() {
    this.setState({show: true});
  }

  handleClose() {
    this.setState({show: false});
  }
  
  handlePlayerOne(e) {
    const playerName = e.target.value;
    this.setState({playerOne: playerName});
  }

  handlePlayerTwo(e) {
    const playerName = e.target.value;
    this.setState({playerTwo: playerName});
  }

  handleWinner(e) {
    const winner = e.target.value;
    this.setState({winner: winner});
  }

  calculateELO(e) {
    e.preventDefault();

    const playerOneOriginalELO = 1200;
    const playerTwoOriginalELO = 1200;

    const playerOneTransELO = Math.pow(10, playerOneOriginalELO / 400);
    const playerTwoTransELO = Math.pow(10, playerTwoOriginalELO / 400);

    const playerOneExpectedScore = playerOneTransELO / (playerOneTransELO + playerTwoTransELO);
    const playerTwoExpectedScore = playerTwoTransELO / (playerTwoTransELO + playerOneTransELO);

    if (this.state.winner === 'playerOne') {
      const playerOneUpdatedELO = playerOneOriginalELO + 32 * (1 - playerOneExpectedScore);
      const playerTwoUpdatedELO = playerTwoOriginalELO + 32 * (0 - playerTwoExpectedScore);

      console.log(`${this.state.playerOne}'s new ELO score is ${playerOneUpdatedELO}.`);
      console.log(`${this.state.playerTwo}'s new ELO score is ${playerTwoUpdatedELO}.`);
    } else {
      const playerOneUpdatedELO = playerOneOriginalELO + 32 * (0 - playerOneExpectedScore);
      const playerTwoUpdatedELO = playerTwoOriginalELO + 32 * (1 - playerTwoExpectedScore);

      console.log(`${this.state.playerOne}'s new ELO score is ${playerOneUpdatedELO}.`);
      console.log(`${this.state.playerTwo}'s new ELO score is ${playerTwoUpdatedELO}.`);
    }
  }

  render() {
    return <div>
        <div className="jumbotron text-center">
          <h1 className="page-header">Sailor Moon S Global Rankings</h1>
          <p>Who's best at fighting evil by moonlight?</p>
        </div>
        <div className="container">
          <Table striped bordered hover>
            <thead className="thead-dark text-center">
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Main</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
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
            </tbody>
          </Table>
        </div>
        <div className="container text-center">
          <Button className="btn-primary btn-lg" onClick={this.handleShow}>
            Add Match
          </Button>
        </div>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              Add Match to ELO
            </Modal.Title>
            <Modal.Body>
              <form>
                <div className="form-group">
                  <label htmlFor="player-one">Player One</label>
                  <input type="text" name="player-one" className="form-control" placeholder="(Do not include sponsor/team tag)" value={this.state.playerOne} onChange={this.handlePlayerOne}/>
                </div>
                <div className="form-group">
                  <label htmlFor="player-two">Player Two</label>
                  <input type="text" name="player-two" className="form-control" placeholder="(Do not include sponsor/team tag)" value={this.state.playerTwo} onChange={this.handlePlayerTwo}/>
                </div>
                <div className="form-group text-center">
                  <label>Please choose the winner:</label>
                  <select name="" id="" className="form-control" onChange={this.handleWinner} defaultValue="">
                    <option value="">--Choose one option--</option>
                    <option value="playerOne">Player One</option>
                    <option value="playerTwo">Player Two</option>
                  </select>
                </div>
                <div className="form-group text-center">
                  <Button type="submit" className="btn-primary btn-lg" onClick={this.calculateELO}>Submit</Button>
                  <Button className="btn-lg">Clear</Button>
                </div>
              </form>
            </Modal.Body>
          </Modal.Header>
        </Modal>
      </div>
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
