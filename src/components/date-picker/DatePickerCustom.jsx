import React from "react";
import PropTypes from "prop-types";
import ss from "classnames";

import { DatePicker } from "element-react";

import c from "./datepicker-custom.comp.scss";

class DatePickerCustom extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    handleOnchange: PropTypes.func,
    isShowTime: PropTypes.bool,
    styles: PropTypes.string,
    format: PropTypes,
    disabledDate: PropTypes.func
  };

  static defaultProps = {
    value: "",
    handleOnchange: () => {},
    isShowTime: false,
    styles: "",
    format: "dd/MM/yyyy",
    disabledDate: time => time.getTime() > Date.now()
  };

  constructor(props) {
    super(props);
    this.state = {
      dateValue: this.props.value
    };
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.value !== this.state.dateValue) {
      this.setState({
        dateValue: nextProps.value
      });
    }
  };

  handleOnchange = date => {
    this.setState({
      dateValue: date
    });

    setTimeout(() => {
      this.props.handleOnchange(date);
    }, 20);
  };

  render() {
    const { isShowTime, styles, format, disabledDate } = this.props;
    let className;
    switch (styles) {
      case "original": {
        className = "";
        break;
      }
      default: {
        className = ss(c.container);
      }
    }

    return (
      <DatePicker
        className={className}
        value={this.state.dateValue}
        isShowTrigger={false}
        isShowTime={isShowTime}
        format={format}
        onChange={date => this.handleOnchange(date)}
        disabledDate={disabledDate}
      />
    );
  }
}

export default DatePickerCustom;
