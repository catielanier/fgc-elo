import React from "react";
import Flag from "react-world-flags";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import moon from "../assets/moon.png";
import pluto from "../assets/pluto.png";
import uranus from "../assets/uranus.png";
import venus from "../assets/venus.png";
import mars from "../assets/mars.png";
import mercury from "../assets/mercury.png";
import chibi from "../assets/chibi.png";
import jupiter from "../assets/jupiter.png";
import neptune from "../assets/neptune.png";

class PlayerList extends React.Component {
  state = {
    playerList: [],
    loading: false,
    sorting: "tournamentScore"
  };
  async componentDidMount() {
    this.setState({
      loading: true
    });
    this.dbRefPlayers = firebase.database().ref("players/");
    let playerList = [];
    await this.dbRefPlayers.on("value", snapshot => {
      const characterObject = {
        moon: moon,
        mercury: mercury,
        jupiter: jupiter,
        mars: mars,
        venus: venus,
        uranus: uranus,
        pluto: pluto,
        neptune: neptune,
        chibi: chibi
      };
      const data = snapshot.val();
      for (let key in data) {
        let characterUrl = null;
        if (data[key].characterShort && data[key].characterShort !== "") {
          characterUrl = characterObject[data[key].characterShort];
        }
        playerList.push({
          key,
          ...data[key],
          characterUrl
        });
      }
      playerList.sort(function(x, y) {
        return (
          y.tournamentScore - x.tournamentScore || x.name.localeCompare(y.name)
        );
      });
      this.setState({
        playerList,
        loading: false
      });
    });
  }

  changeSort = e => {
    let { playerList } = this.state;
    const sorting = e.target.value;
    if (sorting === "tournamentScore") {
      playerList.sort(function(x, y) {
        return (
          y.tournamentScore - x.tournamentScore ||
          y.elo - x.elo ||
          x.name.localeCompare(y.name)
        );
      });
    } else {
      playerList.sort(function(x, y) {
        return (
          y.elo - x.elo ||
          y.tournamentScore - x.tournamentScore ||
          x.name.localeCompare(y.name)
        );
      });
    }
    this.setState({
      playerList,
      sorting
    });
  };

  render() {
    return (
      <section className="player-list">
        <label htmlFor="sorting">
          Sort by:
          <select
            name="sorting"
            onChange={this.changeSort}
            defaultValue={this.state.sorting}
            value={this.state.sorting}
          >
            <option value="tournamentScore">Tournament Score</option>
            <option value="elo">Ladder Rating</option>
          </select>
        </label>
        <div className="grid-container">
          <div className="grid-row grid-header">
            <div>Rank</div>
            <div>Player</div>
            <div>Character</div>
            <div>Tournament Score</div>
            <div>Ladder Rating</div>
          </div>
          {this.state.loading && (
            <div>
              <p className="loading">Loading...</p>
            </div>
          )}
          {this.state.playerList.length === 0 && !this.state.loading && (
            <div>
              <p>There are currently no results.</p>
            </div>
          )}
          {this.state.playerList.length > 0 &&
            this.state.playerList.map((player, index) => {
              return (
                <Link to={`player/${player.key}`} key={player.key}>
                  <div className="grid-row">
                    <div className="grid-header">{index + 1}</div>
                    <div>
                      {player.country && player.country !== "" && (
                        <Flag code={player.country} height="16" />
                      )}
                      &nbsp;
                      {player.name}
                    </div>
                    <div>
                      {player.character && player.character !== "" ? (
                        <img
                          src={player.characterUrl}
                          alt={player.character}
                          height="16"
                        />
                      ) : null}
                    </div>
                    <div>{player.tournamentScore}</div>
                    <div>{player.elo}</div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    );
  }
}

export default PlayerList;
