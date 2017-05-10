
import React, { PureComponent } from 'react';
import FontAwesome from 'react-fontawesome';

const styles = {
  root: {
    maxHeight: "20px",
    display: "flex",
    justifyContent: "baseline",
  },
  attribute: {
    marginRight: "8px",
    fontSize: "1.2em"
  },
};

export default class Info extends PureComponent {
  render() {
    const { hasPassword, playerCount, maxPlayers, duration, version, modCount, client } = this.props;
    const dedicatedServer = client === "headless";

    return (
      <div style={styles.root}>
        <span style={styles.attribute}>
          <FontAwesome name={ hasPassword ? "lock" : "unlock" }/>
          &nbsp;{ hasPassword ? "private" : "open" }
        </span>
        <span style={styles.attribute}>
          <FontAwesome name="user"/>
          &nbsp;{playerCount}/{ maxPlayers === 0 ? '∞' : maxPlayers }
        </span>
        <span style={styles.attribute}>
          <FontAwesome name="clock-o" />
          &nbsp;{ Math.floor(duration/60)  } mins
        </span>
        <span style={styles.attribute}>
          <FontAwesome name="code-fork" />
          &nbsp;{ version }
        </span>
        <span style={styles.attribute}>
          <FontAwesome name="microchip" />
          &nbsp;{ modCount } mods
        </span>
        {

          dedicatedServer ?
              (<span style={styles.attribute}>
              { /* "steam" or "windows" or  "server" or "apple" */ }
                <FontAwesome name="server" />
                &nbsp;dedicated
              </span>) : ""
        }
      </div>
    );
  }
}
