import React from "react";
import PropTypes from "prop-types";
import { getTranslate } from "react-localize-redux";
import { connect } from "react-redux";

import { Dropdown } from "element-react";

import icCalendar from "../assets/icons/ic-calendar.svg";

class DateRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayingLable: this.props.translate("daterange"),
      isUppercase: true
    };
  }
  handleItemClick = item => {
    const {
      last7DaysAction,
      last30DaysAction,
      customDatesAction,
      nonAction,
      translate
    } = this.props;
    if (item === "last7Days") {
      if (last7DaysAction) {
        this.setState({
          displayingLable: translate("last7days"),
          isUppercase: false
        });
        last7DaysAction();
      }
    } else if (item === "last30Days") {
      if (last30DaysAction) {
        this.setState({
          displayingLable: translate("last30days"),
          isUppercase: false
        });
        last30DaysAction();
      }
    } else if (item === "none") {
      if (nonAction) {
        this.setState({
          displayingLable: translate("daterange"),
          isUppercase: true
        });
        nonAction();
      }
    } else {
      if (customDatesAction) {
        this.setState({
          displayingLable: translate("daterange"),
          isUppercase: true
        });
        customDatesAction();
      }
    }
  };
  render() {
    const { translate } = this.props;
    return (
      <Dropdown
        onCommand={this.handleItemClick}
        trigger="click"
        menu={
          <Dropdown.Menu>
            <Dropdown.Item command="none">{translate("none")}</Dropdown.Item>
            <Dropdown.Item command="last7Days" divided>
              {translate("last7days")}
            </Dropdown.Item>
            <Dropdown.Item command="last30Days" divided>
              {translate("last30days")}
            </Dropdown.Item>
            <Dropdown.Item command="customDates" divided>
              {translate("customdates")}
            </Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <div>
          <span
            style={
              this.state.isUppercase
                ? { textTransform: "uppercase" }
                : { textTransform: "none" }
            }
          >
            {this.state.displayingLable}
          </span>
          <img src={icCalendar} />
        </div>
      </Dropdown>
    );
  }
}

DateRange.propTypes = {
  last7DaysAction: PropTypes.func,
  last30DaysAction: PropTypes.func,
  customDatesAction: PropTypes.func,
  nonAction: PropTypes.func,
  translate: PropTypes.func
};

export default connect(
  state => ({ translate: getTranslate(state.locale) }),
  () => ({})
)(DateRange);
