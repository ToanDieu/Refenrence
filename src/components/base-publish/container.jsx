import React, { Component } from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";

import PublishBase, { propTypes } from "./index";

import { publishBase } from "@/ducks/bases";

export const componentName = "base-publish";

@connect(
  store => ({
    translate: getTranslate(store.locale)
  }),
  dispatch => ({ dispatch, ...bindActionCreators({ publishBase }, dispatch) })
)
export default class PublishBaseContainer extends Component {
  static propTypes = {
    ...propTypes,
    baseId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    publishBase: PropTypes.func,
    dispatch: PropTypes.func
  };

  state = {
    isRequesting: false
  };

  publishBase = baseId => closeModal => {
    this.setState({ isRequesting: true });
    return this.props.publishBase({ baseId }).then(response => {
      console.log(response);
      this.setState({ isRequesting: false }, () => {
        // close modal before page is redirected
        closeModal();
      });
    });
  };

  render = () => (
    <PublishBase
      message={this.props.translate("publish_message")}
      title={this.props.translate("publish")}
      isRequesting={this.state.isRequesting}
      onSubmit={this.publishBase(this.props.baseId)}
      primaryButton={this.props.translate("publish")}
      secondaryButton={this.props.translate("cancel")}
    />
  );
}
