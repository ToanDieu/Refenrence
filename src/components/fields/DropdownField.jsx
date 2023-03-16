import React from "react";
import PropTypes from "prop-types";
import ss from "classnames";
import c from "./field.comp.scss";

export default class DropdownField extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    input: PropTypes.number,
    options: PropTypes.array,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    error: PropTypes.string
  };

  render() {
    const { label, input, options, error, disabled } = this.props;
    return (
      <div>
        <div className={ss(c["label"], c["label--adjust"])}>{label}</div>
        <select
          className={ss(c["input"], c["input--default"], c["input--adjust"])}
          style={{
            backgroundColor: disabled ? "#f6f5f4" : ""
          }}
          disabled={disabled}
          onChange={e => {
            this.props.onChange(e.target.value);
            console.log(e.target.value);
          }}
          name={"role"}
          defaultValue={input}
        >
          <option disabled value="">
            Select a {label}
          </option>
          {options.map((item, index) => {
            return (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            );
          })}
        </select>
        {error ? <p className={ss(c["error"])}>{error}</p> : null}
      </div>
    );
  }
}
