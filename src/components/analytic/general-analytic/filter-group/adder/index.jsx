import React, { Component, createRef } from "react";
import PropTypes from "prop-types";

import { Popover, Button } from "element-react";
import AutoSuggest from "@/components/auto-suggest";

import ss from "classnames";
import c from "./adder.comp.scss";

export default class Adder extends Component {
  static propTypes = {
    buttonLabel: PropTypes.string,
    onFetch: PropTypes.func,
    items: PropTypes.array,
    onSelect: PropTypes.func,
    extraCondition: PropTypes.func
  };

  static defaultProps = {
    extraCondition: () => true
  };

  constructor(props) {
    super(props);
  }

  suggestEle = createRef();

  clearSuggest = () => {
    this.suggestEle.current.updateInputVal("");
  };

  filterTags = (searchTerm, suggest) =>
    suggest.name.includes(searchTerm) && this.props.extraCondition(suggest);

  render = () => (
    <Popover
      width="250"
      trigger="click"
      visibleArrow={false}
      placement="right"
      className={ss(c["popover-container"])}
      content={
        <AutoSuggest
          ref={this.suggestEle}
          placeHolder="search item ..."
          onSelect={this.props.onSelect}
          suggestions={this.props.items}
          filterFunc={this.filterTags}
        />
      }
    >
      <Button
        {...this.props}
        onClick={this.clearSuggest}
        icon="plus"
        type="text"
      >
        {this.props.buttonLabel || "Mores"}
      </Button>
    </Popover>
  );
}
