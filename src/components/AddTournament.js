import React from "react";
import axios from "axios";
import Helmet from "react-helmet";
import Select from "react-select";
import firebase from "../firebase";
import findPlace from "./findPlace";
import { challongeKey, smashKey } from "../apiKeys";
import tournamentPoints from "./tournamentPoints";
import calculateElo from "./calculateElo";
import countries from "./countries";
import SelectStyle from "./styles/SelectStyle";

class AddTournament extends React.Component {
  state = {
    playerList: "",
    tournamentName: null,
    tournamentDate: null,
    bracketUrl: null,
    paperBracket: false,
    paperBracketImage: null,
    loading: false,
    success: false,
    error: false,
    message: null,
    playersInDB: [],
    country: null,
    countryLong: null,
    vodUrl: null
  };

  async componentDidMount() {
    this.dbRefPlayers = firebase.database().ref("players/");

    await this.dbRefPlayers.on("value", async snapshot => {
      const playersInDB = [];

      const data = snapshot.val();

      for (let key in data) {
        playersInDB.push({
          key,
          ...data[key]
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
      success: false,
      loading: true
    });

    const playerList = this.state.playerList.split("\n");

    const playerResults = [];

    const players = this.state.playersInDB;

    await playerList.map((player, index) => {
      const res = {
        name: player
      };

      res.place = findPlace(index);

      playerResults.push(res);
    });

    const {
      tournamentName,
      bracketUrl,
      tournamentDate,
      country,
      countryLong,
      paperBracketImage,
      vodUrl,
      paperBracket
    } = this.state;

    let bracketApi = null;

    let matches = null;

    let tournaments = null;

    let participants = null;

    let subDomain = null;

    const bracketSiteArray = ["challonge", "smash", "burningmeter"];

    bracketSiteArray.forEach(site => {
      const index = bracketUrl.indexOf(site);
      if (index !== -1) {
        bracketApi = site;
      }
    });

    const tournamentId = bracketUrl
      .replace("https://challonge.com/", "")
      .replace("https://www.burningmeter.com/t/", "");

    this.dbRefTournaments = firebase.database().ref("tournaments/");

    this.dbRefTournaments.on("value", snapshot => {
      tournaments = snapshot.val();

      for (let key in tournaments) {
        if (
          tournaments[key].bracketApi === bracketApi &&
          tournaments[key].tournamentId === tournamentId
        ) {
          this.setState({
            error: true,
            message: "This tournament has already been put into the database!"
          });
          return;
        }
      }
    });

    if (bracketApi === "challonge") {
      const subDomainIndex = bracketUrl.indexOf("https://challonge.com");
      if (subDomainIndex !== -1) {
        await axios({
          method: "get",
          url: `https://strawberry.sh/api/v1/tournaments/${tournamentId}/matches.json`,
          params: {
            api_key: challongeKey
          }
        }).then(res => {
          matches = res.data;
        });

        await axios({
          method: "get",
          url: `https://strawberry.sh/api/v1/tournaments/${tournamentId}.json`,
          params: {
            api_key: challongeKey,
            include_participants: "1"
          }
        }).then(res => {
          participants = res.data.tournament.participants;
        });
      } else {
        const domainIndex = bracketUrl.indexOf(".challonge");
        subDomain = bracketUrl.substring(8, domainIndex);
        await axios({
          method: "get",
          url: `https://strawberry.sh/api/v1/tournaments/${subDomain}-${tournamentId}/matches.json`,
          params: {
            api_key: challongeKey
          }
        }).then(res => {
          matches = res.data;
        });
        await axios({
          method: "get",
          url: `https://strawberry.sh/api/v1/tournaments/${subDomain}-${tournamentId}.json`,
          params: {
            api_key: challongeKey,
            include_participants: "1"
          }
        }).then(res => {
          participants = res.data.tournament.participants;
        });
      }

      participants.sort(function(x, y) {
        return (
          x.participant.final_rank - y.participant.final_rank ||
          x.participant.seed - y.participant.seed
        );
      });
      participants.map((participant, index) => {
        playerResults[index].id = participant.participant.id;
      });

      await matches.map(match => {
        const index = playerResults.findIndex(
          player => match.match.player1_id === player.id
        );
        const index2 = playerResults.findIndex(
          player => match.match.player2_id === player.id
        );
        const index3 = playerResults.findIndex(
          player => match.match.winner_id === player.id
        );

        if (index !== -1 && index2 !== -1) {
          match.match.player1_id = playerResults[index].name;
          match.match.player2_id = playerResults[index2].name;
          match.match.winner_id = playerResults[index3].name;
        }
        const scoreIndex = match.match.scores_csv.indexOf("-");
        const scoreLength = match.match.scores_csv.length;

        let player1_score = null;
        let player2_score = null;

        if (scoreIndex === 1 && scoreLength === 3) {
          player1_score = parseInt(
            match.match.scores_csv
              .substring(0, scoreLength - 1)
              .replace("-", "")
          );
          player2_score = parseInt(match.match.scores_csv[scoreLength - 1]);
        }
        if (
          match.match.scores_csv.indexOf("-1") === 0 ||
          match.match.scores_csv.indexOf("--1") === 1
        ) {
          match.match.is_dq = true;
        }
        match.match.player1_score = player1_score;
        match.match.player2_score = player2_score;
      });

      await matches.map(async match => {
        const dbIndex = players.findIndex(
          player => player.name === match.match.player1_id
        );

        const dbIndex2 = players.findIndex(
          player => player.name === match.match.player2_id
        );

        const playerOne = players[dbIndex] || {
          name: match.match.player1_id,
          elo: 1200,
          matchWins: 0,
          matchLosses: 0,
          gameWins: 0,
          gameLosses: 0,
          tournamentScore: 0
        };

        const playerTwo = players[dbIndex2] || {
          name: match.match.player2_id,
          elo: 1200,
          matchWins: 0,
          matchLosses: 0,
          gameWins: 0,
          gameLosses: 0,
          tournamentScore: 0
        };

        calculateElo(playerOne, playerTwo, match.match);

        if (match.match.player1_score && match.match.player1_score !== 0) {
          playerOne.gameWins = playerOne.gameWins + match.match.player1_score;
          if (match.match.player2_score && match.match.player2_score !== 0) {
            playerOne.gameLosses =
              playerOne.gameLosses + match.match.player2_score;
          }
        }

        if (match.match.player2_score && match.match.player2_score !== 0) {
          playerTwo.gameWins = playerTwo.gameWins + match.match.player2_score;
          if (match.match.player1_score && match.match.player1_score !== 0) {
            playerTwo.gameLosses =
              playerTwo.gameLosses + match.match.player1_score;
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
      });

      await playerResults.map(async player => {
        const playerIndex = players.findIndex(p => p.name === player.name);

        players[playerIndex].tournamentScore = tournamentPoints(
          player.place,
          players[playerIndex].tournamentScore,
          playerResults.length
        );
      });

      players.forEach(player => {
        if (!player.key) {
          this.dbRefPlayers.push(player);
        } else {
          this.dbRefPlayer = firebase.database().ref(`players/${player.key}`);
          delete player.key;
          this.dbRefPlayer.update(player);
        }
      });
    }

    if (bracketApi === "burningmeter") {
      await axios({
        method: "get",
        url: `${bracketUrl}/s/bracket.json`,
        header: {
          "content-type": "text/plain"
        }
      }).then(res => {
        matches = res.data.section.matches;
      });
      await axios({
        method: "get",
        url: `${bracketUrl}/results.json`,
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

          calculateElo(playerOne, playerTwo, match);

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
          players[playerIndex].tournamentScore,
          playerResults.length
        );
      });

      players.forEach(player => {
        if (!player.key) {
          this.dbRefPlayers.push(player);
        } else {
          this.dbRefPlayer = firebase.database().ref(`players/${player.key}`);
          delete player.key;
          this.dbRefPlayer.update(player);
        }
      });
    }

    playerResults.forEach(player => {
      const index = this.state.playersInDB.findIndex(
        dbPlayer => player.name === dbPlayer.name
      );
      player.key = this.state.playersInDB[index].key;
    });

    const tournament = {
      tournamentName,
      tournamentDate,
      tournamentId,
      bracketApi,
      country,
      countryLong,
      paperBracket,
      paperBracketImage,
      vodUrl,
      results: playerResults
    };

    await this.dbRefTournaments.push(tournament);

    this.setState({
      loading: false,
      success: true,
      tournamentName: null,
      bracketUrl: null,
      tournamentDate: null,
      country: null,
      countryLong: null,
      paperBracketImage: null,
      vodUrl: null,
      paperBracket: false,
      playerList: ""
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

  setCountry = e => {
    const { value, label } = e;
    this.setState({
      country: value,
      countryLong: label
    });
  };

  render() {
    return (
      <section className="add-tournament">
        <Helmet>
          <title>{"Add Tournament | Sailor Moon S Global Rankings"}</title>
        </Helmet>
        <h3>Add Tournament</h3>
        <form onSubmit={this.submitTournament}>
          <fieldset
            aria-busy={this.state.loading}
            disabled={this.state.loading}
          >
            {this.state.success && (
              <p className="success">Tournament successfully added!</p>
            )}
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
            <label htmlFor="country">
              <p>Tournament Country:</p>
              <Select
                name="country"
                onChange={this.setCountry}
                options={countries}
                styles={SelectStyle}
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
            <label htmlFor="vodUrl">
              <p>Stream VOD:</p>
              <input
                type="text"
                name="vodUrl"
                value={this.state.vodUrl}
                onChange={this.changeState}
              />
            </label>
            <input type="submit" value="Submit Tournament" />
          </fieldset>
        </form>
      </section>
    );
  }
}

export default AddTournament;
