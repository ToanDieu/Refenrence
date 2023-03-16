import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import ss from "classnames";
import c from "./checkbox-basic.comp.scss";

import SelectedIcon from "@/assets/icons/ic-box-check.svg";
import UnSelectedIcon from "@/assets/icons/ic-box-empty.svg";
import Tooltip from "@/components/tooltip";

export class CheckBoxBasic extends PureComponent {
  render() {
    const { mess, isChecked, onClick, label, tooltip, disabled } = this.props;
    return (
      <div className={ss(c.wrapper)}>
        {label && (
          <div className={ss(c.label, c["label--adjust"])}>
            {label}
            {tooltip && <Tooltip content={tooltip} />}
          </div>
        )}
        <img
          alt="icon"
          style={{
            backgroundColor: disabled ? "#f6f5f4" : ""
          }}
          src={isChecked ? SelectedIcon : UnSelectedIcon}
          onClick={!disabled ? onClick : undefined}
          {...this.props}
        />
        {mess && <span>{mess}</span>}
      </div>
    );
  }
}

CheckBoxBasic.defaultProps = {
  isChecked: false,
  mess: "",
  label: "",
  tooltip: "",
  disabled: false,
  onClick: () => {}
};

CheckBoxBasic.propTypes = {
  isChecked: PropTypes.bool,
  mess: PropTypes.string,
  onClick: PropTypes.func,
  label: PropTypes.string,
  tooltip: PropTypes.string,
  disabled: PropTypes.bool
};
