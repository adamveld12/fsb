import React, { PureComponent } from 'react';
import FontAwesome from 'react-fontawesome';

const styles = {
  root: { },
  inputBox: {
    width: "300px",
    margin: "5px",
    borderRadius: "2px",
    backgroundColor: "#404040",
    color: "#FF9F1C",
    border: "none",
    lineHeight: "1.8",
    boxShadow: "0 2px 3px 1px #bd7615",
    padding: "0 8px"
  },
  submitButton: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderWidth: "1px",
  }
};

export default class TermInput extends PureComponent {
  constructor(){
    super();
    this.state = { terms: "" };
  }

  handleEnter = ({ key }) => {
    if (key === 'Enter')
      this.onSubmit()
  }

  onTermChange = ({ target: { value } }) => {
    this.setState({ terms: value });
  }

  onSubmit = () => {
    const { onSubmit } = this.props;
    const { terms } = this.state;

    if (onSubmit)
      onSubmit(terms);
  }

  render() {
    return (
      <div style={styles.root}>
        <input style={styles.inputBox}
               type="text"
               onKeyPress={this.handleEnter}
               onChange={this.onTermChange}/>
        <button style={styles.submitButton} onClick={this.onSubmit} >
          <FontAwesome name="search" />
        </button>
      </div>
    )
  }
}
