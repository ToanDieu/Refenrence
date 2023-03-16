import React, { Component } from "react";
import PropTypes from "prop-types";

import { Input } from "element-react";

import Tooltip from "@/components/tooltip";

import ss from "classnames";
import c from "./input-field.comp.scss";

export class InputField extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { label, type, disabled, tooltip, value } = this.props;
    return (
      <div>
        {label && (
          <div className={ss(c["label"], c["label--adjust"])}>
            {label} {tooltip && <Tooltip content={tooltip} />}
          </div>
        )}
        <div className={ss(c["input--default"])}>
          <Input
            style={{
              backgroundColor: disabled ? "#f6f5f4" : ""
            }}
            {...this.props}
            type={type}
            disabled={disabled}
            value={value}
          />
        </div>
      </div>
    );
  }
}

InputField.defaultProps = {
  type: "text",
  disabled: false,
  value: ""
};

InputField.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  tooltip: PropTypes.string,
  value: PropTypes.string
};
