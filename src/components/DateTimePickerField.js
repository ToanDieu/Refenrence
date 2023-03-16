import React, { Component, Fragment } from "react";
import SingleFieldWithButton from "./SingleFieldWithButton";
import colorParse from "parse-color";
import DatePicker from "react-datepicker";
import editIcon from "../assets/icons/ic-circle-edit.svg";
import PropTypes from "prop-types";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

class DateTimePickerField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPicker: false,
      inputValue: moment().format("YYYY-MM-DDTHH:mm:00Z"),
      currentValue: moment()
    };
  }

  togglePicker = () => {
    if (!this.state.showPicker) {
      const currentValue = moment();
      this.setState({ currentValue });
    }
    this.setState({ showPicker: !this.state.showPicker });
  };

  onPickerValueChange = moment => {
    this.setState(
      {
        inputValue: moment.format("YYYY-MM-DDTHH:mm:00Z"),
        currentValue: moment
      },
      () => {
        var event = new Event("change", {
          bubbles: true,
          cancelable: true
        });
        this.inputElement.onchange = this.onChange;
        this.inputElement.dispatchEvent(event);
      }
    );
  };

  onChange = event => {
    this.props.onChange(event);
  };

  inputElement = undefined;

  inputRef = element => {
    this.inputElement = element;
  };

  render() {
    return (
      <Fragment>
        {this.state.showPicker && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%) translateY(-30%)"
            }}
          >
            <DatePicker
              inline={true}
              showTimeSelect={true}
              timeIntervals={5}
              selected={this.state.currentValue}
              onChange={this.onPickerValueChange}
            />
          </div>
        )}
        <SingleFieldWithButton
          {...this.props}
          buttonStyle={{
            backgroundColor: colorParse(this.props.value).hex
          }}
          inputRef={this.inputRef}
          onChange={this.onChange}
          value={this.state.inputValue}
          icon={editIcon}
          onClickButton={this.togglePicker}
        />
      </Fragment>
    );
  }
}

DateTimePickerField.propTypes = {
  onChange: PropTypes.func,
  icon: PropTypes.string,
  value: PropTypes.string
};

export default DateTimePickerField;
