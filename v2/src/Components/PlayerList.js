import React from "react";
import Flag from "react-world-flags";
import firebase from "../firebase";

class PlayerList extends React.Component {
  state = {
    playerList: [],
    loading: false
  };
  async componentDidMount() {
    this.dbRefPlayers = firebase.database().ref("players/");
    let playerList = [];
    await this.dbRefPlayers.on("value", snapshot => {
      const data = snapshot.val();
      console.log(data);
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
        playerList
      });
    });
  }
  render() {
    return (
      <section className="player-list">
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
