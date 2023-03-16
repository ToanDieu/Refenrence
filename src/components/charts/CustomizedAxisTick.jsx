import React from "react";
import PropTypes from "prop-types";
import { pathOr } from "ramda";

export default class CustomizedAxisTick extends React.Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    payload: PropTypes.object,
    data: PropTypes.array
  };
  render() {
    const { x, y, payload, data } = this.props;
    console.log("payload", payload);

    payload.value = pathOr(payload.value, [payload.index, "labelX"], data);

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          width={10}
          x={0}
          y={0}
          dy={20}
          textAnchor="end"
          fill="#666"
          transform="rotate(-25)"
        >
          {payload.value}
        </text>
      </g>
    );
  }
}
