import React from "react";
import PropTypes from "prop-types";
import ss from "classnames";
import c from "./error.comp.scss";

export const ErrorHolder = ({ mess }) => (
  <p className={ss(c["error-holder"])}>{mess}</p>
);

ErrorHolder.defaultProps = {
  mess: ""
};

ErrorHolder.propTypes = {
  mess: PropTypes.string
};
