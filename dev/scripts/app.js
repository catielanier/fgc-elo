import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import firebase from 'firebase';
import Table from 'react-bootstrap/lib/Table';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import PopulateRankings from './PopulateRankings';

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
      show: false,
      teamName: ''
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePlayerOne = this.handlePlayerOne.bind(this);
    this.handlePlayerTwo = this.handlePlayerTwo.bind(this);
    this.handleWinner = this.handleWinner.bind(this);
    this.calculateELO = this.calculateELO.bind(this);
  }

  componentDidMount() {
    this.dbRef = firebase.database().ref();
    this.dbRef.on('value', snapshot => {
      const rankings = snapshot.val();
      const rankingsArray = [];
      for (let item in rankings) {
        rankingsArray.push(rankings[item])
      }
      rankingsArray.sort((a, b) => {
        return b.ELO - a.ELO
      });
      this.setState({
        rankings: rankingsArray
      });
    });
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

    this.dbRefPlayerOne = firebase.database().ref(`${this.state.playerOne}/`);
    this.dbRefPlayerTwo = firebase.database().ref(`${this.state.playerTwo}/`);

    let playerOneOriginalELO = 1200;
    let playerTwoOriginalELO = 1200;

    this.dbRefPlayerOne.on('value', snapshot => {
      playerOneOriginalELO = snapshot.val().ELO;
    });

    this.dbRefPlayerTwo.on('value', snapshot => {
      playerTwoOriginalELO = snapshot.val().ELO;
    });

    const playerOneTransELO = Math.pow(10, playerOneOriginalELO / 400);
    const playerTwoTransELO = Math.pow(10, playerTwoOriginalELO / 400);

    const playerOneExpectedScore = playerOneTransELO / (playerOneTransELO + playerTwoTransELO);
    const playerTwoExpectedScore = playerTwoTransELO / (playerTwoTransELO + playerOneTransELO);

    const playerOneUpdatedELO = Math.round(playerOneOriginalELO + 32 * (1 - playerOneExpectedScore));
    const playerTwoUpdatedELO = Math.round(playerTwoOriginalELO + 32 * (0 - playerTwoExpectedScore));

    this.dbRefPlayerOne.update({
      ELO: playerOneUpdatedELO
    });

    this.dbRefPlayerTwo.update({
      ELO: playerTwoUpdatedELO
    });

    this.setState({
      playerOne: '',
      playerTwo: ''
    })
  }

  render() {
    return <div>
        <div className="jumbotron text-center">
          <h1 className="page-header">Sailor Moon S Global Rankings</h1>
          <p>Who's best at fighting evil by moonlight?</p>
        </div>
        <div className="container">
          <Table striped bordered>
            <thead className="thead-dark text-center">
              <tr>
                <th>Rank</th>
                <th className="player-name">Player</th>
                <th className="main-char">Main</th>
                <th className="score">Score</th>
              </tr>
            </thead>
            <tbody>
              {this.state.rankings.map((player, index) => {
                return <PopulateRankings playerName={player.playerName} index={index} teamName={player.teamName} elo={player.ELO} countryShort={player.countryShort} countryLong={player.countryLong} mainShort={player.mainShort} mainLong={player.mainLong} key={index}/>
              })}
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
                  <label htmlFor="player-one">Winner</label>
                  <input type="text" name="player-one" className="form-control" placeholder="(Do not include sponsor/team tag)" value={this.state.playerOne} onChange={this.handlePlayerOne}/>
                </div>
                <div className="form-group">
                  <label htmlFor="player-two">Loser</label>
                  <input type="text" name="player-two" className="form-control" placeholder="(Do not include sponsor/team tag)" value={this.state.playerTwo} onChange={this.handlePlayerTwo}/>
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
