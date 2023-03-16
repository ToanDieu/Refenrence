import React, { Component } from "react";
import PropTypes from "prop-types";

import ss from "classnames";
import c from "./reset-steps.comp.scss";

import { Button } from "element-react";
import Modal from "@/components/modal/container";

export const componentName = "reset-steps";

export const propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  isRequesting: PropTypes.bool,
  message: PropTypes.string,
  title: PropTypes.string,
  primaryButton: PropTypes.string,
  secondaryButton: PropTypes.string
};

export default class ResetSteps extends Component {
  static propTypes = propTypes;

  closeModal = () => {
    this.refs.modal.offForm();
  };

  submitHandle = () => {
    this.props.onSubmit();
    this.closeModal();
  };

  render = () => (
    <Modal
      ref="modal"
      title={this.props.title}
      componentName={componentName}
      onOffForm={this.props.onCancel}
      loading={this.props.isRequesting}
      footer={
        <div className={ss(c["button-group"])}>
          <Button onClick={this.submitHandle} type="danger">
            {this.props.primaryButton}
          </Button>
        </div>
      }
    >
      <div className={ss(c["body-content"])}>{this.props.message}</div>
    </Modal>
  );
}
