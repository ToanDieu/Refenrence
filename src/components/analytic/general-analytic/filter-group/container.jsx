import React, { Component } from "react";

import FilterGroup, { propTypes } from "./index";

export default class FilterGroupContainer extends Component {
  static propTypes = propTypes;

  static defaultProps = {
    onAllEnable: () => console.log("triggered all!"),
    onFetch: setter => setter([{ name: "op 1", key: 1 }])
  };

  constructor(props) {
    super(props);
  }

  initialState = {
    selectingItems: [],
    selectedKeys: []
  };

  state = {
    ...this.initialState
  };

  onSelect = item => {
    console.log(item);
    this.setState(
      state => {
        console.log(state);
        return {
          ...state,
          selectingItems: [...state.selectingItems, item]
        };
      },
      () => {
        this.onChange([...this.state.selectedKeys, item.key]);
      }
    );
  };

  onChange = selectedKeys => {
    this.setState(
      state => ({ ...state, selectedKeys }),
      () => {
        const selectedItems = this.state.selectingItems.filter(item =>
          selectedKeys.includes(item.key)
        );

        this.props.onChange(selectedItems);
      }
    );
  };

  onAllEnable = () => {
    this.setState(this.initialState);
    this.onChange([]);
    this.props.onAllEnable();
  };

  render = () => (
    <FilterGroup
      selectingItems={this.state.selectingItems}
      selectedKeys={this.state.selectedKeys}
      onSelect={this.onSelect}
      onChange={this.onChange}
      onAllEnable={this.onAllEnable}
      onFetch={this.props.onFetch}
      headerLabel={this.props.headerLabel}
      adderLabel={this.props.adderLabel}
    />
  );
}
