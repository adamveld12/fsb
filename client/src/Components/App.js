import React, { Component } from 'react';
import './App.css';

import store, { initialState, actions } from '../store.js';
import Header from './Header';
import ServerList from './ServerList';


export default class App extends Component {
  constructor(){
    super();
    this.state = initialState;
    this.__handle__ = store.onDispatchComplete((s, a) => this.setState(s));
  }

  componentDidMount(){
    actions.games();
  }

  componentWillUnmount(){
    store.removeOnDispatch(this.__handle__);
  }

  render() {
    const { servers } = this.state;
    return (
      <section className="App">
        <Header />
        <ServerList loading={servers.loading} details={servers.details} servers={servers.games} />
      </section>
    );
  }
}
