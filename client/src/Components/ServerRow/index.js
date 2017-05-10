import React, { PureComponent } from 'react';

import Info from './info.js';
import Details from './details.js';

const styles = {
  root: {
    height: "120px",
    width: "100%",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "left",
    borderColor: "#666666 #333333 #333333 #666666",
    borderLeft: "1px solid #666666",
    borderRight: "1px solid #333333",
    borderRadius: "2px",
    boxShadow: "rgba(134, 36, 2, 0.15) 0px 0px 6px 1px inset",
    padding: "5px"
  },
  header: {
    marginRight: "5px",
  },
  header_h2: {
    fontSize: "1.7em",
    margin: "0",
    textAlign: "left",
  },
  description: {
    textAlign: "left",
    flexGrow: "2"
  },
  playerList: {
    fontSize: "1.2em",
    textAlign: "left",
    height: "20px",
    alignItems: "baseline"
  },
  hostAddr: {
    fontSize: ".7em"
  }
};

export default class ServerListRow extends PureComponent {
  render() {
    const {
      server: {
        name,
        game_id,
        players,
        max_players,
        game_time_elapsed,
        mod_count,
        has_password,
        application_version: {
          game_version,
          build_mode
        },
        details
      },
      index,
      //isLoading,
      onClick
    } = this.props;


    return (
      <section className="server-row" id={game_id} style={styles.root} onClick={() => onClick(game_id, index)}>
        <header style={styles.header}>
          <h2 style={styles.header_h2}>
            { name }&nbsp;
            <span style={styles.hostAddr}>
              { details ? details.host_address : "" }
            </span>
          </h2>
        </header>

        <div style={styles.info}>
          <Info playerCount={(players || []).length}
                  hasPassword={has_password}
                  maxPlayers={max_players}
                  duration={game_time_elapsed}
                  modCount={mod_count}
                  client={build_mode}
                  version={game_version} />
        </div>
        {
          (players || []).length > 0 ?
          (<div style={styles.playerList}>
              <span>Players:&nbsp;</span>
              <span>
              {
                 (players || []).map((p,i) =>
                  (<span key={i} style={ p.toLocaleLowerCase().includes("m6deep") ? { color : "yellow" } : {} }>{ p }&nbsp;</span>)
                 )
              }
              </span>
            </div>) : ""
        }

        <div style={styles.description}>

        {
          !!details ? (<Details host={details.host_address}
                   mods={details.mods}
                   description={details.description}
                  tags={details.tags}/>) : ""
        }
        </div>
      </section>
    );
  }
}
