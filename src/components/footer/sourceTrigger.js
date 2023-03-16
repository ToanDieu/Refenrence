import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getVersion } from "@/actions/utils";
import config from "@/appConfig";

class FooterSource extends React.Component {
  static propTypes = {
    versionEngine: PropTypes.object,
    render: PropTypes.func,
    error: PropTypes.any,
    fetchVersion: PropTypes.func
  };

  componentWillMount() {
    this.props.fetchVersion();
  }

  componentDidMount() {
    this.props.fetchVersion();
  }

  render() {
    const versionWeb = config.TSE_WEB_VERSION;
    const { render, versionEngine, error } = this.props;
    return render({ versionEngine, error, versionWeb });
  }
}

export default connect(
  state => {
    return {
      versionEngine: state.version.data,
      error: state.version.error
    };
  },
  dispatch => ({
    fetchVersion: bindActionCreators(getVersion, dispatch)
  })
)(FooterSource);
