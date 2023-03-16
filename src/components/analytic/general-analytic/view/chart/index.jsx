import React from "react";
import PropTypes from "prop-types";

import { HorizontalForm } from "@/components/form";
import { RadioGroup } from "@/components/fields/radio";
import { DropdownButon } from "@/components/fields";
import { LineChartComponent, BarChartComponent } from "@/components/charts";

import ss from "classnames";
import c from "./chart.comp.scss";

import sortIcon from "./assets/ic-circle-menu-active.svg";
import closeIcon from "./assets/ic-circle-close.svg";

export default class ChartArea extends React.Component {
  static propTypes = {
    typeChart: PropTypes.string,
    onChangeLabels: PropTypes.func,
    onChangeSort: PropTypes.func,
    chartData: PropTypes.array,
    dataKeysChart: PropTypes.array,
    refreshChart: PropTypes.bool,
    listGroup: PropTypes.array
  };

  static defaultProps = {
    chartData: []
  };

  state = {
    listType: [],
    refreshChart: false,
    sort: ""
  };

  onChangeLabels = values => {
    this.setState({
      listType: values
    });
    const { onChangeLabels } = this.props;
    onChangeLabels(values);

    // current sort value not in counting Fields.
    if (!values.includes(this.state.sort)) {
      this.changeSort("");
    }
  };

  changeSort = value => {
    const { onChangeSort } = this.props;
    onChangeSort(value);

    this.setState({
      sort: value
    });
  };

  closeSort = () => {
    this.changeSort();

    this.setState({
      sort: ""
    });
  };

  render() {
    const { listType, sort } = this.state;
    const {
      typeChart,
      chartData,
      dataKeysChart,
      refreshChart,
      listGroup
    } = this.props;

    const showSortIcon = <img className={ss(c["sort-icon"])} src={sortIcon} />;
    const showCloseIcon = (
      <img
        className={ss(c["sort-icon"])}
        onClick={() => this.closeSort()}
        src={closeIcon}
      />
    );

    return (
      <div className={ss(c["area"])}>
        <div className={ss(c["header-chartarea"])}>
          <HorizontalForm noneBackground={true}>
            <RadioGroup
              format={"horizontal"}
              onChange={this.onChangeLabels}
              listGroup={listGroup}
              className={ss(c["button"])}
            />

            <div className={ss(c["sort-button"])} align={"right"}>
              <span className={ss(c["button__title"])}>Sort by</span>&nbsp;
              <DropdownButon
                items={listType}
                onCommand={this.changeSort}
                options={{ trigger: "click" }}
              >
                <span className={ss("el-dropdown-link", c["cursor-pointer"])}>
                  {sort}&nbsp;
                  {sort == "" ? showSortIcon : showCloseIcon}
                </span>
              </DropdownButon>
            </div>
          </HorizontalForm>
        </div>
        {typeChart == "Line Chart" ? (
          <LineChartComponent
            width={800}
            height={500}
            data={chartData}
            colors={{
              Registrations: "#6C5B7C",
              Clicks: "#6C5B7C",
              Deletions: "#C5798E"
            }}
            refresh={refreshChart}
            dataKeysChart={dataKeysChart}
          />
        ) : (
          ""
        )}
        {typeChart == "Bar Chart" ? (
          <BarChartComponent
            width={800}
            height={500}
            colors={{
              Registrations: "#6C5B7C",
              Clicks: "#6C5B7C",
              Deletions: "#C5798E"
            }}
            data={chartData}
            refresh={refreshChart}
            dataKeysChart={dataKeysChart}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
