import React from "react";
import firebase from "../firebase";

class EditPlayer extends React.Component {
  state = {
    key: "",
    realName: "",
    country: "",
    controller: "",
    team: "",
    twitter: "",
    twitch: "",
    mixer: "",
    countryLong: "",
    teamShort: "",
    imageUrl: ""
  };

  componentDidMount() {
    const key = window.location.pathname.replace("/edit-player/", "");
    this.dbRefPlayer = firebase.database().ref(`players/${key}`);
    this.dbRefPlayer.on("value", snapshot => {
      const data = snapshot.val();
      const {
        name,
        realName,
        country,
        controller,
        team,
        twitter,
        twitch,
        mixer,
        teamShort,
        countryLong,
        imageUrl
      } = data;
      this.setState({
        key,
        name,
        realName: realName || "",
        country: country || "",
        controller: controller || "",
        team: team || "",
        twitter: twitter || "",
        twitch: twitch || "",
        mixer: mixer || "",
        teamShort: teamShort || "",
        countryLong: countryLong || "",
        imageUrl: imageUrl || ""
      });
    });
  }

  changeState = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  uploadPhoto = e => {
    console.log("uploading photo");
  };

  render() {
    return (
      <section className="edit-player">
        <form>
          <h3>Edit {this.state.name}</h3>
          <fieldset>
            <label htmlFor="realName">
              <p>Real Name:</p>
              <input
                type="text"
                name="realName"
                value={this.state.realName}
                onChange={this.changeState}
                placeholder="Real Name"
              />
            </label>
            <label htmlFor="country">
              <p>Country</p>
              <select name="country">
                <option value="">Select a country</option>
              </select>
            </label>
            <label htmlFor="team">
              <p>Team Name:</p>
              <input
                type="text"
                name="team"
                onChange={this.changeState}
                value={this.state.team}
                placeholder="Team Name"
              />
            </label>
            <label htmlFor="teamShort">
              <p>Team Shorthand:</p>{" "}
              <input
                type="text"
                name="teamShort"
                onChange={this.changeState}
                value={this.state.teamShort}
                placeholder="Team Shorthand"
              />
            </label>
            <label htmlFor="controller">
              <p>Controller:</p>{" "}
              <input
                type="text"
                name="controller"
                value={this.state.controller}
                onChange={this.changeState}
                placeholder="Controller"
              />
            </label>
            <label htmlFor="imageUrl">
              <p>Photo:</p>
              <input type="file" name="imageUrl" onChange={this.uploadPhoto} />
            </label>
            <label htmlFor="twitter">
              <p>Twitter:</p>{" "}
              <input
                type="text"
                name="twitter"
                value={this.state.twitter}
                onChange={this.changeState}
                placeholder="Twitter"
              />
            </label>
            <label htmlFor="twitch">
              <p>Twitch:</p>{" "}
              <input
                type="text"
                name="twitch"
                value={this.state.twitch}
                onChange={this.changeState}
                placeholder="Twitch"
              />
            </label>
            <label htmlFor="mixer">
              <p>Mixer:</p>{" "}
              <input
                type="text"
                name="mixer"
                value={this.state.mixer}
                onChange={this.changeState}
                placeholder="Mixer"
              />
            </label>
            <input type="submit" value="Update Player" />
          </fieldset>
        </form>
      </section>
    );
  }
}

export default EditPlayer;
