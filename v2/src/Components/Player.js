import React from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase";

class Player extends React.Component {
  state = {
    player: {}
  };

  componentDidMount() {
    const key = window.location.pathname.replace("/player/", "");
    this.dbRefPlayer = firebase.database().ref(`players/${key}`);
    this.dbRefPlayer.on("value", snapshot => {
      const player = snapshot.val();
      player.key = key;
      this.setState({
        player
      });
    });
  }

  render() {
    return (
      <section className="player">
        <div className="grid-container">
          <div className="player-picture">
            <p>Placeholder for picture</p>
          </div>
          <div className="player-profile">
            <h3>{this.state.player.name}</h3>
          </div>
        </div>
        {this.props.user && (
          <Link
            to={`/edit-player/${this.state.player.key}`}
            className="admin-button"
          >
            Edit Player
          </Link>
        )}
      </section>
    );
  }
}

export default Player;
