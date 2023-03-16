import React, { Component } from "react";
import PropTypes from "prop-types";

import { Dropdown } from "element-react";
import TextButton from "../text-button";

import { map, toPairs } from "ramda";

export default class ButtonMultiOp extends Component {
  static propTypes = {
    label: PropTypes.string,
    iconPath: PropTypes.string,
    // actions
    onClick: PropTypes.func,
    /**
     * multiOption
     * key as dropdown menu label
     * value callback handler
     */
    multiOptions: PropTypes.object
  };

  triggerExternalClickHandler = (e, key) => {
    this.props.onClick(e, key);
  };

  render = () =>
    !this.props.multiOptions ? (
      /**
       * Signle option download
       **/
      <TextButton {...this.props} onClick={this.triggerExternalClickHandler} />
    ) : (
      /**
       * Multi-options download dropdown
       **/
      <Dropdown
        onCommand={key => this.triggerExternalClickHandler(null, key)}
        trigger="click"
        menu={
          <Dropdown.Menu>
            {map(
              ([key]) => (
                <Dropdown.Item command={key}>{key}</Dropdown.Item>
              ),
              toPairs(this.props.multiOptions)
            )}
          </Dropdown.Menu>
        }
      >
        {/**
         * Text button for pop over context
         **/}
        <TextButton label={this.props.label} iconPath={this.props.iconPath} />
      </Dropdown>
    );
}
