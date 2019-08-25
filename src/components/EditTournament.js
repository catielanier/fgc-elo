import React from "react";
import { Redirect } from "react-router-dom";
import firebase from "../firebase";

class EditTournament extends React.Component {
  state = {
    key: null,
    tournamentName: null,
    tournamentDate: null,
    country: null,
    countryLong: null,
    vodUrl: null,
    editName: null
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
  render() {
    return <p>Edit Tournament</p>;
  }
}

export default EditTournament;
