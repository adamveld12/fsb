import React, { PureComponent } from 'react';
import logo from './factorio.png';

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    textAlign: "left",
  },
  upper: {
    borderRadius: "5px 5px 0 0",
    backgroundColor: "#262626",
    boxShadow: "inset 0 0px 15px 0px #995900",
    padding: "15px 10px",
    marginBottom: "3px",
  },
  lower: {
    borderRadius: "0 0 5px 5px",
    backgroundColor: "#FF9F1C",
    color: "#262626",
    padding: "10px",
    borderBottom: "2px #862402",
    boxShadow: "inset 0 2px 3px 0 #862402, 0 2px 3px 0 #862402",
  },
  h1: {
    margin: "0 5px",
    padding: 0,
    textShadow: "-1px 0 1px #000000, 1px 0 1px #ffc16d",
    fontSize: "1.5em",
    textTransform: "uppercase",
    display: "inline"
  }
};

export default class Header extends PureComponent {
  render() {
    return (
      <div style={styles.root}>
        <div style={styles.upper} >
          <img src={logo} className="App-logo" alt="factorio" />
        </div>
        <div style={styles.lower}>
          <h1 style={styles.h1}>Server Browser</h1><small>(Unoffical)</small>
        </div>
      </div>
    );
  }
}
