import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import { Dialog, Loading } from "element-react";

export const propTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.element,
  footer: PropTypes.element,
  // actions
  offForm: PropTypes.func,
  ftClassName: PropTypes.string
};

export default class Modal extends Component {
  static propTypes = propTypes;

  static defaultProps = {
    visible: false,
    loading: false,
    offForm: () => console.log("offForm")
  };

  render = () => {
    const {
      visible,
      loading,
      offForm,
      title,
      children,
      footer,
      ftClassName
    } = this.props;

    return (
      <Dialog title={title} visible={visible} onCancel={offForm}>
        {loading ? (
          <Loading>
            <Dialog.Body />
          </Loading>
        ) : (
          <Fragment>
            <Dialog.Body>{children}</Dialog.Body>
            {footer && (
              <Dialog.Footer className={ftClassName ? ftClassName : ""}>
                {footer}
              </Dialog.Footer>
            )}
          </Fragment>
        )}
      </Dialog>
    );
  };
}
