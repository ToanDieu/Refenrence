import React from "react";
import PropTypes from "prop-types";
import ss from "classnames";
import c from "./field.comp.scss";

export default class BasicInputField extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    input: PropTypes.object,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    error: PropTypes.string
  };

  render() {
    const { label, input, error, type, disabled } = this.props;
    console.log("fromTime, toTime input", input);
    return (
      <div>
        <div className={ss(c["label"], c["label--adjust"])}>{label}</div>
        <input
          className={ss(
            c["input"],
            c["input--default"],
            c["input--clear-browser-default"]
          )}
          style={{
            backgroundColor: disabled ? "#f6f5f4" : ""
          }}
          {...input}
          type={type}
          disabled={disabled}
        />
        {error && <p className={ss(c["error"])}>{error}</p>}
      </div>
    );
  }
}
