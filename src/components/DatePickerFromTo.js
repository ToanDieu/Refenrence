import React from "react";
import PropTypes from "prop-types";

import DatePickerCustom from "./date-picker/DatePickerCustom";

import icClose from "../assets/icons/ic-close.svg";

class DatePickerFromTo extends React.Component {
  constructor(props) {
    super(props);
  }

  getDate = target => date => {
    this.props.handleOnchange({
      component: target,
      value: date
    });
  };

  render() {
    const { dateFrom, dateTo, iconClick } = this.props;
    return (
      <div>
        <span>From</span>
        <DatePickerCustom
          value={dateFrom ? new Date(dateFrom) : new Date()}
          handleOnchange={this.getDate("from")}
        />
        <span>To</span>
        <DatePickerCustom
          value={dateTo ? new Date(dateTo) : new Date()}
          handleOnchange={this.getDate("to")}
        />
        <img src={icClose} className="u-margin-left--0" onClick={iconClick} />
      </div>
    );
  }
}

DatePickerFromTo.propTypes = {
  dateFrom: PropTypes.string,
  dateTo: PropTypes.string,
  iconClick: PropTypes.func,
  handleOnchange: PropTypes.func
};

export default DatePickerFromTo;
