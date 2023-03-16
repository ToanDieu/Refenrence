/* eslint-disable react/no-multi-comp */
import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import format from "date-fns/format";
import subDays from "date-fns/sub_days";
import { getTranslate } from "react-localize-redux";
import { Button } from "tse-storybook";
import { pathOr } from "ramda";
import { checkField } from "../actions/utils";
import {
  AreaChartComponent,
  TotalAnalyticComponent,
  BarChartClassComponent,
  PieChartComponent,
  StackedBarChartComponent
} from "../components/Analytic";
import { ProtectedScopedComponent } from "../components/HocComponent";
import configs from "../constants/orgConfigs.js";
import {
  fetchListField,
  fetchColSum,
  fetchPassScanRatioAnalytic,
  fetchPassAnalytic,
  fetchPassTotalAnalytic,
  fetchRantingRpByLine
} from "../actions/analytic";
import config from "../appConfig";

class AnalyticPage extends React.Component {
  state = {
    fromTime: format(subDays(new Date(), 7), "YYYY-MM-DD"),
    toTime: format(new Date(), "YYYY-MM-DD"),
    refreshChart: false,
    refreshTotal: false,
    constructor: true,
    protectedAnalyticTitle: false,
    protectedByFieldTitle: false
  };

  componentDidMount() {
    this.preProcessTotal();
    this.setState({
      protectedAnalyticTitle: this.refs.protectedAnalyticTitle.isValidScope(),
      protectedByFieldTitle: this.refs.protectedByFieldTitle.isValidScope()
    });
  }

  preProcessTotal = () => {
    let querystring = "";
    const org = this.props.getOrgName;
    const fields = configs[org].display.Analytic.extendTotal;
    for (let i = 0; i < fields.length; i++) {
      querystring = `${querystring}field=${fields[i].column}&format=${
        fields[i].format
      }&`;
    }
    const fromTime = this.fromtime.value || this.state.fromTime || "";
    const toTime = this.totime.value || this.state.toTime || "";
    this.props
      .fetchPassTotalAnalytic({
        baseID: this.props.currentBaseID,
        fromTime,
        toTime,
        querystring
      })
      .then(this.refreshTotal);
  };

  refreshTotal = res => {
    this.setState({
      passAnalytic: res.payload || {},
      refreshTotal: !this.state.refreshTotal
    });
  };

  submitNewTime = e => {
    e.preventDefault();
    if (
      this.fromtime.value != this.state.fromTime ||
      this.totime.value != this.state.toTime ||
      this.state.constructor
    ) {
      const fromTime = this.fromtime.value || this.state.fromTime || "";
      const toTime = this.totime.value || this.state.toTime || "";
      this.props
        .fetchPassAnalytic({
          baseID: this.props.currentBaseID,
          fromTime,
          toTime
        })
        .then(this.refreshChart);
    }
  };

  refreshChart = res => {
    if (checkField(res, ["payload", "usageDatas"])) {
      this.setState({
        refreshChart: !this.state.refreshChart,
        toTime: this.totime.value,
        fromTime: this.fromtime.value,
        usageData: res.payload.usageDatas || {},
        constructor: false
      });
    }
    this.preProcessTotal();
  };

  render() {
    const { translate } = this.props;
    const tempProtectedTitles = [
      this.state.protectedAnalyticTitle,
      this.state.protectedByFieldTitle
    ];
    const protectedTitlesFiltered = tempProtectedTitles.filter(
      element => element !== false
    );
    let protectedTitlesResult;
    switch (protectedTitlesFiltered.length) {
      case 1:
        protectedTitlesResult = (
          <h1 className="page-title u-margin-bottom--22">Analytic</h1>
        );
        break;
      case 2:
        protectedTitlesResult = (
          <h1 className="page-title u-margin-bottom--22">
            <div>
              <Link
                className={
                  location.pathname === "/analytic" ? "active-part" : ""
                }
                to="/analytic"
              >
                {translate("analytic")}
              </Link>
              <Link
                to="/analytic/byfield"
                className={
                  location.pathname === "/analytic/byfield"
                    ? "u-margin-left--40 active-part"
                    : "u-margin-left--40"
                }
              >
                {translate("byfield")}
              </Link>
            </div>
          </h1>
        );
        break;
      default:
        break;
    }

    const {
      refreshChart,
      refreshTotal,
      passAnalytic,
      fromTime,
      toTime,
      usageData
    } = this.state;
    // const textMessageEngagementTime = 0;
    // const passRegisteredCompletionTime = 0;
    // const ratingFormResponseTime = 0;

    return (
      <div className="home">
        <div className="home__content">
          <div className="container-xl">
            {protectedTitlesResult || null}
            <ProtectedScopedComponent
              ref="protectedAnalyticTitle"
              scopes={[
                "get:my-org-type-base:analytic",
                "get:my-org-type-base:analytic-case"
              ]}
            >
              <div />
            </ProtectedScopedComponent>
            <ProtectedScopedComponent
              ref="protectedByFieldTitle"
              scopes={["get:my-org-type-base:analyticbyfield"]}
            >
              <div />
            </ProtectedScopedComponent>
            <div className="default-grid">
              <TotalAnalyticComponent
                refresh={refreshTotal}
                passAnalytic={passAnalytic}
              />
              <div className="default-grid__right">
                {/* <div className="list-horizontal u-margin-bottom--20">
                  <div className="list-horizontal__item">
                    <div className="boxed-title">
                      Text Message Engagement Time
                    </div>
                    <div className="analytic-figure-time">
                      {textMessageEngagementTime} <span>mins</span>
                    </div>
                  </div>
                  <div className="list-horizontal__item">
                    <div className="boxed-title">
                      Pass Registered Completion Time
                    </div>
                    <div className="analytic-figure-time">
                      {passRegisteredCompletionTime} <span>mins</span>
                    </div>
                  </div>
                  <div className="list-horizontal__item">
                    <div className="boxed-title">Rating Form Response Time</div>
                    <div className="analytic-figure-time">
                      <div>
                        {ratingFormResponseTime} <span>mins</span>
                      </div>
                    </div>
                  </div>
                </div> */}
                <form onSubmit={this.submitNewTime}>
                  <div className="list-horizontal u-margin-bottom--20">
                    <div className="list-horizontal__item">
                      <div className="boxed-title">{translate("from")}</div>
                      <div className="analytic-input">
                        <input
                          id="time"
                          type="date"
                          defaultValue={
                            this.state.fromTime
                              ? this.state.fromTime
                              : format(subDays(new Date(), 7), "YYYY-MM-DD")
                          }
                          ref={input => (this.fromtime = input)}
                        />
                      </div>
                    </div>
                    <div className="list-horizontal__item">
                      <div className="boxed-title">{translate("to")}</div>
                      <div className="analytic-input">
                        <input
                          id="time"
                          type="date"
                          defaultValue={
                            this.state.toTime
                              ? this.state.toTime
                              : format(new Date(), "YYYY-MM-DD")
                          }
                          ref={input => (this.totime = input)}
                        />
                      </div>
                    </div>
                    <div className="list-horizontal__item">
                      <Button
                        className="analytic-input "
                        label={translate("show")}
                      />
                    </div>
                  </div>
                </form>
                <div className="card-graph">
                  <div className="card-graph__title">
                    <span>{translate("passActivity")}</span>
                    <span className="card-graph__title__tooltip">
                      <div className="red-rectangle" />
                      <span className="u-margin-right--24">
                        {translate("Invalidated Pass")}
                      </span>
                      <div className="green-rectangle" />
                      <span className="u-margin-right--24">
                        {translate("Previewed Pass")}
                      </span>
                      <div className="blue-rectangle" />
                      <span>{translate("Added Pass")}&nbsp;</span>
                      <div className="black-rectangle" />
                      <span className="u-margin-right--24">
                        {translate("Unsubscribed Pass")}
                      </span>
                    </span>
                  </div>
                  <AreaChartComponent
                    refresh={refreshChart}
                    fromTime={fromTime}
                    toTime={toTime}
                    usageData={usageData}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AnalyticPage.propTypes = {
  currentBaseID: PropTypes.number,
  toggleCaseForm: PropTypes.func,
  fetchPassAnalytic: PropTypes.func,
  fetchPassTotalAnalytic: PropTypes.func,
  submitNewTime: PropTypes.func,
  fromTime: PropTypes.object,
  toTime: PropTypes.object,
  refreshChart: PropTypes.bool,
  translate: PropTypes.func,
  getOrgName: PropTypes.string
};

class AnalyticPassScanRatioPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      constructor: true,
      fromTime: format(subDays(new Date(), 7), "YYYY-MM-DD"),
      toTime: format(new Date(), "YYYY-MM-DD"),
      listField: [],
      selectField: "",
      selectValue: "",
      changeField: false,
      extraparam: "",
      refreshChart: false,
      refreshStackedBarChart: false,
      refreshTotal: false,
      typeChart: "bar"
    };
    this.updateField = this.updateField.bind(this);
  }

  componentDidMount() {
    this.props
      .fetchListField({
        baseID: this.props.currentBaseID,
        fromTime: format(new Date(2017, 7, 1), "YYYY-MM-DD"),
        toTime: format(new Date(), "YYYY-MM-DD")
      })
      .then(this.refreshListField);
    this.preProcessTotal();
  }

  preProcessTotal = () => {
    let querystring = "";
    const org = this.props.getOrgName;
    const fields = configs[org].display.Analytic.extendTotal;
    for (let i = 0; i < fields.length; i++) {
      querystring = `${querystring}field=${fields[i].column}&format=${
        fields[i].format
      }&`;
    }
    const fromTime = this.fromtime.value || this.state.fromTime || "";
    const toTime = this.totime.value || this.state.toTime || "";
    this.props
      .fetchPassTotalAnalytic({
        baseID: this.props.currentBaseID,
        fromTime,
        toTime,
        querystring
      })
      .then(this.refreshTotal);
  };

  refreshTotal = res => {
    this.setState({
      passAnalytic: res.payload || {},
      refreshTotal: !this.state.refreshTotal
    });
  };

  refreshListField = res => {
    const payloadListField = res.payload.fields || [];
    const listField = [];
    const org = this.props.getOrgName;
    if (checkField(configs, [org, "display", "Analytic", "extendField"])) {
      const extendFields = configs[org].display.Analytic.extendField;
      const keys = Object.keys(extendFields);
      keys.forEach(function(key) {
        listField.push({
          label: extendFields[key].label,
          value: key
        });
      });
    }
    if (checkField(configs, [org, "display", "Analytic", "extra_params"])) {
      const extraParams = configs[org].display.Analytic.extra_params;
      extraParams.map(label => {
        if (
          payloadListField.find(function(element) {
            return element.label == label;
          })
        ) {
          listField.push({
            label,
            value: label
          });
        }
      });
    }
    console.log("selectField", listField);
    this.setState({
      listField,
      selectField: listField[0].value || ""
    });
  };

  updateField(event) {
    this.setState({
      selectField: event.target.value || "",
      changeField: true
    });
  }

  submitFilter = e => {
    e.preventDefault();
    if (
      this.fromtime.value != this.state.fromTime ||
      this.totime.value != this.state.toTime ||
      this.state.constructor ||
      this.state.changeField
    ) {
      const org = this.props.getOrgName;
      const fromTime = this.fromtime.value || this.state.fromTime || "";
      const toTime = this.totime.value || this.state.toTime || "";
      console.log("vuanh:", this.state.selectField);
      if (
        checkField(configs, [
          org,
          "display",
          "Analytic",
          "extendField",
          this.state.selectField
        ]) &&
        configs[org].display.Analytic.extendField[this.state.selectField]
          .typeChart == "pie"
      ) {
        if (this.state.selectField == "star") {
          this.props
            .fetchRantingRpByLine({
              baseID: this.props.currentBaseID,
              fromTime,
              toTime
            })
            .then(res => {
              const usageData = res.data.usageData.map(line => {
                const keys = Object.keys(line);
                const newline = {};

                if (
                  pathOr(false, [org, "numberQuestionMap", line.name], configs)
                ) {
                  // map origin field to new field config by org
                  keys.map(name => {
                    // map origin name to display name cofig by org
                    if (name.toUpperCase() == "NAME") {
                      let numQues = "";
                      numQues = pathOr(
                        null,
                        [org, "numberQuestionMap", line.name],
                        configs
                      );

                      if (numQues) {
                        newline[name] = `Q ${numQues}`;
                      }

                      return;
                    }

                    // map origin name value to display name value cofig by org
                    if (name >= 1 && name <= 5) {
                      newline[
                        `${name} ${
                          configs[org].display.Analytic.extendField[
                            this.state.selectField
                          ].label
                        }` || ""
                      ] = line[name];
                    } else {
                      newline[name] = line[name];
                    }
                  });
                  return newline;
                }
              });
              this.setState({
                refreshStackedBarChart: !this.state.refreshStackedBarChart,
                usageDataStackedBar: usageData || []
              });
            });
        }

        this.props
          .fetchColSum({
            baseID: this.props.currentBaseID,
            fromTime,
            toTime,
            col:
              configs[org].display.Analytic.extendField[this.state.selectField]
                .column,
            format:
              configs[org].display.Analytic.extendField[this.state.selectField]
                .format
          })
          .then(this.refreshPieChart);
      } else {
        const fromTime = this.fromtime.value || this.state.fromTime || "";
        const toTime = this.totime.value || this.state.toTime || "";
        this.props
          .fetchPassScanRatioAnalytic({
            baseID: this.props.currentBaseID,
            extraparam:
              this.state.selectField || this.state.listField[0].value || "",
            value: "",
            fromTime,
            toTime
          })
          .then(this.refreshBarChart);
      }
    }
  };

  refreshPieChart = res => {
    const fromTime = this.fromtime.value || this.state.fromTime || "";
    const toTime = this.totime.value || this.state.toTime || "";
    this.setState({
      toTime,
      fromTime,
      constructor: false,
      changeField: false,
      refreshChart: !this.state.refreshChart,
      usageData: res.payload.usageData || [],
      typeChart: "pie",
      refreshTotal: !this.state.refreshTotal
    });
    this.preProcessTotal();
  };

  refreshBarChart = res => {
    const fromTime = this.fromtime.value || this.state.fromTime || "";
    const toTime = this.totime.value || this.state.toTime || "";
    this.setState({
      toTime,
      fromTime,
      extraparam: this.state.selectField || this.state.listField[0].value || "",
      constructor: false,
      changeField: false,
      refreshChart: !this.state.refreshChart,
      usageData: res.payload.usageData || [],
      typeChart: "bar",
      refreshTotal: !this.state.refreshTotal
    });
    this.preProcessTotal();
  };

  openNewTabWhenClick = (data, index) => {
    console.log("data, index", data, index);
    window.open(
      `${config.TSE_SERVE_DOMAIN}/feedback?index=${index}&start=${
        this.state.fromTime
      }&end=${this.state.toTime}`,
      "_blank"
    );
  };

  render() {
    const { translate } = this.props;

    let title;
    title = (
      <div className="card-graph__title">
        <span>{translate(`analyticBy${this.state.selectField}`)}</span>
      </div>
    );

    const {
      refreshChart,
      passAnalytic,
      usageData,
      typeChart,
      refreshTotal,
      usageDataStackedBar,
      refreshStackedBarChart,
      selectField
    } = this.state;

    return (
      <div className="container-xl u-padding-top--47">
        <h1 className="page-title u-margin-bottom--22">
          <div>
            <Link
              className={location.pathname === "/analytic" ? "active-part" : ""}
              to="/analytic"
            >
              {translate("analytic")}
            </Link>
            <Link
              to="/analytic/byfield"
              className={
                location.pathname === "/analytic/byfield"
                  ? "u-margin-left--40 active-part"
                  : "u-margin-left--40"
              }
            >
              {translate("byfield")}
            </Link>
          </div>
        </h1>

        <div>
          <div className="default-grid">
            <TotalAnalyticComponent
              refresh={refreshTotal}
              passAnalytic={passAnalytic}
            />
            <div className="default-grid__right">
              <form onSubmit={this.submitFilter}>
                <div className="list-horizontal u-margin-bottom--20">
                  <div className="list-horizontal__item">
                    <div className="boxed-title">{translate("from")}</div>
                    <div className="analytic-input">
                      <input
                        id="time"
                        type="date"
                        defaultValue={
                          this.state.fromTime
                            ? this.state.fromTime
                            : format(subDays(new Date(), 7), "YYYY-MM-DD")
                        }
                        ref={input => (this.fromtime = input)}
                      />
                    </div>
                  </div>
                  <div className="list-horizontal__item">
                    <div className="boxed-title">{translate("to")}</div>
                    <div className="analytic-input">
                      <input
                        id="time"
                        type="date"
                        defaultValue={
                          this.state.toTime
                            ? this.state.toTime
                            : format(new Date(), "YYYY-MM-DD")
                        }
                        ref={input => (this.totime = input)}
                      />
                    </div>
                  </div>
                  <div className="list-horizontal__item">
                    <div className="boxed-small-title">{translate("Field")}</div>
                    <div className="select-form">
                      <select
                        value={this.state.selectField}
                        onChange={this.updateField}
                      >
                        <option value="no-value" disabled>
                          Please select
                        </option>
                        {Array.from(this.state.listField || [], fielddata => {
                          return (
                            <option
                              key={fielddata.value}
                              value={fielddata.value}
                            >
                              {translate(fielddata.label)}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="boxed-small-button ">
                      <button>
                        <b>{translate("show")}</b>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              {typeChart == "bar" ? (
                <div className="card-graph">
                  {title}
                  <BarChartClassComponent
                    refresh={refreshChart}
                    usageData={usageData}
                  />
                </div>
              ) : (
                <div className="card-graph">
                  {title}
                  <PieChartComponent
                    refresh={refreshChart}
                    usageData={usageData}
                  />
                  {selectField == "star" ? (
                    <StackedBarChartComponent
                      refresh={refreshStackedBarChart}
                      usageData={usageDataStackedBar}
                      selectField={selectField}
                      percent
                      handleClick={this.openNewTabWhenClick}
                    />
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AnalyticPassScanRatioPage.propTypes = {
  fetchListField: PropTypes.func,
  fetchColSum: PropTypes.func,
  fetchPassScanRatioAnalytic: PropTypes.func,
  fetchPassTotalAnalytic: PropTypes.func,
  location: PropTypes.object,
  listField: PropTypes.array,
  fromTime: PropTypes.object,
  toTime: PropTypes.object,
  currentBaseID: PropTypes.number,
  selectValue: PropTypes.string,
  selectField: PropTypes.string,
  changeField: PropTypes.bool,
  refreshChart: PropTypes.bool,
  refreshTotal: PropTypes.bool,
  typeChart: PropTypes.string,
  translate: PropTypes.func,
  fetchRantingRpByLine: PropTypes.func,
  getOrgName: PropTypes.string
};

const mapState = state => ({
  currentBaseID: state.pageDetail.current.detail.id
    ? state.pageDetail.current.detail.id
    : state.baseList.data[0].id,
  passAnalytic: state.passAnalytic || {},
  passScanRatio: state.passScanRatio || {},
  colAnalytic: state.colAnalytic || {},
  translate: getTranslate(state.locale),
  getOrgName: state.getOrgName.data
});

const mapDispatch = dispatch => {
  return {
    fetchListField: bindActionCreators(fetchListField, dispatch),
    fetchColSum: bindActionCreators(fetchColSum, dispatch),
    fetchPassScanRatioAnalytic: bindActionCreators(
      fetchPassScanRatioAnalytic,
      dispatch
    ),
    fetchPassAnalytic: bindActionCreators(fetchPassAnalytic, dispatch),
    fetchPassTotalAnalytic: bindActionCreators(
      fetchPassTotalAnalytic,
      dispatch
    ),
    fetchRantingRpByLine: bindActionCreators(fetchRantingRpByLine, dispatch)
  };
};

const mySpecialContainerCreator = connect(
  mapState,
  mapDispatch
);
export const AnalyticPageComponent = mySpecialContainerCreator(AnalyticPage);
export const AnalyticPassScanRatioPageComponent = mySpecialContainerCreator(
  AnalyticPassScanRatioPage
);
