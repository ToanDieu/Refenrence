import PropTypes from "prop-types";
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isContainScope } from "../actions/utils";

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem("token") ? (
        !rest.scope || isContainScope(rest.scope) ? (
          <Component {...props} {...rest} />
        ) : null
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

ProtectedRoute.propTypes = {
  component: PropTypes.func,
  location: PropTypes.object,
  socket: PropTypes.object
};

export default ProtectedRoute;
