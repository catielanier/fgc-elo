import React from "react";
import axios from "axios";
import firebase from "../firebase";
import { challongeKey } from "../apiKeys";

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

  componentDidMount() {
    this.dbRefPlayers = firebase.database().ref("players/");
    this.dbRefPlayers.on("value", snapshot => {
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
      this.setState({
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

    await playerList.map((player, index) => {
      const res = {
        name: player
      };
      if (index >= 0 && index < 4) {
        res.place = index + 1;
      }
      if (index >= 4 && index < 6) {
        res.place = 5;
      }
      if (index >= 6 && index < 8) {
        res.place = 7;
      }
      if (index >= 8 && index < 12) {
        res.place = 9;
      }
      if (index >= 12 && index < 16) {
        res.place = 13;
      }
      if (index >= 16 && index < 24) {
        res.place = 17;
      }
      if (index >= 24 && index < 32) {
        res.place = 25;
      }
      if (index >= 32 && index < 48) {
        res.place = 33;
      }
      if (index >= 48 && index < 64) {
        res.place = 49;
      }
      if (index >= 64 && index < 96) {
        res.place = 65;
      }
      if (index >= 96 && index < 128) {
        res.place = 97;
      }
      if (index >= 128 && index < 192) {
        res.place = 129;
      }
      if (index >= 192 && index < 256) {
        res.place = 193;
      }
      if (index >= 256 && index < 384) {
        res.place = 257;
      }
      if (index >= 384 && index < 512) {
        res.place = 385;
      }
      if (index >= 512 && index < 768) {
        res.place = 513;
      }
      if (index >= 768 && index < 1024) {
        res.place = 769;
      }
      if (index >= 1024 && index < 1536) {
        res.place = 1025;
      }
      if (index >= 1536 && index < 2048) {
        res.place = 1537;
      }
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
      console.log(matches);
      matches.map(match => {
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

      matches.map(async match => {
        if (match.is_bye === false) {
          const dbIndex = this.state.playersInDB.findIndex(
            player => player.name === match.entrant_top_id
          );
          const dbIndex2 = this.state.playersInDB.findIndex(
            player => player.name === match.entrant_btm_id
          );
          console.log(dbIndex, dbIndex2);
          const playerOne = this.state.playersInDB[dbIndex] || {
            name: match.entrant_top_id,
            elo: 1200,
            matchWins: 0,
            matchLosses: 0,
            gameWins: 0,
            gameLosses: 0
          };
          const playerTwo = this.state.playersInDB[dbIndex2] || {
            name: match.entrant_btm_id,
            elo: 1200,
            matchWins: 0,
            matchLosses: 0,
            gameWins: 0,
            gameLosses: 0
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

          if (playerOne.key === undefined) {
            this.dbRefPlayers.push(playerOne);
          } else if (playerOne.key !== undefined) {
            this.dbRefPlayer = firebase
              .database()
              .ref(`players/${playerOne.key}`);
            delete playerOne.key;
            this.dbRefPlayer.set(playerOne);
          }

          if (playerTwo.key === undefined) {
            this.dbRefPlayers.push(playerTwo);
          } else if (playerTwo.key !== undefined) {
            this.dbRefPlayer = firebase
              .database()
              .ref(`players/${playerTwo.key}`);
            delete playerTwo.key;
            this.dbRefPlayer.set(playerTwo);
          }
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

  changeBoolean = e => {
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
