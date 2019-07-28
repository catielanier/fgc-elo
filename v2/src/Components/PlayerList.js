import React from "react";
import Flag from "react-world-flags";
import firebase from "../firebase";

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
      const data = snapshot.val();
      for (let key in data) {
        playerList.push({
          key,
          ...data[key]
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
                <div className="grid-row" key={player.key}>
                  <div className="grid-header">{index + 1}</div>
                  <div>{player.name}</div>
                  <div>{player.character ? player.character : null}</div>
                  <div>{player.tournamentScore}</div>
                  <div>{player.elo}</div>
                </div>
              );
            })}
        </div>
      </section>
    );
  }
}

export default PlayerList;
