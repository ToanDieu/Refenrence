import React, { Component } from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { getTranslate } from "react-localize-redux";

import ArchiveCase, { propTypes } from "./index";

import { archiveCase } from "@/ducks/cases";

export const componentName = "archive-case";

@connect(
  store => ({
    translate: getTranslate(store.locale)
  }),
  dispatch => ({ dispatch, ...bindActionCreators({ archiveCase }, dispatch) })
)
export default class ArchiveCaseContainer extends Component {
  static propTypes = {
    ...propTypes,
    caseId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    archiveCase: PropTypes.func,
    dispatch: PropTypes.func
  };

  state = {
    isRequesting: false
  };

  archiveCase = caseId => closeModal => {
    this.setState({ isRequesting: true });
    return this.props.archiveCase({ caseId }).then(({ data }) => {
      this.setState({ isRequesting: false }, () => {
        // close modal before page is redirected
        closeModal();
        this.props.dispatch(push(`/bases/${data.baseId}/cases`));
      });
    });
  };

  render = () => (
    <ArchiveCase
      message={this.props.translate("archive_message")}
      title={this.props.translate("archiveCase")}
      isRequesting={this.state.isRequesting}
      onSubmit={this.archiveCase(this.props.caseId)}
      primaryButton={this.props.translate("archive")}
      secondaryButton={this.props.translate("cancel")}
    />
  );
}
