import React from "react";
import PropTypes from "prop-types";
//import { BasicInputField } from "../fields";
import DatePickerCustom from "../../date-picker/DatePickerCustom";
import ss from "classnames";
import c from "./submit.comp.scss";
import { Button } from "element-react";
import format from "date-fns/format";
import subDays from "date-fns/sub_days";
import { connect } from "react-redux";
import { DropdownButon, RadioField } from "../../fields";
import ListTags from "../../tag";
import configs from "../../../constants/orgConfigs";
import { pathOr } from "ramda";
import { HorizontalForm } from "../../form";

@connect(
  store => ({
    getOrgName: store.getOrgName.data
  }),
  () => {}
)
export default class SubmitForm extends React.Component {
  static propTypes = {
    translate: PropTypes.func,
    onSubmit: PropTypes.func
  };
  state = {
    fromTime: format(subDays(new Date(), 7), "YYYY-MM-DD"),
    toTime: format(new Date(), "YYYY-MM-DD"),
    timeFrequency: "daily",
    groupBySelected: "",
    filtersSelected: [],
    typeChartSelected: "BarChart",
    analyticFieldSeclected: ""
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
      this.setState({
        fromTime: this.convertGMTToUTCAndFormat("YYYY-MM-DD", date)
      });
      return;
    }
    if (target == "to") {
      this.setState({
        toTime: this.convertGMTToUTCAndFormat("YYYY-MM-DD", date)
      });
      return;
    }
  };

  selectGroupBy = value => {
    if (value) {
      console.log("selectGroupBy");
      this.setState({
        groupBySelected: value
      });
    }
  };

  handleTimeFrequency = command => {
    this.setState({
      timeFrequency: command
    });
  };

  handleFilter = target => value => {
    let newFilter = this.state.filtersSelected;
    console.log("handleFilter", newFilter);
    if (newFilter && newFilter.length > 0) {
      newFilter.map(index => {
        if (newFilter[index].name == target) {
          if (newFilter[index].value.indexOf(value)) {
            newFilter[index].value.push(value);
          }
        }
      });

      this.setState({
        filtersSelected: newFilter
      });
    } else {
      console.log("handleFilter", target, value);
      this.setState({
        filtersSelected: [{ name: target, value: [value] }]
      });
    }
  };

  handlerField = value => {
    if (value) {
      this.setState({
        analyticFieldSeclected: value
      });
    }
  };

  handleTypeChart = value => {
    if (value) {
      this.setState({
        typeChartSelected: value
      });
    }
  };

  removeFilters = obj => {
    if (obj) {
      let newFiltersSelected = this.state.filtersSelected;
      newFiltersSelected = newFiltersSelected.splice(
        newFiltersSelected.indexOf(obj.value),
        1
      );
      this.setState({
        filtersSelected: newFiltersSelected
      });
    }
  };

  submitForm = e => {
    e.preventDefault();
    this.props.onSubmit(this.state);
  };

  render() {
    const {
      fromTime,
      toTime,
      timeFrequency,
      filtersSelected,
      typeChartSelected,
      analyticFieldSeclected
    } = this.state;
    const { getOrgName } = this.props;
    let { groupBySelected } = this.state;
    const timeFrequencyOptions = ["daily", "weekly", "monthly"];
    const groupByList = pathOr(
      [],
      [getOrgName, "display", "Analytic", "groupByList"],
      configs
    );
    let filtersList = pathOr(
      [],
      [getOrgName, "display", "Analytic", "filtersList"],
      configs
    );
    const analyticFields = pathOr(
      [],
      [getOrgName, "display", "Analytic", "analyticFields"],
      configs
    );

    if (!groupBySelected || groupBySelected == "") {
      groupBySelected = pathOr("", [0], groupByList);
    }

    let hideTimeFre = { display: "none" };
    if (groupBySelected == "Date") {
      console.log("groupBySelected", groupBySelected);
      hideTimeFre = {};
    }

    filtersList.map((item, index) => {
      console.log("filtersList", filtersList[index]);
      filtersList[index].value.push("1");
    });

    return (
      <form onSubmit={this.submitForm}>
        <div className={"u-margin-bottom--6"}>
          <HorizontalForm>
            <div>
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
            </div>
            <div>
              <DropdownButon
                items={analyticFields}
                onCommand={this.handlerField}
                options={{ trigger: "click" }}
              >
                <span className="el-dropdown-link">
                  {analyticFieldSeclected || analyticFields[0]}
                  <i className="el-icon-caret-bottom el-icon--right" />
                </span>
              </DropdownButon>
            </div>

            <div align={"right"}>
              <DropdownButon
                items={["BarChart", "LineChart"]}
                options={{ trigger: "click" }}
                onCommand={this.handleTypeChart}
              >
                <span className={ss("el-dropdown-link", c["button-min"])}>
                  {typeChartSelected}
                  <i className="el-icon-caret-bottom el-icon--right" />
                </span>
              </DropdownButon>
            </div>
          </HorizontalForm>
        </div>
        <div className={"u-margin-bottom--6"}>
          <HorizontalForm>
            <div>
              <span>Group by :</span>
              <RadioField
                options={{ value: groupBySelected }}
                onChange={this.selectGroupBy}
                items={groupByList}
              />
            </div>
            <div style={hideTimeFre}>
              <DropdownButon
                items={timeFrequencyOptions}
                onCommand={this.handleTimeFrequency}
                options={{ trigger: "click" }}
              >
                <span className="el-dropdown-link">
                  {timeFrequency}
                  <i className="el-icon-caret-bottom el-icon--right" />
                </span>
              </DropdownButon>
            </div>
          </HorizontalForm>
        </div>
        <div className={"u-margin-bottom--20"}>
          <HorizontalForm>
            <div>
              <span>Filters :</span>
              <div>
                <ListTags
                  selectedTags={filtersSelected.map(item => {
                    return {
                      name: item.value,
                      id: item.name
                    };
                  })}
                  onRemoveTag={id => {
                    console.log("id", id);
                  }}
                />
              </div>
            </div>
            <div>
              {filtersList.map(item => (
                <span key={item} className={ss(c["tag-item"])}>
                  <DropdownButon
                    items={item.value}
                    onCommand={this.handleFilter(item.name)}
                    options={{ trigger: "click" }}
                  >
                    <div className="el-dropdown-link">
                      {item.name}
                      <i className="el-icon-caret-bottom el-icon--right" />
                    </div>
                  </DropdownButon>
                </span>
              ))}
            </div>
            <Button type="primary"> SHOW</Button>
          </HorizontalForm>
        </div>
      </form>
    );
  }
}
