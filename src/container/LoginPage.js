import React, { Component } from "react";
import queryString from "query-string";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import track from "react-tracking";
import LoginFormAuth0 from "../components/LoginFormAuth0";
import { login } from "../actions/user";
import Loading from "../components/Loading";

@track({ page: "LoginPage" })
class LoginPage extends Component {
  // login = values => {
  //   this.props.login(values);
  // };
  componentWillMount = () => {
    if (window.location.hash) {
      let { access_token, id_token } = queryString.parse(window.location.hash);
      if (access_token && id_token) {
        this.props.login(access_token, id_token);
      }
    }
  };
  checkLoading = () => {
    let loading = "false";

    loading = localStorage.getItem("loginLoading");
    localStorage.setItem("loginLoading", false);

    return loading;
  };
  render() {
    const { user, login } = this.props;

    return (
      <div className="container u-padding--60">
        <div className="card card--material u-margin-both--60">
          <div className="card__title">TSE Dashboard Login</div>
          <div className="card__body u-padding-top--40 u-padding-bottom--60">
            <div className="grid--6of12 u-margin--auto-horizontal">
              {user.error ? (
                <div className="error u-margin-bottom--14">* {user.error}</div>
              ) : null}
              {this.checkLoading() == "true" ? (
                <Loading />
              ) : (
                <LoginFormAuth0 login={login} />
              )}
              <div className="u-color--vin-blue u-font-size--15 u-text-align--center">
                You will be redirected to authentication page
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  login: PropTypes.func,
  user: PropTypes.shape({
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    loading: PropTypes.bool
  })
};

const mapDispatch = dispatch => ({
  login: bindActionCreators(login, dispatch)
});

const mapState = state => ({
  user: state.user
});

export default connect(
  mapState,
  mapDispatch
)(LoginPage);
