import React from "react";
import axios from "axios";
import { challongeKey } from "../apiKeys";

class AddTournament extends React.Component {
  state = {
    playerList: "",
    tournamentName: "",
    tournamentDate: null,
    bracketUrl: "",
    paperBracket: false,
    paperBracketImage: "",
    loading: false,
    success: false,
    error: false,
    message: null
  };

  submitTournament = async e => {
    e.preventDefault();
    await this.setState({
      loading: true
    });
    const playerList = this.state.playerList.split("\n");
    const playerResults = [];

    await playerList.map((player, index) => {
      const res = {
        name: player
      };
      if (index >= 0 && index < 4) {
        res.place = index + 1;
      }
      if (index >= 4 && index < 6) {
        res.place = 5;
      }
      if (index >= 6 && index < 8) {
        res.place = 7;
      }
      if (index >= 8 && index < 12) {
        res.place = 9;
      }
      if (index >= 12 && index < 16) {
        res.place = 13;
      }
      if (index >= 16 && index < 24) {
        res.place = 17;
      }
      if (index >= 24 && index < 32) {
        res.place = 25;
      }
      if (index >= 32 && index < 48) {
        res.place = 33;
      }
      if (index >= 48 && index < 64) {
        res.place = 49;
      }
      if (index >= 64 && index < 96) {
        res.place = 65;
      }
      if (index >= 96 && index < 128) {
        res.place = 97;
      }
      if (index >= 128 && index < 192) {
        res.place = 129;
      }
      if (index >= 192 && index < 256) {
        res.place = 193;
      }
      if (index >= 256 && index < 384) {
        res.place = 257;
      }
      if (index >= 384 && index < 512) {
        res.place = 385;
      }
      if (index >= 512 && index < 768) {
        res.place = 513;
      }
      if (index >= 768 && index < 1024) {
        res.place = 769;
      }
      if (index >= 1024 && index < 1536) {
        res.place = 1025;
      }
      if (index >= 1536 && index < 2048) {
        res.place = 1537;
      }
      playerResults.push(res);
    });

    const { tournamentName, bracketUrl, tournamentDate } = this.state;
    let bracketApi = null;
    const bracketSiteArray = ["challonge", "smash", "burningmeter"];
    bracketSiteArray.forEach(site => {
      const index = bracketUrl.indexOf(site);
      if (index !== -1) {
        bracketApi = site;
      }
    });
    if (bracketApi === "challonge") {
      const tournamentId = bracketUrl.replace("https://challonge.com/", "");
      console.log(challongeKey);
      await axios({
        method: "get",
        url: `https://api.challonge.com/v1/tournaments/${tournamentId}/matches.json`,
        params: {
          api_key: challongeKey
        },
        header: {
          "Access-Control-Allow-Origin": "*"
        }
      }).then(res => {
        console.log(res);
      });
    }

    if (bracketApi === "burningmeter") {
      let matches = null;
      const tournamentId = bracketUrl;
      await axios({
        method: "get",
        url: `${tournamentId}/s/bracket.json`,
        header: {
          "content-type": "text/plain"
        }
      }).then(res => {
        matches = res.data.section.matches;
      });
      await axios({
        method: "get",
        url: `${tournamentId}/results.json`,
        header: {
          "content-type": "text/plain"
        }
      }).then(res => {
        let { entrants } = res.data.tournament;
        entrants = entrants.sort(function(x, y) {
          return (
            x.overall_placing - y.overall_placing ||
            x.name.localeCompare(y.name)
          );
        });
        entrants.map((entrant, index) => {
          playerResults[index].id = entrant.id;
        });
      });
      matches = matches.sort(function(x, y) {
        return x.ended_at.localeCompare(y.ended_at);
      });
      matches.map(match => {
        const index = playerResults.findIndex(
          player => player.id === match.entrant_top_id
        );
        const index2 = playerResults.findIndex(
          player => player.id === match.entrant_btm_id
        );
        console.log(index, index2);

        if (index === -1 || index2 === -1) {
          match.is_bye = true;
        } else {
          match.entrant_top_id = playerResults[index].name;
          match.entrant_btm_id = playerResults[index2].name;
          match.is_bye = false;
        }
      });
      console.log(matches);
    }
    await this.setState({
      loading: false
    });
  };

  changeState = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  changeBoolean = e => {
    const paperBracket = !this.state.paperBracket;
    this.setState({
      paperBracket
    });
  };

  render() {
    return (
      <section className="add-tournament">
        <h3>Add Tournament</h3>
        <form onSubmit={this.submitTournament}>
          <fieldset
            aria-busy={this.state.loading}
            disabled={this.state.loading}
          >
            <label htmlFor="tournamentName">
              <p>Tournament Name:</p>{" "}
              <input
                type="text"
                name="tournamentName"
                value={this.state.tournamentName}
                onChange={this.changeState}
              />
            </label>
            <label htmlFor="tournamentDate">
              <p>Tournament Date:</p>
              <input
                type="date"
                name="tournamentDate"
                value={this.state.tournamentDate}
                onChange={this.changeState}
              />
            </label>
            <label htmlFor="playerList">
              <p>Player List:</p>
              <textarea
                name="playerList"
                value={this.state.playerList}
                onChange={this.changeState}
              />
            </label>
            <label htmlFor="paperBracket">
              <input
                type="checkbox"
                name="paperBracket"
                value={this.state.paperBracket}
                onChange={this.changeBoolean}
              />
              This bracket has no online version, and was done on paper.
            </label>
            {!this.state.paperBracket && (
              <label htmlFor="bracketUrl">
                <p>Link to bracket:</p>
                <input
                  type="text"
                  name="bracketUrl"
                  value={this.state.bracketUrl}
                  onChange={this.changeState}
                />
              </label>
            )}
            {this.state.paperBracket && (
              <label htmlFor="paperBracketImage">
                <p>Upload your bracket:</p>
                <input type="file" name="paperBracketImage" />
              </label>
            )}
            <input type="submit" value="Submit Tournament" />
          </fieldset>
        </form>
      </section>
    );
  }
}

export default AddTournament;
