import React from "react";
import PropTypes from "prop-types";
import track from "react-tracking";

let LoginForm = props => {
  return (
    <form className="form">
      <div className="u-text-align--center">
        <button
          onClick={event => {
            event.preventDefault();
            props.tracking.trackEvent({ event: "sign-in-attempt" });
            props.login();
          }}
          className="button button--primary button--centered u-margin-bottom--40"
          type="submit"
        >
          Login
        </button>
      </div>
    </form>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func
};

export default track({ module: "LoginForm" })(LoginForm);
