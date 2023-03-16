import React, { Component } from "react";
import PropTypes from "prop-types";

import Adder from "./index";

export default class AdderContainer extends Component {
  static propTypes = {
    onFetch: PropTypes.func,
    onSelect: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  state = {
    items: []
  };

  componentWillMount() {
    const { onFetch } = this.props;
    if (onFetch) {
      this.props.onFetch(items => {
        /**
         * items: []item
         * item object shape
         * {
         *  name: string
         *  ...
         * }
         */
        console.log("this.props.onFetch: ", items);
        this.setState(state => ({ ...state, items }));
      });
    }
  }

  render = () => (
    <Adder
      items={this.state.items}
      onSelect={this.props.onSelect}
      {...this.props}
    />
  );
}
