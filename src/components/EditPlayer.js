import React from "react";
import Select from "react-select";
import { Redirect } from "react-router-dom";
import firebase from "../firebase";
import countries from "./countries";
import characters from "./characters";
import SelectStyle from "./styles/SelectStyle";

class EditPlayer extends React.Component {
  state = {
    key: "",
    realName: "",
    character: "",
    characterShort: "",
    country: "",
    controller: "",
    team: "",
    twitter: "",
    twitch: "",
    mixer: "",
    countryLong: "",
    teamShort: "",
    imageUrl: "",
    loading: false,
    success: false,
    error: false,
    message: null
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
        character,
        characterShort,
        imageUrl
      } = data;
      this.setState({
        key,
        name,
        realName: realName || "",
        country: country || "",
        controller: controller || "",
        characterShort: characterShort || "",
        character: character || "",
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

  setCountry = e => {
    const { value, label } = e;

    this.setState({
      country: value,
      countryLong: label
    });
  };

  setCharacter = e => {
    const { value, label } = e;
    this.setState({
      character: label,
      characterShort: value
    });
  };

  uploadPhoto = async e => {
    const { files } = e.target;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "sms-elo");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/ddowroi3m/image/upload",
      {
        method: "POST",
        body: data
      }
    );

    const file = await res.json();

    this.setState({
      imageUrl: file.secure_url
    });
  };

  editPlayer = async e => {
    e.preventDefault();
    await this.setState({
      loading: true
    });
    this.dbRefPlayer = firebase.database().ref(`players/${this.state.key}`);
    const {
      realName,
      country,
      controller,
      team,
      twitter,
      twitch,
      mixer,
      teamShort,
      countryLong,
      character,
      characterShort,
      imageUrl
    } = this.state;

    const player = {
      realName,
      country,
      controller,
      team,
      twitter,
      twitch,
      mixer,
      teamShort,
      countryLong,
      character,
      characterShort,
      imageUrl
    };
    await this.dbRefPlayer.update(player);
    await this.setState({
      loading: false,
      success: true
    });
  };

  render() {
    if (this.state.success) {
      return <Redirect to={`/player/${this.state.key}`} />;
    }
    return (
      <section className="edit-player">
        <form onSubmit={this.editPlayer}>
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
              <Select
                onChange={this.setCountry}
                options={countries}
                styles={SelectStyle}
              />
            </label>
            <label htmlFor="character">
              <p>Main Character:</p>
              <Select
                options={characters}
                onChange={this.setCharacter}
                styles={SelectStyle}
              />
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
