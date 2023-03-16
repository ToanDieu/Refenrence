import React, { Component } from "react";
import PropTypes from "prop-types";
import saveAs from "file-saver";
import DownloadButton from "@/components/button-multi-op";
import format from "date-fns/format";

export default class DownloadButtonContainer extends Component {
  static propTypes = {
    label: PropTypes.string,
    iconPath: PropTypes.string,
    // actions
    onClick: PropTypes.func,
    multiOptions: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  triggerExternalClickHandler = (e, key) => {
    let result;
    if (!key) {
      /**
       * Single download context
       */
      result = this.props.onClick(e);
    } else {
      /**
       * Multi-options download context
       */
      result = this.props.multiOptions[key]();
    }

    if (typeof result.then === "function") {
      result.then(data => this.download(data));
    } else {
      this.download(result);
    }
  };

  download = textData => {
    const blob = new Blob([textData], {
      type: "text/csv;charset=utf-8"
    });
    const date = format(Date.now(), "YYYYMMDDHHmmss");
    saveAs(blob, "data" + date + ".csv");
  };

  render = () => (
    <DownloadButton
      {...this.props}
      onClick={this.triggerExternalClickHandler}
    />
  );
}
