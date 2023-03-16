import React from "react";
import PropTypes from "prop-types";
import ss from "classnames";
import c from "./chart.comp.scss";
import { XAxis, YAxis, CartesianGrid, Tooltip, Bar, BarChart } from "recharts";
import CustomizedAxisTick from "./CustomizedAxisTick";

export default class BarChartComponent extends React.Component {
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
      width: res.width,
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
          <BarChart
            width={width || 730}
            height={height || 350}
            data={data}
            margin={{ top: 20, right: 15, left: 15, bottom: 20 }}
            barSize={20}
            barGap={0}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={<CustomizedAxisTick data={data} />} />
            <YAxis />
            <Tooltip />

            {dataKeysChart.map((key, index) => {
              console.log("dataKeysChart.map: ", key);
              return (
                <Bar
                  key={index}
                  dataKey={key.toLowerCase()}
                  fill={colors[key]}
                  //label={!disableLabelBar ? { position: "top" } : null}
                  // background={{ fill: "#eee" }}
                >
                  {/* {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={color[index]} />
                ))} */}
                </Bar>
              );
            })}
          </BarChart>
        </div>
      </div>
    );
  }
}
