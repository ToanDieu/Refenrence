import React from "react";
import PropTypes from "prop-types";
import ss from "classnames";
import c from "./analytic.comp.scss";
import configs from "../../../constants/orgConfigs";
import { pathOr } from "ramda";
import Header from "./view/Header";
import MainContent from "./view/MainContent";
import FilterSiderBar from "./view/FilterSiderBar";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchGeneralAnalytic } from "./action/analytic";

const timeFrequencyOptions = ["Daily", "Weekly", "Monthly", "Yearly"];
@connect(
  store => ({
    bases: pathOr([], [], store),
    getOrgName: store.getOrgName.data
  }),
  dispatch =>
    bindActionCreators(
      {
        fetchGeneralAnalytic
      },
      dispatch
    )
)
export default class GeneralAnalytic extends React.Component {
  static propTypes = {
    currentBaseID: PropTypes.number,
    timeFrequency: PropTypes.string,
    translate: PropTypes.func,
    fetchGeneralAnalytic: PropTypes.func,
    getOrgName: PropTypes.string
  };

  state = {
    refreshChart: false,
    groupBySelected: "Daily",
    timeFrequency: "Daily",
    mainContent: {},
    filterSiderbar: {},
    header: "daily",
    chartData: [],
    listGroup: [
      {
        groupItems: ["Registrations", "Deletions"],
        maxSelected: 2,
        minSelected: 1,
        disabled: false
      },
      {
        groupItems: ["Clicks"],
        maxSelected: 1,
        minSelected: 1,
        disabled: false
      }
    ]
  };

  handleGroupBy = value => {
    if (timeFrequencyOptions.includes(value)) {
      this.setState({
        timeFrequency: value,
        groupBySelected: value
      });
    } else {
      this.setState({
        groupBySelected: value
      });
    }

    this.setState(state => {
      if (value.toLowerCase() == "link") {
        return {
          ...state,
          header: value.toLowerCase(),
          listGroup: [
            {
              groupItems: ["Registrations", "Deletions"],
              maxSelected: 2,
              minSelected: 1,
              disabled: true
            },
            {
              groupItems: ["Clicks"],
              maxSelected: 1,
              minSelected: 1,
              disabled: false
            }
          ]
        };
      }
      return {
        ...state,
        header: value.toLowerCase(),
        listGroup: [
          {
            groupItems: ["Registrations", "Deletions"],
            maxSelected: 2,
            minSelected: 1,
            disabled: false
          },
          {
            groupItems: ["Clicks"],
            maxSelected: 1,
            minSelected: 1,
            disabled: false
          }
        ]
      };
    }, this.updateChart);
  };

  onEnableAllFilter = kind => () => {
    let { filterSiderbar } = this.state;
    filterSiderbar[kind.toLowerCase()] = [];

    this.setState(state => {
      return {
        ...state,
        filterSiderbar: filterSiderbar
      };
    }, this.updateChart);
  };

  onChangeFilter = kind => values => {
    let { filterSiderbar } = this.state;
    filterSiderbar[kind.toLowerCase()] = values.map(value => {
      return value.key;
    });

    this.setState(state => {
      return {
        ...state,
        filterSiderbar: filterSiderbar
      };
    }, this.updateChart);
  };

  onChangeMainContent = values => {
    this.setState(state => {
      return {
        ...state,
        mainContent: values
      };
    }, this.updateChart);
  };

  preProcessData = data => {
    const { header } = this.state;
    let chartData = pathOr([], ["data"], data);
    // format Axis if it is date format
    const groupByTime = timeFrequencyOptions.map(item => {
      return item.toLowerCase();
    });
    if (!groupByTime.includes(header)) {
      chartData = pathOr([], ["data"], data).map(item => {
        let newLabel = item.label;
        newLabel = newLabel.replace("http://", "");
        newLabel = newLabel.replace("https://", "");

        let suffix = "";
        if (newLabel.length > 16) {
          suffix = "...";
        }
        item["labelX"] = newLabel.substring(0, 15) + suffix;
        return item;
      });
    }
    return chartData;
  };

  updateChart = () => {
    const { header, mainContent, filterSiderbar } = this.state;

    const countingFields = pathOr([], ["labelsAnalytic"], mainContent).map(
      item => {
        return item.toLowerCase().replace(" ", "");
      }
    );

    const payload = {
      fromDate: pathOr("", ["fromTime"], mainContent),
      toDate: pathOr("", ["toTime"], mainContent),
      countingFields: countingFields,
      orderBy: [pathOr("", ["sortLabels"], mainContent).toLowerCase()],
      groupBy: pathOr("", [], header),
      filters: pathOr([], [], filterSiderbar)
    };

    const getDateChart = this.props.fetchGeneralAnalytic;
    getDateChart(payload)
      .then(data => {
        let chartData = this.preProcessData(data);

        this.setState({
          chartData: chartData,
          refreshChart: !this.state.refreshChart
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    let {
      timeFrequency,
      groupBySelected,
      chartData,
      mainContent,
      refreshChart,
      listGroup
    } = this.state;
    const countingFields = pathOr([], ["labelsAnalytic"], mainContent);

    const groupByList = pathOr(
      [],
      [this.props.getOrgName, "display", "Analytic", "groupByList"],
      configs
    );

    return (
      <div className="home">
        <div className="home__content">
          <div className="container-xl">
            <div className={ss(c["container"])}>
              <div className={ss(c["header"])}>
                <Header
                  timeFrequencyOptions={timeFrequencyOptions}
                  timeFrequency={timeFrequency}
                  groupByList={groupByList}
                  groupBySelected={groupBySelected}
                  onChange={this.handleGroupBy}
                  dataChart={chartData}
                />
              </div>
              <div className={ss(c["left-column"])}>
                <FilterSiderBar
                  onBaseChange={this.onChangeFilter("base")}
                  onTagChange={this.onChangeFilter("tag")}
                  onBaseAllEnable={this.onEnableAllFilter("base")}
                  onTagAllEnable={this.onEnableAllFilter("tag")}
                />
              </div>
              <div className={ss(c["main-content"])}>
                <MainContent
                  onChange={this.onChangeMainContent}
                  chartData={chartData}
                  dataKeysChart={countingFields}
                  refreshChart={refreshChart}
                  listGroup={listGroup}
                />
              </div>
              <div className={ss(c["content"])} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
