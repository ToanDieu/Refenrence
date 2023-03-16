import React, { Component } from "react";
import PropTypes from "prop-types";

export default class FieldFileInput extends Component {
  constructor(props) {
    super(props);
  }

  onChange = e => {
    this.props.onChange(e.target.files[0]);
  };

  render() {
    return (
      <div>
        <div>
          <input
            type="file"
            accept=".jpg, .png, .jpeg"
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

FieldFileInput.propTypes = {
  onChange: PropTypes.func
};
