import React from "react";
import firebase from "../firebase";

class AddPlayer extends React.Component {
  state = {
    name: null
  };

  changeState = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  submitForm = async e => {
    e.preventDefault();
    this.dbRefPlayers = firebase.database().ref("players/");
    const player = {
      name: this.state.name
    };
    await this.dbRefPlayers.push(player);
    this.setState({
      name: null
    });
  };

  render() {
    return (
      <section className="add-player">
        <form onSubmit={this.submitForm}>
          <fieldset>
            <label htmlFor="name">
              <p>Player Name:</p>
              <input
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.changeState}
              />
            </label>
            <input type="submit" value="Add Player to DB" />
          </fieldset>
        </form>
      </section>
    );
  }
}

export default AddPlayer;
