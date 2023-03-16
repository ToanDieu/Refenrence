import React from "react";
import PropTypes from "prop-types";

const ProgressBar = ({ value, target }) => (
  <div className="progress-bar">
    <div
      className="progress"
      style={{
        width: `${value / target * 102}%`,
        borderRadius: `${value / target === 1 ? "4px" : "4px 0 0 4px"}`
      }}
    />
  </div>
);

ProgressBar.propTypes = {
  value: PropTypes.number,
  target: PropTypes.number
};

export default ProgressBar;
