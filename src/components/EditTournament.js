import React from "react";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import countries from "./countries";
import firebase from "../firebase";
import SelectStyle from "./styles/SelectStyle";

class EditTournament extends React.Component {
  state = {
    key: null,
    tournamentName: null,
    tournamentDate: null,
    country: null,
    countryLong: null,
    vodUrl: null,
    editName: null,
    loading: false,
    error: false,
    message: null,
    success: false
  };

  componentDidMount() {
    const key = window.location.pathname.replace("/edit-tournament/", "");
    this.dbRefTournament = firebase.database().ref(`tournaments/${key}`);
    this.dbRefTournament.on("value", snapshot => {
      const data = snapshot.val();
      const {
        tournamentName,
        tournamentDate,
        country,
        countryLong,
        vodUrl
      } = data;
      this.setState({
        key,
        tournamentDate,
        tournamentName,
        country,
        countryLong,
        vodUrl,
        editName: tournamentName
      });
    });
  }

  editTournament = async e => {
    e.preventDefault();
    await this.setState({
      loading: true
    });
    const {
      key,
      tournamentDate,
      tournamentName,
      country,
      countryLong,
      vodUrl
    } = this.state;

    const tournament = {
      key,
      tournamentDate,
      tournamentName,
      country,
      countryLong,
      vodUrl
    };

    for (let item in tournament) {
      if (tournament[item] === undefined || tournament[item] === "") {
        delete tournament[item];
      }
    }

    this.dbRefTournament = firebase.database().ref(`tournaments/${key}`);
    await this.dbRefTournament.update(tournament);
    await this.setState({
      loading: false,
      success: true
    });
  };

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

  render() {
    if (this.state.success) {
      return <Redirect to={`/tournament/${this.state.key}`} />;
    }
    return (
      <section className="edit-tournament">
        <form onSubmit={this.editTournament}>
          <h3>Editing {this.state.editName}</h3>
          <fieldset>
            <label htmlFor="tournamentName">
              Tournament Name:{" "}
              <input
                type="text"
                name="tournamentName"
                value={this.state.tournamentName}
                onChange={this.changeState}
              />
            </label>
            <label htmlFor="tournamentDate">
              Date:{" "}
              <input
                type="date"
                name="tournamentDate"
                value={this.state.tournamentDate}
                onChange={this.changeState}
              />
            </label>
            <label htmlFor="country">
              Country:
              <Select
                onChange={this.setCountry}
                value={{
                  value: this.state.country,
                  label: this.state.countryLong || "Select Country"
                }}
                options={countries}
                styles={SelectStyle}
              />
            </label>
            <label htmlFor="vodUrl">
              Replay URL:
              <input
                type="text"
                onChange={this.changeState}
                name="vodUrl"
                value={this.state.vodUrl}
              />
            </label>
            <input type="submit" value="Edit Tournament" />
          </fieldset>
        </form>
      </section>
    );
  }
}

export default EditTournament;
