import React, { PureComponent } from 'react';
import TermInput from './termInput.js';

import { actions } from '../../store.js';

const styles = {
  root: { },
};

export default class Search extends PureComponent {
  onSearchSubmit = (terms) => {
    console.log(terms);
    actions.search({ terms });
  }

  render() {
    return (
      <div style={styles.root}>
        <div>
          <TermInput onSubmit={this.onSearchSubmit}/>
        </div>
        <div>
        </div>
      </div>
    )
  }
}
