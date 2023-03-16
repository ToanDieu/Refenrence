import React from "react";
import SingleField from "./SingleField";
import PropTypes from "prop-types";

let SingleFieldWithButton = props => (
  <div className="field-button">
    <SingleField {...props} />
    <button
      style={props.buttonStyle}
      className="field-button__button"
      type="button"
      onClick={props.onClickButton}
    >
      <img src={props.icon} />
    </button>
  </div>
);

SingleFieldWithButton.propTypes = {
  onClickButton: PropTypes.func,
  icon: PropTypes.string,
  buttonStyle: PropTypes.object
};

export default SingleFieldWithButton;
