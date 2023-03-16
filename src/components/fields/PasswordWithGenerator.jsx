import React from "react";
import PropTypes from "prop-types";
import ss from "classnames";
import c from "./field.comp.scss";

export default class PasswordWithGenerator extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    handleGeneratePass: PropTypes.func,
    password: PropTypes.string,
    disabled: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      passwordShow: false,
      pwGeneratorShow: false
    };
  }

  pwGeneratorToggle = () => {
    this.setState({
      pwGeneratorShow: !this.state.pwGeneratorShow
    });
  };

  showPassword = () => {
    this.setState({
      passwordshow: !this.state.passwordshow
    });
  };

  render() {
    const { label, error, handleGeneratePass, password, disabled } = this.props;
    return (
      <div className={ss(c["pw-wrapper"])}>
        <div className={ss(c["label"], c["label--adjust"])}>
          {label}
          <p onClick={this.pwGeneratorToggle}>password generator</p>
        </div>
        <div
          style={{
            display: this.state.pwGeneratorShow ? "block" : "none"
          }}
          className={ss(c["pw-generate"])}
        >
          <label>Length:</label>
          <input
            id="pwLengthToGenerate"
            type="number"
            placeholder="8"
            min="8"
            max="128"
            disabled={disabled}
          />
          <button onClick={() => handleGeneratePass()}>generate</button>
        </div>
        <div className={ss(c["input-button"])}>
          <input
            className={ss(
              c["input-button--password"],
              c["input--clear-browser-default"]
            )}
            style={{
              backgroundColor: disabled ? "#f6f5f4" : ""
            }}
            {...password}
            type={this.state.passwordShow ? "text" : "password"}
            disabled={disabled}
          />
          <button onClick={this.showPassword}>
            {this.state.passwordshow ? "hide" : "show"}
          </button>
        </div>
        {error && <p className={ss(c["error"])}>{error}</p>}
      </div>
    );
  }
}
