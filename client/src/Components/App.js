import React, { Component } from 'react';
import { pageView } from '../ga.js';
import './App.css';

import store, { initialState, actions } from '../store.js';
import Header from './Header';
import ServerList from './ServerList';


export default class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  componentDidMount(){
    this.__handle__ = store.onDispatchComplete((s, a) => this.setState(s));
    pageView();
    actions.games();
  }

  componentWillUnmount(){
    store.removeOnDispatch(this.__handle__);
  }

  render() {
    const { servers, search: { terms } } = this.state;
    var t = terms.toLowerCase();
    return (
      <section className="App">
        <Header />
        <ServerList loading={servers.loading}
                    details={servers.details}
                    servers={servers.games.filter(g => t === "" || g.name.toLowerCase().indexOf(t) > -1)} />
      </section>
    );
  }
}
