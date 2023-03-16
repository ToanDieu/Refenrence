import React, { Component } from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { push } from "connected-react-router";

import SearchPopover from "./index";

@connect(
  null,
  dispatch =>
    bindActionCreators(
      {
        changePath: push
      },
      dispatch
    )
)
export default class SearchPopoverContainer extends Component {
  static propTypes = {
    searchPage: PropTypes.string,
    changePath: PropTypes.func,
    placeHolder: PropTypes.string
  };

  search = searchTerm => {
    const { changePath, searchPage } = this.props;

    changePath(`${searchPage}/${searchTerm}`);
  };

  render = () => (
    <SearchPopover onEnter={this.search} placeHolder={this.props.placeHolder} />
  );
}
