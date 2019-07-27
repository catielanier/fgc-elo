import React from "react";
import { Link } from "react-router-dom";

class Header extends React.Component {
  render() {
    return (
      <header>
        {!this.props.user && (
          <div className="admin-buttons">
            <Link to="/login">Login</Link>
          </div>
        )}
        <div className="header-text">
          <h1>Sailor Moon S Global Rankings</h1>
          <h2>Who's the best at fighting evil by moonlight?</h2>
        </div>
      </header>
    );
  }
}

export default Header;
