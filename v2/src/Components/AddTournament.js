import React from "react";

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

  submitTournament = e => {
    e.preventDefault();
    console.log("tournament submitted");
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
          <fieldset>
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
