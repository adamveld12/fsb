import React, { PureComponent } from 'react';
import TermInput from './termInput.js';

const styles = {
  root: { },
};

export default class Search extends PureComponent {
  onSearchSubmit(terms){
    console.log(terms);
  }

  render() {
    return (
      <div style={styles.root}>
        <div>
          <TermInput onSubmit={this.onSearchSubmit.bind(this)}/>
        </div>
        <div>

        </div>
      </div>
    )
  }
}
