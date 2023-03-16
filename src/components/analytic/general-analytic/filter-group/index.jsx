import React, { Component } from "react";
import PropTypes from "prop-types";

import { Checkbox, Button } from "element-react";
import VerticalCheckbox from "./vertical-checkbox";
import Adder from "./adder/container";

import ss from "classnames";
import c from "./filter-group.comp.scss";

export const propTypes = {
  headerLabel: PropTypes.string,
  adderLabel: PropTypes.string,
  selectingItems: PropTypes.arrayOf(
    /**
     * Item shape
     */
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string
    })
  ),
  selectedKeys: PropTypes.array,
  onAllEnable: PropTypes.func,
  onFetch: PropTypes.func,
  onSelect: PropTypes.func,
  onChange: PropTypes.func
};

export default class FilterGroup extends Component {
  static propTypes = propTypes;

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.onAllEnable();
  }

  filterAddedItem = item => {
    return !this.props.selectingItems.map(({ key }) => key).includes(item.key);
  };

  disableAllOption = () =>
    this.props.selectingItems.length && this.props.selectedKeys.length;

  render = () => (
    <div className={ss(c["container"])}>
      <div className={ss(c["head"])}>
        {/**
         * Header + Clear Button
         */}
        <span className={ss(c["label"])}>{this.props.headerLabel}</span>
        {!!this.props.selectingItems.length && (
          <Button
            onClick={this.props.onAllEnable}
            className={ss(c["clear-btn"])}
            type="text"
          >
            CLEAR ALL
          </Button>
        )}
      </div>
      {/**
       * Each parts will has it seperator
       */}
      <div className={ss(c["parts"])}>
        <div className={ss(c["part"])}>
          {/** 
            * All state toogle - Enable for future need
            <Button
              type="text"
              disabled={
                this.props.selectingItems.length && this.props.selectedKeys.length
              }
            >
              All
            </Button> 
          */}
        </div>
        {/**
         * Filter items
         */}
        {!!this.props.selectingItems.length && (
          <div className={ss(c["part"])}>
            <VerticalCheckbox
              onChange={this.props.onChange}
              value={this.props.selectedKeys}
            >
              {this.props.selectingItems.map(item => (
                <Checkbox key={item.key} label={item.key}>
                  {item.name}
                </Checkbox>
              ))}
            </VerticalCheckbox>
          </div>
        )}
        {/**
         * Add more filter item
         */}
        <div className={ss(c["part"])}>
          <Adder
            className={ss(c["adder-btn"])}
            buttonLabel={this.props.adderLabel}
            extraCondition={this.filterAddedItem}
            onFetch={this.props.onFetch}
            onSelect={this.props.onSelect}
          />
        </div>
      </div>
    </div>
  );
}
