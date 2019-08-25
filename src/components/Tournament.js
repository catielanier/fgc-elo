import React from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import firebase from "../firebase";
import Flag from "react-world-flags";

class Tournament extends React.Component {
  state = {
    tournament: {}
  };
  async componentDidMount() {
    const key = window.location.pathname.replace("/tournament/", "");
    this.dbRefTournament = firebase.database().ref(`tournaments/${key}`);
    await this.dbRefTournament.on("value", snapshot => {
      const tournament = snapshot.val();
      tournament.key = key;
      const newDate = new Date(tournament.tournamentDate + "T00:00:00");
      tournament.tournamentDate = new Intl.DateTimeFormat("en-us").format(
        newDate
      );
      if (tournament.bracketApi === "challonge") {
        tournament.bracketUrl = `https://challonge.com/${tournament.tournamentId}`;
      } else if (tournament.bracketApi === "burningmeter") {
        tournament.bracketUrl = `https://burningmeter.com/${tournament.tournamentId}`;
      }
      this.setState({ tournament });
    });
  }
  render() {
    return (
      <section className="tournament">
        <h3>{this.state.tournament.tournamentName}</h3>
      </section>
    );
  }
}

export default Tournament;
