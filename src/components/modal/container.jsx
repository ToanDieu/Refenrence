import React, { Component } from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Modal, { propTypes } from "./index";

import { offForm } from "@/ducks/forms";

class ModalContainer extends Component {
  static propTypes = { ...propTypes, componentName: PropTypes.string };
  static defaultProps = {
    onOffForm: () => console.log("onOffForm")
  };

  offForm = () => {
    this.props.onOffForm();
    this.props.offForm();
  };

  render = () => {
    const { visible } = this.props;
    const overProps = {
      ...this.props,
      offForm: this.offForm,
      visible
    };

    return <Modal {...overProps} />;
  };
}

export default connect(
  (store, incommingProps) => ({
    visible:
      store.formsDuck.current === incommingProps.componentName &&
      store.formsDuck.visible
  }),
  dispatch => bindActionCreators({ offForm }, dispatch),
  null,
  { forwardRef: true }
)(ModalContainer);
