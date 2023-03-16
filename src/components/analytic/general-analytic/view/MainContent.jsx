import React from "react";
import PropTypes from "prop-types";

import format from "date-fns/format";
import subDays from "date-fns/sub_days";

import { Card } from "element-react";
import { DropdownButon } from "@/components/fields";
import DatePickerCustom from "@/components/date-picker/DatePickerCustom";
import ChartArea from "./chart";

// import ss from "classnames";
// import c from "./style.comp.scss";

export default class MainContent extends React.Component {
  static propTypes = {
    changeChartType: PropTypes.func,
    chartType: PropTypes.string,
    onChange: PropTypes.func,
    chartData: PropTypes.array,
    dataKeysChart: PropTypes.array,
    refreshChart: PropTypes.bool,
    listGroup: PropTypes.array
  };
  state = {
    fromTime: format(subDays(new Date(), 7), "YYYY-MM-DD"),
    toTime: format(new Date(), "YYYY-MM-DD"),
    chartType: "Bar Chart",
    labelsAnalytic: [],
    sortLabels: ""
  };

  convertGMTToUTCAndFormat = (formatString, value) => {
    let tempValue = new Date(value);

    //HARD CODE -->>> FIX SOON
    tempValue.setHours(23, 59, 59);
    tempValue.setDate(tempValue.getDate() + 1);

    let returnValue = format(
      tempValue.getTime() + tempValue.getTimezoneOffset() * 60000,
      formatString
    );

    return returnValue;
  };

  getDate = target => date => {
    if (target == "from") {
      this.setState(state => {
        return {
          ...state,
          fromTime: this.convertGMTToUTCAndFormat("YYYY-MM-DD", date)
        };
      }, this.onChange);
    }
    if (target == "to") {
      this.setState(state => {
        return {
          ...state,
          toTime: this.convertGMTToUTCAndFormat("YYYY-MM-DD", date)
        };
      }, this.onChange);
    }
    return;
  };

  onChangeLabels = values => {
    if (values) {
      this.setState(state => {
        return {
          ...state,
          labelsAnalytic: values
        };
      }, this.onChange);
    }
  };

  onChangeSort = value => {
    this.setState(state => {
      return {
        ...state,
        sortLabels: value
      };
    }, this.onChange);
  };

  changeChartType = type => {
    if (type) {
      this.setState({
        chartType: type
      });
    }
  };

  onChange = () => {
    const { onChange } = this.props;
    onChange(this.state);
  };

  render() {
    const { fromTime, toTime, chartType } = this.state;
    const { chartData, dataKeysChart, refreshChart, listGroup } = this.props;
    return (
      <Card
        className="box-card"
        header={
          <div className="clearfix">
            <span className="el-card__title" style={{ lineHeight: "36px" }}>
              <span>From</span>
              <DatePickerCustom
                value={fromTime ? new Date(fromTime) : new Date()}
                handleOnchange={this.getDate("from")}
              />
              <span>To</span>
              <DatePickerCustom
                value={toTime ? new Date(toTime) : new Date()}
                handleOnchange={this.getDate("to")}
              />
            </span>
            <div style={{ float: "right", color: "#1e5a6e" }}>
              <DropdownButon
                align={"right"}
                items={["Bar Chart", "Line Chart"]}
                onCommand={this.changeChartType}
                options={{ trigger: "click" }}
              >
                <span
                  style={{
                    color: "#1e5a6e",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                  className="el-dropdown-link"
                >
                  {chartType}
                  <i className="el-icon-caret-bottom el-icon--right" />
                </span>
              </DropdownButon>
            </div>
          </div>
        }
      >
        <ChartArea
          chartData={chartData}
          dataKeysChart={dataKeysChart}
          typeChart={chartType}
          onChangeLabels={this.onChangeLabels}
          onChangeSort={this.onChangeSort}
          refreshChart={refreshChart}
          listGroup={listGroup}
        />
      </Card>
    );
  }
}
