import React from "react";
import PropTypes from "prop-types";
import { LineChartComponent, BarChartComponent } from "../charts";
import {
  // TotalAnalytic,
  SubmitForm
} from "./index";
import Filters from "./general-analytic/analytic-filters";
// import { connect } from "react-redux";
// import { getTranslate } from "react-localize-redux";
// import { bindActionCreators } from "redux";

export default class AnalyticPage extends React.Component {
  static propTypes = {
    currentBaseID: PropTypes.number,
    translate: PropTypes.func
  };

  state = {
    refreshChart: false,
    refreshTotal: false,
    timeFrequency: "daily"
  };

  onSubmit = values => {
    console.log("submit NewTime", values);
  };

  render() {
    const {
      // refreshTotal,
      refreshChart
    } = this.state;
    // const dataTotal = [
    //   {
    //     label: "CREATED CASE",
    //     value: 120
    //   },
    //   {
    //     label: "PREVIEWED PASS",
    //     value: 100
    //   },
    //   {
    //     label: "ADDED PASS",
    //     value: 90
    //   },
    //   {
    //     label: "UNSUBSCRIBED PASS",
    //     value: 20
    //   }
    // ];
    const dataChart = [
      { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
      { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
      { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
      { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
      { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
      { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
      { name: "Page G", uv: 3490, pv: 4300, amt: 2100 }
    ];

    return (
      <div className="home">
        <div className="home__content">
          <div className="container-xl">
            <div className="default-grid">
              <div className="default-grid__left">
                {/* <TotalAnalytic data={dataTotal} refresh={refreshTotal} /> */}
                <Filters
                  onBaseChange={baseIds => console.log(baseIds)}
                  onTagChange={tagIds => console.log(tagIds)}
                  onBaseAllEnable={() => console.log("show all bases")}
                  onTagAllEnable={() => console.log("show all tags")}
                />
              </div>
              <div className="default-grid__right">
                <SubmitForm onSubmit={this.onSubmit} />
                <div className="card-graph">
                  <div className="card-graph__title">
                    <span>Analytic</span>
                  </div>
                  <LineChartComponent
                    data={dataChart}
                    refresh={refreshChart}
                    label="Test LineChart"
                  />
                  <BarChartComponent
                    data={dataChart}
                    refresh={refreshChart}
                    label="Test LineChart"
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

// const mapState = state => ({
//   translate: getTranslate(state.locale)
// });

// const mapDispatch = dispatch => bindActionCreators(dispatch);

// export default connect(
//   mapState,
//   mapDispatch
// )(AnalyticPage);
