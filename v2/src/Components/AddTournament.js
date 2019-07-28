import React from "react";
import axios from "axios";
import firebase from "../firebase";
import findPlace from "./findPlace";
import { challongeKey } from "../apiKeys";
import tournamentPoints from "./tournamentPoints";

class AddTournament extends React.Component {
  state = {
    playerList: "",
    tournamentName: "",
    tournamentDate: null,
    bracketUrl: "",
    paperBracket: false,
    paperBracketImage: "",
    loading: false,
    success: false,
    error: false,
    message: null,
    playersinDB: []
  };

  async componentDidMount() {
    this.dbRefPlayers = firebase.database().ref("players/");
    await this.dbRefPlayers.on("value", async snapshot => {
      const playersInDB = [];
      const data = snapshot.val();
      for (let key in data) {
        playersInDB.push({
          key,
          name: data[key].name,
          elo: data[key].elo || 1200,
          matchWins: data[key].matchWins || 0,
          matchLosses: data[key].matchLosses || 0,
          gameWins: data[key].gameWins || 0,
          gameLosses: data[key].gameLosses || 0
        });
      }
      await this.setState({
        playersInDB
      });
    });
  }

  submitTournament = async e => {
    e.preventDefault();
    await this.setState({
      loading: true
    });
    const playerList = this.state.playerList.split("\n");
    const playerResults = [];

    const players = this.state.playersinDB;

    await playerList.map((player, index) => {
      const res = {
        name: player
      };

      res.place = findPlace(index);

      playerResults.push(res);
    });

    const { tournamentName, bracketUrl, tournamentDate } = this.state;
    let bracketApi = null;
    const bracketSiteArray = ["challonge", "smash", "burningmeter"];
    bracketSiteArray.forEach(site => {
      const index = bracketUrl.indexOf(site);
      if (index !== -1) {
        bracketApi = site;
      }
    });
    if (bracketApi === "challonge") {
      const tournamentId = bracketUrl.replace("https://challonge.com/", "");
      console.log(challongeKey);
      await axios({
        method: "get",
        url: `https://api.challonge.com/v1/tournaments/${tournamentId}/matches.json`,
        params: {
          api_key: challongeKey
        },
        header: {
          "Access-Control-Allow-Origin": "*"
        }
      }).then(res => {
        console.log(res);
      });
    }

    if (bracketApi === "burningmeter") {
      let matches = null;
      const tournamentId = bracketUrl;
      await axios({
        method: "get",
        url: `${tournamentId}/s/bracket.json`,
        header: {
          "content-type": "text/plain"
        }
      }).then(res => {
        matches = res.data.section.matches;
      });
      await axios({
        method: "get",
        url: `${tournamentId}/results.json`,
        header: {
          "content-type": "text/plain"
        }
      }).then(res => {
        let { entrants } = res.data.tournament;
        entrants = entrants.sort(function(x, y) {
          return (
            x.overall_placing - y.overall_placing ||
            x.name.localeCompare(y.name)
          );
        });
        entrants.map((entrant, index) => {
          playerResults[index].id = entrant.id;
        });
      });
      matches = matches.sort(function(x, y) {
        return x.ordering - y.ordering;
      });
      await matches.map(match => {
        const index = playerResults.findIndex(
          player => player.id === match.entrant_top_id
        );
        const index2 = playerResults.findIndex(
          player => player.id === match.entrant_btm_id
        );
        const index3 = playerResults.findIndex(
          player => player.id === match.winner_id
        );

        if (index === -1 || index2 === -1) {
          match.is_bye = true;
        } else {
          match.entrant_top_id = playerResults[index].name;
          match.entrant_btm_id = playerResults[index2].name;
          match.winner_id = playerResults[index3].name;
          match.is_bye = false;
        }
      });

      await matches.map(async match => {
        if (match.is_bye === false) {
          const dbIndex = players.findIndex(
            player => player.name === match.entrant_top_id
          );
          const dbIndex2 = players.findIndex(
            player => player.name === match.entrant_btm_id
          );
          const playerOne = players[dbIndex] || {
            name: match.entrant_top_id,
            elo: 1200,
            matchWins: 0,
            matchLosses: 0,
            gameWins: 0,
            gameLosses: 0,
            tournamentScore: 0
          };
          const playerTwo = players[dbIndex2] || {
            name: match.entrant_btm_id,
            elo: 1200,
            matchWins: 0,
            matchLosses: 0,
            gameWins: 0,
            gameLosses: 0,
            tournamentScore: 0
          };

          if (playerOne.name === match.winner_id) {
            playerOne.matchWins = playerOne.matchWins + 1;
            playerTwo.matchLosses = playerTwo.matchLosses + 1;
            const playerOneOriginalELO = playerOne.elo;
            const playerTwoOriginalELO = playerTwo.elo;
            const playerOneTransELO = Math.pow(10, playerOneOriginalELO / 400);
            const playerTwoTransELO = Math.pow(10, playerTwoOriginalELO / 400);
            const playerOneExpectedScore =
              playerOneTransELO / (playerOneTransELO + playerTwoTransELO);
            const playerTwoExpectedScore =
              playerTwoTransELO / (playerTwoTransELO + playerOneTransELO);
            const playerOneUpdatedELO = Math.round(
              playerOneOriginalELO + 32 * (1 - playerOneExpectedScore)
            );
            const playerTwoUpdatedELO = Math.round(
              playerTwoOriginalELO + 32 * (0 - playerTwoExpectedScore)
            );
            playerOne.elo = playerOneUpdatedELO;
            playerTwo.elo = playerTwoUpdatedELO;
          } else {
            playerTwo.matchWins = playerTwo.matchWins + 1;
            playerOne.matchLosses = playerOne.matchLosses + 1;
            const playerOneOriginalELO = playerOne.elo;
            const playerTwoOriginalELO = playerTwo.elo;
            const playerOneTransELO = Math.pow(10, playerOneOriginalELO / 400);
            const playerTwoTransELO = Math.pow(10, playerTwoOriginalELO / 400);
            const playerOneExpectedScore =
              playerOneTransELO / (playerOneTransELO + playerTwoTransELO);
            const playerTwoExpectedScore =
              playerTwoTransELO / (playerTwoTransELO + playerOneTransELO);
            const playerTwoUpdatedELO = Math.round(
              playerTwoOriginalELO + 32 * (1 - playerTwoExpectedScore)
            );
            const playerOneUpdatedELO = Math.round(
              playerOneOriginalELO + 32 * (0 - playerOneExpectedScore)
            );
            playerOne.elo = playerOneUpdatedELO;
            playerTwo.elo = playerTwoUpdatedELO;
          }

          if (match.entrant_top_points && match.entrant_top_points !== 0) {
            playerOne.gameWins = playerOne.gameWins + match.entrant_top_points;
            if (match.entrant_btm_points && match.entrant_btm_points !== 0) {
              playerOne.gameLosses =
                playerOne.gameLosses + match.entrant_btm_points;
            }
          }
          if (match.entrant_btm_points && match.entrant_btm_points !== 0) {
            playerTwo.gameWins = playerTwo.gameWins + match.entrant_btm_points;
            if (match.entrant_top_points && match.entrant_top_points !== 0) {
              playerTwo.gameLosses =
                playerTwo.gameLosses + match.entrant_top_points;
            }
          }

          if (dbIndex === -1) {
            players.push(playerOne);
          } else {
            players[dbIndex] = playerOne;
          }

          if (dbIndex2 === -1) {
            players.push(playerTwo);
          } else {
            players[dbIndex2] = playerTwo;
          }
        }
      });

      await playerResults.map(async player => {
        const playerIndex = players.findIndex(p => p.name === player.name);

        players[playerIndex].tournamentScore = tournamentPoints(
          player.place,
          players[playerIndex].tournamentScore
        );
        console.log(player.place);

        console.log(players[playerIndex].tournamentScore);
      });

      players.forEach(player => {
        if (!player.key) {
          this.dbRefPlayers.push(player);
        } else {
          this.dbRefPlayer = firebase.database().ref(`players/${player.key}`);
          delete player.key;
          this.dbRefPlayer.set(player);
        }
      });
    }
    this.setState({
      loading: false
    });
  };

  changeState = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  changeBoolean = () => {
    const paperBracket = !this.state.paperBracket;
    this.setState({
      paperBracket
    });
  };

  render() {
    return (
      <section className="add-tournament">
        <h3>Add Tournament</h3>
        <form onSubmit={this.submitTournament}>
          <fieldset
            aria-busy={this.state.loading}
            disabled={this.state.loading}
          >
            <label htmlFor="tournamentName">
              <p>Tournament Name:</p>{" "}
              <input
                type="text"
                name="tournamentName"
                value={this.state.tournamentName}
                onChange={this.changeState}
              />
            </label>
            <label htmlFor="tournamentDate">
              <p>Tournament Date:</p>
              <input
                type="date"
                name="tournamentDate"
                value={this.state.tournamentDate}
                onChange={this.changeState}
              />
            </label>
            <label htmlFor="playerList">
              <p>Player List:</p>
              <textarea
                name="playerList"
                value={this.state.playerList}
                onChange={this.changeState}
              />
            </label>
            <label htmlFor="paperBracket">
              <input
                type="checkbox"
                name="paperBracket"
                value={this.state.paperBracket}
                onChange={this.changeBoolean}
              />
              This bracket has no online version, and was done on paper.
            </label>
            {!this.state.paperBracket && (
              <label htmlFor="bracketUrl">
                <p>Link to bracket:</p>
                <input
                  type="text"
                  name="bracketUrl"
                  value={this.state.bracketUrl}
                  onChange={this.changeState}
                />
              </label>
            )}
            {this.state.paperBracket && (
              <label htmlFor="paperBracketImage">
                <p>Upload your bracket:</p>
                <input type="file" name="paperBracketImage" />
              </label>
            )}
            <input type="submit" value="Submit Tournament" />
          </fieldset>
        </form>
      </section>
    );
  }
}

export default AddTournament;
