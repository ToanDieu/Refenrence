import React, { Component } from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";

import RemoveParam, { propTypes } from "./index";

import { removeSingleBaseParamWithoutStore } from "@/actions/base";

@connect(
  store => ({
    translate: getTranslate(store.locale)
  }),
  dispatch => ({
    dispatch,
    ...bindActionCreators({ removeSingleBaseParamWithoutStore }, dispatch)
  })
)
export default class RemoveParamContainer extends Component {
  static propTypes = {
    ...propTypes,
    paramStuff: PropTypes.object.isRequired,
    removeSingleBaseParamWithoutStore: PropTypes.func,
    dispatch: PropTypes.func,
    fetBaseParams: PropTypes.func
  };

  state = {
    isRequesting: false
  };

  removeParam = ({ baseID, paramID, fetBaseParams }) => closeModal => {
    this.setState({ isRequesting: true });
    return this.props
      .removeSingleBaseParamWithoutStore({ baseID, paramID })
      .then(() => {
        this.setState({ isRequesting: false }, () => {
          // close modal before page is redirected
          closeModal();
          fetBaseParams();
        });
      });
  };

  render = () => (
    <RemoveParam
      message={this.props.translate("removeParamMessage")}
      title={this.props.translate("removeparam")}
      isRequesting={this.state.isRequesting}
      onSubmit={this.removeParam(this.props.paramStuff)}
      primaryButton={this.props.translate("remove")}
      secondaryButton={this.props.translate("cancel")}
    />
  );
}
