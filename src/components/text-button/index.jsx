import React, { Component } from "react";
import PropTypes from "prop-types";

import ss from "classnames";
import c from "./text-button.comp.scss";

export default class TextButton extends Component {
  static propTypes = {
    label: PropTypes.string,
    iconPath: PropTypes.string,
    className: PropTypes.string,
    // actions
    onClick: PropTypes.func
  };

  triggerExternalClickHandler = e => {
    this.props.onClick(e);
  };

  render = () => (
    <div
      onClick={this.triggerExternalClickHandler}
      className={ss(c["container"], this.props.className)}
    >
      {/* Label */}
      <div className={ss(c["button-label"])}>{this.props.label}</div>
      {/* Icon */}
      {this.props.iconPath && (
        <img className={ss(c["button-icon"])} src={this.props.iconPath} />
      )}
    </div>
  );
}
