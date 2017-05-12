import React, { Component } from 'react';
import ReactList from 'react-list';
import FontAwesome from 'react-fontawesome';

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
    marginBottom: "10px",
    backgroundColor: "#575A5A",
    overflowY: 'scroll',
    overflowX: 'hidden',
    maxHeight: "950px"
  }
};

export default class ServerList extends Component {
  handleScroll(evt){
    const s = this.refs.scroller;
    const { servers, details } = this.props;
    s.getVisibleRange().forEach((i) => {
      const { game_id } = servers[i];
      if (!(details[game_id] || {}).loading){
        this.onLoadDetails(game_id);
      }
    })
  }

  onLoadDetails(gameId, index){
    actions.details(gameId, index);
  }

  renderRows(servers, details){
    if (servers.length === 0)
      return (i, k) => (<div>No servers to show</div>);

    return (i, k) => {
      const { game_id } = servers[i];

      return (<ServerListRow key={k}
                             index={i}
                             server={servers[i]}
                             details={details[game_id] || {}}
                             onClick={(g, i) => this.onLoadDetails(g, i)} />);
    }
  }

  render() {
    const { servers, loading, details } = this.props;

    return (
      <section style={styles.container}>
        <header style={styles.header}>
          <FontAwesome name="refresh" style={{ display: loading ? "none" : "inline" }} onClick={() => !loading && actions.games()}/>
          <span style={{ margin: "0 5px" }}>{ loading ? "loading..." : `${servers.length} games active`} </span>
          { /* 1min auto refresh option shoud go here */ }
        </header>
        <div style={styles.list} onScroll={this.handleScroll.bind(this)}>
           <ReactList ref="scroller" itemRenderer={this.renderRows(servers, details)}
                      useStaticSize={true}
                      type='uniform'
                      pageSize={15}
                      length={servers.length} />
        </div>
      </section>
    );
  }
}
