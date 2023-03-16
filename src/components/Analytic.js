/* eslint-disable react/no-multi-comp */
import React from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";
import subDays from "date-fns/sub_days";
import {
  fetchColSum,
  fetchPassAnalytic,
  fetchPassScanRatioAnalytic
} from "../actions/analytic";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
  Sector
} from "recharts";
import configs from "../constants/orgConfigs.js";
import { checkField } from "../actions/utils";
import { getTranslate } from "react-localize-redux";
import { pathOr } from "ramda";
// import ProgressBar from "../components/View/ProgressBar";
const COLORS = ["#FA607E", "#4786FF", "#F7B84F", "#91CE58", "#BD80FF"];
const dateFormat = t => {
  const date = new Date(t);
  return format(date, "ddd, D");
};
const numberWithCommas = x => {
  if (!x) {
    return "0";
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

class AreaChartClass extends React.Component {
  state = {
    fromTime: format(subDays(new Date(), 7), "YYYY-MM-DD"),
    toTime: format(new Date(), "YYYY-MM-DD"),
    passAnalytic: {},
    refresh: false
  };
  componentDidMount() {
    this.refreshChart(this.props);
  }
  componentWillReceiveProps(props) {
    const { refresh } = props;
    // console.log("componentWillReceiveProps", props, this.props);
    if (this.state.refresh !== refresh) {
      this.refreshChart(props);
    }
    this.refreshChart(props);
  }
  refreshChart = res =>
    this.setState({
      usageData: res.usageData
    });
  render() {
    const { usageData } = this.state;
    console.log("======>", usageData);
    return (
      <div className="card-graph__content">
        <AreaChart width={824} height={220} data={usageData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={date => dateFormat(date)}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={10} width={30} />
          <Tooltip labelFormatter={date => dateFormat(date)} />
          <Area
            type="monotone"
            dataKey="onInvalidated"
            stackId="1"
            stroke="#e20f0f"
            fill="#e20f0f"
            dot={{
              stroke: "#e20f0f",
              strokeWidth: 1,
              r: 2
            }}
          />
          <Area
            type="monotone"
            dataKey="onUnregisteringPass"
            stackId="1"
            stroke="#000000"
            fill="#000000"
            dot={{
              stroke: "#000000",
              strokeWidth: 1,
              r: 2
            }}
          />
          <Area
            type="monotone"
            dataKey="onPreviewedPass"
            stackId="1"
            stroke="#a5cd73"
            fill="#a5cd73"
            dot={{
              stroke: "#a5cd73",
              strokeWidth: 1,
              r: 2
            }}
          />
          <Area
            type="monotone"
            dataKey="onDownloadedPass"
            stackId="1"
            stroke="#789ca8"
            fill="#789ca8"
            dot={{
              stroke: "#789ca8",
              strokeWidth: 1,
              r: 2
            }}
          />
        </AreaChart>
      </div>
    );
  }
}

AreaChartClass.propTypes = {
  fetchPassAnalytic: PropTypes.func,
  passAnalytic: PropTypes.object,
  fromTime: PropTypes.object,
  toTime: PropTypes.object,
  refresh: PropTypes.bool
};

class PieChartClass extends React.Component {
  state = {
    refresh: false
  };
  componentDidMount() {
    this.refreshChart(this.props || {});
  }
  componentWillReceiveProps(props) {
    const { refresh } = props;
    // console.log("PieChartWillReceiveProps", props, this.props);
    if (this.state.refresh !== refresh) {
      this.refreshChart(props || {});
    }
  }
  refreshChart = data =>
    this.setState({
      usageData: data.usageData || [],
      refresh: !this.state.refresh
    });
  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index
    });
  };
  renderActiveShape = data => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value
    } = data;
    const { translate } = this.props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 50) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        {/* <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text> */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {translate(`${payload.name}`)}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(Total: ${value})`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={36}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(Rate: ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  render() {
    const { translate } = this.props;
    const { usageData } = this.state || [];
    // console.log("usageDataPieChart", usageData);
    const RADIAN = Math.PI / 180;
    //const COLORS = ["#d10000", "#FF9999", "#FFCCFF", "#21ff00", "#0c34f9"];
    const renderCustomizedLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent
    }) => {
      if (percent < 0.05) {
        return "";
      }
      const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          key={y.toString() + x.toString()}
          x={x}
          y={y}
          fill="white"
          // textAnchor={x > cx ? "start" : "end"}
          textAnchor="middle"
          dominantBaseline="center"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };
    return (
      <div className="card-graph__contentpiechart">
        <text className="card-graph__title-non-border">{translate("Total")}</text>
        <div
          style={{
            width: "750px",
            height: "500px",
            margin: "auto",
            marginTop: "10px",
            border: "solid #e8e6e2 1px"
          }}
        >
          {" "}
          {!usageData ? (
            ""
          ) : (
            <PieChart width={600} height={500}>
              <Pie
                data={usageData}
                activeIndex={this.state.activeIndex}
                activeShape={this.renderActiveShape}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                labelLine={false}
                label={renderCustomizedLabel}
                fill="#8884d8"
                onMouseEnter={this.onPieEnter}
              >
                {usageData.map((entry, index) => {
                  let ind = parseInt(entry.name, 10);

                  if (!ind) {
                    ind = index + 1;
                  }
                  return (
                    <Cell
                      key={index}
                      fill={COLORS[ind - (1 % COLORS.length)]}
                    />
                  );
                })}{" "}
              </Pie>
            </PieChart>
          )}
        </div>
      </div>
    );
  }
}

PieChartClass.propTypes = {
  fetchColSum: PropTypes.func,
  usageDatas: PropTypes.array,
  fromTime: PropTypes.object,
  toTime: PropTypes.object,
  refresh: PropTypes.bool,
  col: PropTypes.string,
  format: PropTypes.string,
  activeIndex: PropTypes.array,
  translate: PropTypes.func
};

class BarChartClass extends React.Component {
  state = {
    fromTime: format(subDays(new Date(), 7), "YYYY-MM-DD"),
    toTime: format(new Date(), "YYYY-MM-DD"),
    passAnalytic: {},
    refresh: false
  };
  componentDidMount() {
    this.refreshChart(this.props || {});
  }
  componentWillReceiveProps(props) {
    const { refresh } = props;
    // console.log("BarWillReceiveProps", props, this.props);
    if (this.state.refresh !== refresh) {
      this.refreshChart(props || {});
    }
  }
  refreshChart = data =>
    this.setState({
      usageData: data.usageData || [],
      refresh: !this.state.refresh
    });
  render() {
    const { usageData } = this.state || {};
    // console.log("======>", usageData);
    return (
      <div className="card-graph__content card-graph_barchart">
        <BarChart width={730} height={250} data={usageData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="field" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="onPreviewedPass" fill="#8884d8" />
          <Bar dataKey="onDownloadedPass" fill="#82ca9d" />
          <Bar dataKey="onInvalidated" fill="#b738b3" />
        </BarChart>
      </div>
    );
  }
}

BarChartClass.propTypes = {
  fetchPassScanRatioAnalytic: PropTypes.func,
  passAnalytic: PropTypes.object,
  fromTime: PropTypes.object,
  toTime: PropTypes.object,
  refresh: PropTypes.bool,
  extraparam: PropTypes.string
};

class StackedBarChartClass extends React.Component {
  state = {
    refresh: false
  };
  componentDidMount() {
    this.refreshChart(this.props || {});
  }
  componentWillReceiveProps(props) {
    const { refresh } = props;
    // console.log("BarWillReceiveProps", props, this.props);
    if (this.state.refresh !== refresh) {
      this.refreshChart(props || {});
    }
  }
  refreshChart = data =>
    this.setState({
      usageData: data.usageData || [],
      refresh: !this.state.refresh,
      selectField: data.selectField || "",
      percent: data.percent
    });
  render() {
    let { usageData, selectField, percent } = this.state || {};
    const { handleClick, translate } = this.props;
    const org = this.props.getOrgName;

    const suffix = pathOr(
      "",
      ["display", "Analytic", "extendField", selectField, "label"],
      configs[org]
    );

    // remove empty element
    if (pathOr(false, ["filter"], usageData)) {
      usageData = usageData.filter(function(el) {
        return el != null;
      });
    }

    // Percentile data
    let newUsageData = [];
    if (percent) {
      newUsageData = usageData.map(line => {
        let keys = Object.keys(line);
        let total = 0;

        keys.map(name => {
          if (name.toUpperCase() == "NAME") {
            return;
          }
          total = total + line[name];
          return;
        });

        let newLine = {};
        keys.map(name => {
          if (name.toUpperCase() == "NAME") {
            newLine[name] = line[name];
            return;
          }

          newLine[name] = Math.round((line[name] / total) * 100 * 10) / 10;
          return;
        });

        return newLine;
      });
    } else {
      newUsageData = usageData;
    }

    return (
      <div className="card-graph__content carg-graph-stackedbarchart">
        <text className="card-graph__title-non-border">
          {translate("ratingByQuestion")}
          {" (%)"}
        </text>
        <div
          style={{
            margin: "auto",
            marginTop: "10px",
            width: "750px",
            border: "solid #e8e6e2 1px"
          }}
        >
          <BarChart
            width={730}
            height={350}
            data={newUsageData}
            margin={{ top: 50, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={"1 " + suffix}
              stackId="a"
              fill={COLORS[0]}
              onClick={(data, index) => handleClick(data, index)}
            />
            <Bar
              dataKey={"2 " + suffix}
              stackId="a"
              fill={COLORS[1]}
              onClick={(data, index) => handleClick(data, index)}
            />
            <Bar
              dataKey={"3 " + suffix}
              stackId="a"
              fill={COLORS[2]}
              onClick={(data, index) => handleClick(data, index)}
            />
            <Bar
              dataKey={"4 " + suffix}
              stackId="a"
              fill={COLORS[3]}
              onClick={(data, index) => handleClick(data, index)}
            />
            <Bar
              dataKey={"5 " + suffix}
              stackId="a"
              fill={COLORS[4]}
              onClick={(data, index) => handleClick(data, index)}
            />
            <Bar
              dataKey={"über 2 Std."}
              stackId="a"
              fill={COLORS[0]}
              onClick={(data, index) => handleClick(data, index)}
            />
            <Bar
              dataKey={"90 - 120 Min"}
              stackId="a"
              fill={COLORS[1]}
              onClick={(data, index) => handleClick(data, index)}
            />
            <Bar
              dataKey={"60 - 90 Min"}
              stackId="a"
              fill={COLORS[2]}
              onClick={(data, index) => handleClick(data, index)}
            />
            <Bar
              dataKey={"30 - 60 Min"}
              stackId="a"
              fill={COLORS[3]}
              onClick={(data, index) => handleClick(data, index)}
            />
            <Bar
              dataKey={"0 - 30 Min"}
              stackId="a"
              fill={COLORS[4]}
              onClick={(data, index) => handleClick(data, index)}
            />
          </BarChart>
        </div>
      </div>
    );
  }
}

StackedBarChartClass.propTypes = {
  refresh: PropTypes.bool,
  handleClick: PropTypes.func,
  translate: PropTypes.func,
  getOrgName: PropTypes.string
};

class TotalAnalytic extends React.Component {
  state = {
    passAnalytic: {},
    refresh: false
  };
  componentWillReceiveProps(props) {
    const { refresh } = props;
    // console.log("TotalWillReceiveProps", props, this.props);
    if (this.state.refresh !== refresh) {
      this.refreshChart(props || {});
    }
  }
  refreshChart = res =>
    this.setState({
      passAnalytic: res.passAnalytic || {}
    });

  render() {
    const { passAnalytic } = this.state;
    const { translate } = this.props;
    // console.log("TotalAnalytic", passAnalytic);
    let data = passAnalytic.data || {};
    const org = this.props.getOrgName;
    let extendTotal = "";
    if (checkField(configs, [org, "display", "Analytic", "extendTotal"])) {
      extendTotal = configs[org].display.Analytic.extendTotal.map(field => {
        if (field.label == "default") {
          return field.list.map(exfield => (
            <div key={exfield} className="list__item list__item--large">
              <div className="sub-title u-margin-bottom--10">
                {translate(exfield)}
              </div>
              <div className="analytic-figure u-color--dark-blue">
                {numberWithCommas(data[exfield] || 0)}
              </div>
            </div>
          ));
        } else {
          return (
            <div key={field.label} className="list__item list__item--large">
              <div className="sub-title u-margin-bottom--10">
                {translate(field.label)}
              </div>
              <div className="analytic-figure u-color--dark-blue">
                {numberWithCommas(data[field.column] || 0)}
              </div>
            </div>
          );
        }
      });
    }
    return (
      <div className="default-grid__left">
        <div className="list__item list__item--large">
          <div className="sub-title u-margin-bottom--10">
            {translate("Created Case")}
          </div>
          <div className="analytic-figure u-color--dark-blue">
            {numberWithCommas(data.onCreatedCase)}
          </div>
          {/* {progressBar(createdCase, createdCaseTarget)} */}
        </div>
        <div className="list__item list__item--large">
          <div className="sub-title u-margin-bottom--10">
            {translate("Previewed Pass")}
          </div>
          <div className="analytic-figure u-color--dark-blue">
            {numberWithCommas(data.onPreviewedPass)}
          </div>
          {/* {progressBar(previewedPass, previewedPassTarget)} */}
        </div>
        <div className="list__item list__item--large">
          <div className="sub-title u-margin-bottom--10">
            {translate("Added Pass")}
          </div>
          <div className="analytic-figure u-color--dark-blue">
            {numberWithCommas(data.onDownloadedPass)}
          </div>
          {/* {progressBar(addedPass, addedPassTarget)} */}
        </div>
        <div className="list__item list__item--large">
          <div className="sub-title u-margin-bottom--10">
            {translate("Unsubscribed Pass")}
          </div>
          <div className="analytic-figure u-color--dark-blue">
            {numberWithCommas(data.onUnregisteringPass)}
          </div>
          {/* {progressBar(unsubscribedPass, addedPass)} */}
        </div>
        {extendTotal}
      </div>
    );
  }
}
TotalAnalytic.propTypes = {
  fetchPassAnalytic: PropTypes.func,
  createdCase: PropTypes.number,
  createdCaseTarget: PropTypes.number,
  previewedPass: PropTypes.number,
  previewedPassTarget: PropTypes.number,
  addedPass: PropTypes.number,
  addedPassTarget: PropTypes.number,
  unsubscribedPass: PropTypes.number,
  refresh: PropTypes.bool,
  translate: PropTypes.func,
  getOrgName: PropTypes.string
};
const mapState = state => ({
  passAnalytic: state.passAnalytic || {},
  translate: getTranslate(state.locale),
  getOrgName: state.getOrgName.data
});
const colMapState = state => ({
  colAnalytic: state.colAnalytic || {},
  translate: getTranslate(state.locale)
});

const mapDispatch = dispatch => {
  return {
    fetchPassAnalytic: bindActionCreators(fetchPassAnalytic, dispatch),
    fetchPassScanRatioAnalytic: bindActionCreators(
      fetchPassScanRatioAnalytic,
      dispatch
    )
  };
};
const colmapDispatch = dispatch => {
  return {
    fetchColSum: bindActionCreators(fetchColSum, dispatch)
  };
};

const mySpecialContainerCreator = connect(
  mapState,
  mapDispatch
);
const colContainerCreator = connect(
  colMapState,
  colmapDispatch
);
export const AreaChartComponent = mySpecialContainerCreator(AreaChartClass);
export const BarChartClassComponent = mySpecialContainerCreator(BarChartClass);
export const StackedBarChartComponent = mySpecialContainerCreator(
  StackedBarChartClass
);
export const TotalAnalyticComponent = mySpecialContainerCreator(TotalAnalytic);
export const PieChartComponent = colContainerCreator(PieChartClass);
