import React from "react";
import Flag from "react-world-flags";
import firebase from "../firebase";

class PlayerList extends React.Component {
  state = {
    playerList: [],
    loading: false
  };
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
        </div>
      </section>
    );
  }
}

export default PlayerList;
