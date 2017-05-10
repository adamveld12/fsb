import React, { Component } from 'react';
import ReactList from 'react-list';

import ServerListRow from './ServerRow';
import { actions } from '../store.js';

const styles = {
  container: {
    background: "#404040",
    borderColor: "#555555 #111111 #111111 #666666",
    borderRadius: "4px 4px 4px 4px",
    borderStyle: "solid",
    borderWidth: "1px",
    margin: "10px 0",
    padding: "5px 10px",
    fontSize: ".7rem",
    maxHeight: "1080px",
  },
  header: {
    color: "white",
    textAlign: "left",
  },
  list: {
    marginTop: "15px",
    backgroundColor: "#575A5A",
    overflowY: 'scroll',
    overflowX: 'hidden',
    maxHeight: "95%"
  }
};

export default class ServerList extends Component {
  onLoadDetails(gameId, index){
    actions.details(gameId, index);
  }

  renderRows(servers){
    if (servers.length === 0)
      return (i, k) => (<div>No servers to show</div>);

    return (i, k) => (<ServerListRow key={k}
                                     index={i}
                                     server={servers[i]}
                                     details={servers[i].details || ""}
                                     onClick={(g, i) => this.onLoadDetails(g, i)} />);
  }

  render() {
    const { servers, loading } = this.props;

    return (
      <section style={styles.container}>
        <header style={styles.header}>
          <span>{ loading ? "loading..." : `${servers.length} games active`} </span>
        </header>
        <div style={styles.list}>
          <ReactList itemRenderer={this.renderRows(servers)}
                     useStaticSize={true}
                     type='uniform'
                     pageSize={15}
                     length={servers.length} />
                     <div style={{ clear: "both"}}> </div>
        </div>
      </section>
    );
  }
}
