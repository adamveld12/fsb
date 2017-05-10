import React, { PureComponent } from 'react';

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "baseline",
  },
  description: {
    display: 'block'
  },
  modList: {
    overflowY: "hidden"
  },
  tags: {
    fontSize: "1.2em",
    textAlign: "left",
    height: "20px",
    alignItems: "baseline",
    marginBottom: "5px"
  }
};

export default class Info extends PureComponent {
  render() {
    const {
        //mods,
        description,
        tags
    } = this.props;

    return (
      <div style={styles.root}>
        <div style={styles.tags}>
            <span>
              Tags:&nbsp;
            </span>
            <span>
             { (tags || []).join(", ") }
            </span>
        </div>

        <div style={styles.description}>
          { description }
        </div>
        {
          /*

        <div style={styles.modList}>
          <ul>
          {
            (mods || []).map((m) =>
              (<li>{ m.name }</li>)
            )
          }
          </ul>
        </div>
          */

        }
      </div>
    );
  }
}
