import React, { Component } from "react";
import PropTypes from "prop-types";

import ss from "classnames";
import c from "./archive-case.comp.scss";

import { Button } from "element-react";
import Modal from "@/components/modal/container";

export const componentName = "archive-case";

export const propTypes = {
  onSubmit: PropTypes.func,
  isRequesting: PropTypes.bool,
  message: PropTypes.string,
  title: PropTypes.string,
  primaryButton: PropTypes.string,
  secondaryButton: PropTypes.string
};

class ArchiveCase extends Component {
  static propTypes = propTypes;

  closeModal = () => {
    this.refs.modal.offForm();
  };

  archiveHandle = () => {
    this.props.onSubmit(this.closeModal);
  };

  render = () => (
    <Modal
      ref="modal"
      title={this.props.title}
      componentName={componentName}
      loading={this.props.isRequesting}
      footer={
        <div className={ss(c["button-group"])}>
          <Button onClick={this.archiveHandle} type="danger">
            {this.props.primaryButton}
          </Button>
          <Button onClick={this.closeModal}>
            {this.props.secondaryButton}
          </Button>
        </div>
      }
    >
      <div className={ss(c["body-content"])}>{this.props.message}</div>
    </Modal>
  );
}

export default ArchiveCase;
