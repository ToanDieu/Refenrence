import React, { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";

import ResetSteps, { propTypes } from "./index";

import { resetCase } from "@/ducks/cases";

export const componentName = "reset-steps";

@connect(
  store => ({
    translate: getTranslate(store.locale)
  }),
  dispatch => ({ dispatch, ...bindActionCreators({ resetCase }, dispatch) })
)
export default class ResetStepsContainer extends Component {
  static propTypes = {
    ...propTypes
  };

  render = () => (
    <ResetSteps
      message={this.props.translate("reset_message")}
      title={this.props.translate("resetCase")}
      onSubmit={this.props.onSubmit}
      onCancel={this.props.onCancel}
      primaryButton={this.props.translate("Reset")}
      secondaryButton={this.props.translate("cancel")}
    />
  );
}
