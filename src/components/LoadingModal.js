import React from "react";

const LoadingModal = () => (
  <div className="Modal Modal--full">
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <svg
        className="spinner spinner--centered"
        width="80px"
        height="80px"
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="path path--primary"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          cx="33"
          cy="33"
          r="30"
        />
      </svg>
    </div>
  </div>
);

export default LoadingModal;
