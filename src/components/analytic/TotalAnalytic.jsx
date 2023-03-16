import React from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { getTranslate } from "react-localize-redux";
// import { bindActionCreators } from "redux";

export default class TotalAnalytic extends React.Component {
  static propTypes = {
    refresh: PropTypes.bool,
    translate: PropTypes.func,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.number
      })
    )
  };
  state = {
    data: [],
    refresh: false
  };

  componentDidMount() {
    this.refreshChart(this.props || {});
  }

  componentWillReceiveProps(props) {
    const { refresh } = props;
    if (this.state.refresh !== refresh) {
      this.refreshChart(props || {});
    }
  }

  numberWithCommas = x => {
    if (!x) {
      return "0";
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  refreshChart = res =>
    this.setState({
      data: res.data || []
    });

  render() {
    const { data } = this.state || [];
    let { translate } = this.props;
    if (!translate) {
      translate = value => {
        return value;
      };
    }
    return (
      <div>
        {data.map(item => (
          <div className="list__item list__item--large" key={item.label}>
            <div className="sub-title u-margin-bottom--10">
              {translate(item.label)}
            </div>
            <div className="analytic-figure u-color--dark-blue">
              {this.numberWithCommas(item.value)}
            </div>
          </div>
        ))}
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
// )(TotalAnalytic);
