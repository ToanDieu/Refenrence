import React from "react";
import PropTypes from "prop-types";
import ss from "classnames";
import c from "./chart.comp.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import CustomizedAxisTick from "./CustomizedAxisTick";

export default class LineChartComponent extends React.Component {
  static propTypes = {
    refresh: PropTypes.bool,
    data: PropTypes.array,
    dataKeysChart: PropTypes.array,
    colors: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    label: PropTypes.string
  };
  static defaultProps = {
    data: [],
    dataKeysChart: []
  };
  state = {
    refresh: false,
    data: [],
    dataKeysChart: []
  };

  componentDidMount() {
    this.refreshChart(this.props);
  }

  componentWillReceiveProps(props) {
    const { refresh } = props;
    if (this.state.refresh !== refresh) {
      this.refreshChart(props);
    }
    this.refreshChart(props);
  }

  refreshChart = res => {
    if (!res || !res.data) {
      return;
    }
    this.setState({
      data: res.data,
      dataKeysChart: res.dataKeysChart,
      height: res.height,
      label: res.label
    });
  };

  render() {
    const { data, width, height, label, dataKeysChart } = this.state;
    const { colors } = this.props;

    return (
      <div className={ss(c["content"])}>
        {label == "" ? (
          <text className={ss(c["title-non-border"])}>{label}</text>
        ) : (
          ""
        )}
        <div className={ss(c["grap-content"])}>
          <LineChart
            width={width || 730}
            height={height || 350}
            data={data}
            margin={{ top: 20, right: 15, left: 15, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={<CustomizedAxisTick data={data} />} />
            <YAxis />
            <Tooltip />
            {dataKeysChart.map((key, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={key.toLowerCase()}
                stroke={colors[key]}
              />
            ))}
            >
          </LineChart>
        </div>
      </div>
    );
  }
}
