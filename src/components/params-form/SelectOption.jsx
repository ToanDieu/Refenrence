import React, { Component } from "react";
import PropTypes from "prop-types";

import { Select } from "element-react";

import Tooltip from "@/components/tooltip";

import ss from "classnames";
import c from "./select-option.comp.scss";

export class SelectOption extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      label,
      tooltip,
      options,
      placeholder,
      onChange,
      value,
      disabled
    } = this.props;
    return (
      <div className={ss(c["cover"])}>
        {label && (
          <div className={ss(c["label"], c["label--adjust"])}>
            {label} {tooltip && <Tooltip content={tooltip} />}
          </div>
        )}
        <Select
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        >
          {options.map(el => {
            return (
              <Select.Option key={el.value} label={el.label} value={el.value} />
            );
          })}
        </Select>
      </div>
    );
  }
}

SelectOption.defaultProps = {
  disabled: false,
  options: [
    {
      value: "Option1",
      label: "Option1"
    },
    {
      value: "Option2",
      label: "Option2"
    },
    {
      value: "Option3",
      label: "Option3"
    },
    {
      value: "Option4",
      label: "Option4"
    },
    {
      value: "Option5",
      label: "Option5"
    }
  ],
  onChange: e => console.log(e),
  placeholder: "select value",
  value: ""
};

SelectOption.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  tooltip: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string
};
