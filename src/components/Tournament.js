import React from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import YouTube from "react-youtube";
import firebase from "../firebase";
import Flag from "react-world-flags";

class Tournament extends React.Component {
  state = {
    tournament: {}
  };
  async componentDidMount() {
    const key = window.location.pathname.replace("/tournament/", "");
    this.dbRefTournament = firebase.database().ref(`tournaments/${key}`);
    await this.dbRefTournament.on("value", async snapshot => {
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
      await tournament.results.forEach(async player => {
        this.dbRefPlayer = firebase.database().ref(`players/${player.key}`);
        await this.dbRefPlayer.once("value", async snapshot => {
          const data = snapshot.val();
          player.country = data.country;
          player.countryLong = data.countryLong;
          player.name = data.name;
          player.teamShort = data.teamShort;
          await this.setState({ tournament });
        });
      });
    });
  }
  render() {
    return (
      <>
        <Helmet>
          <title>{`${this.state.tournament.tournamentName} | Sailor Moon S Global Rankings`}</title>
        </Helmet>
        <section className="tournament">
          <div className="grid-container">
            <div className="tournament-info">
              <h3>{this.state.tournament.tournamentName}</h3>
              <div className="info-grid">
                <div className="info-header">Location:</div>
                <div className="info-answer">
                  {this.state.tournament.country && (
                    <Flag code={this.state.tournament.country} height="16" />
                  )}
                  {this.state.tournament.countryLong}
                </div>
                <div className="info-header">Date: </div>
                <div className="info-answer">
                  {this.state.tournament.tournamentDate}
                </div>
                <div className="info-header"># of Entrants:</div>
                <div className="info-answer">
                  {this.state.tournament.results &&
                    this.state.tournament.results.length}
                </div>
                <div className="info-header">Bracket:</div>
                <div className="info-answer">
                  {this.state.tournament.bracketUrl && (
                    <a
                      href={this.state.tournament.bracketUrl}
                      className="bracket-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {this.state.tournament.bracketApi}
                    </a>
                  )}
                </div>
              </div>
              {this.state.tournament.vodUrl && (
                <YouTube
                  videoId={this.state.tournament.vodUrl.replace(
                    "https://www.youtube.com/watch?v=",
                    ""
                  )}
                />
              )}
              <Link
                to={`/edit-tournament/${this.state.tournament.key}`}
                className="admin-button"
              >
                Edit Tournament
              </Link>
            </div>
            {this.state.tournament.results && (
              <div className="player-results">
                <div className="grid-container">
                  <div className="grid-row grid-header">
                    <div>Rank</div>
                    <div>Player</div>
                  </div>
                  {this.state.tournament.results.map((player, index) => {
                    return (
                      <Link to={`/player/${player.key}`}>
                        <div className="grid-row" key={index}>
                          <div>{player.place}</div>
                          <div>
                            {player.country && (
                              <Flag
                                code={player.country}
                                alt={player.countryLong}
                                height="16"
                              />
                            )}{" "}
                            <span className="team">{player.teamShort}</span>{" "}
                            {player.name}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </>
    );
  }
}

export default Tournament;
