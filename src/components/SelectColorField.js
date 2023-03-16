import React, { Component, Fragment } from "react";
import SingleFieldWithButton from "./SingleFieldWithButton";
import { SketchPicker } from "react-color";
import colorParse from "parse-color";
import editIcon from "../assets/icons/ic-circle-edit.svg";
import PropTypes from "prop-types";
import closeIcon from "@/assets/icons/ic-circle-close.svg";

class SelectColorField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPicker: false,
      inputValue: ""
    };
  }

  componentWillMount() {
    if (this.props.value) {
      this.setState({ inputValue: this.props.value });
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log("revProps: ", nextProps);
    if (nextProps.value !== this.props.value) {
      this.setState({ inputValue: nextProps.value });
    }
  }

  togglePicker = () => {
    if (!this.state.showPicker) {
      const currentColor = colorParse(this.props.value);
      this.setState({ currentColor });
    }
    this.setState({ showPicker: !this.state.showPicker });
  };

  onPickerValueChange = color => {
    const { r, g, b } = color.rgb;
    this.setState(
      {
        inputValue: `rgb(${r}, ${g}, ${b})`,
        currentColor: color
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
        {!this.props.disabled && this.state.showPicker && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%) translateY(-30%)"
            }}
          >
            <SketchPicker
              onChangeComplete={this.onPickerValueChange}
              color={this.state.currentColor.hex}
              disableAlpha={true}
            />
            <img
              src={closeIcon}
              onClick={this.togglePicker}
              style={{
                position: "absolute",
                right: "-10px",
                top: "-10px"
              }}
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

SelectColorField.propTypes = {
  onChange: PropTypes.func,
  icon: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool
};

export default SelectColorField;
