import React, { useState, useEffect } from "react";
import { css } from "@emotion/core";

interface InputProps {
  lable?: string;
  labelColor?: string;
  error?: string;
  errorColor?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: string) => void;
  showError?: () => {};
  className?: string;
  height?: number;
  border?: string;
  focusStyle?: boolean;
  padding?: string;
  type?: string;
  color?: string;
  background?: string;
  value?: string;
  isValid?: boolean;
}

const inputfield = ({
  error,
  disabled,
  height,
  border,
  focusStyle,
  padding,
  color,
  background,
  isValid
}: {
  error: string;
  disabled: boolean;
  height: number;
  border: string;
  focusStyle: boolean;
  padding: string;
  color: string;
  background: string;
  isValid: boolean;
}) => {
  let borderStyle;
  let backgroundColor;
  let focusBorder;
  if (isValid) {
    focusBorder = "#789ca8";
  } else {
    focusBorder = "#DE350B";
  }
  if (border) {
    borderStyle = border;
  } else if (!border && error) {
    borderStyle = "1px solid #DE350B";
  } else if (!border && !error) {
    borderStyle = "1px solid #E8E6E2";
  }
  if (background) {
    backgroundColor = background;
  } else if (!background && disabled) {
    backgroundColor = "#f6f5f4";
  } else if (!background && !disabled) {
    backgroundColor = "#ffffff";
  }
  return css`
    width: 100%;
    border: ${borderStyle};
    height: ${height}px;
    font-family: Gotham;
    font-size: 15px;
    color: ${color};
    padding: ${padding};
    display: block;
    box-sizing: border-box;
    background-color: ${backgroundColor};
    cursor: ${disabled ? "not-allowed" : "text"};
    ::placeholder {
        color: #ccc9c9;
    }
    :focus {
        ${focusStyle && "outline-style: none;"}
        ${focusStyle && "box-shadow: none;"}
        ${focusStyle && "border-color: transparent;"}
        ${focusStyle && `border: solid 1px ${focusBorder};`}
    }
    
`;
};
const inputlable = ({ labelColor }: { labelColor: string }) => css`
  font-family: Gotham;
  font-size: 11px;
  color: ${labelColor};
  text-transform: uppercase;
  display: inline-flex;
  span {
    color: #ee5151;
    font-family: Gotham;
    font-size: 11px;
    font-weight: 750;
    padding-left: 6px;
  }
`;
const errorText = ({ errorColor }: { errorColor: string }) => css`
  color: ${errorColor};
  font-size: 13px;
  font-family: inherit;
  margin-top: 3px;
  height: 0;
`;
function Input(props: InputProps): JSX.Element {
  const {
    lable,
    labelColor = "#1E5A6E",
    required,
    placeholder = "",
    disabled = false,
    error = "",
    errorColor = "#DE350B",
    onChange = () => {},
    showError = () => {},
    border = "",
    className = "",
    height = 50,
    focusStyle = true,
    padding = "0 1em",
    type = "text",
    color = "#000000",
    background = "",
    value = "",
    isValid = true
  } = props;
  const [val, setVal] = useState(value);
  useEffect(() => {
    if (val) {
      setVal(val);
    }
  }, [val]);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const inputChange = (text: string) => {
    setVal(text);
    onChange(text);
    setTimeout(showError, 500);
  };

  const onBlur = () => {
    showError();
  };

  return (
    <div>
      {lable ? (
        <div css={inputlable({ labelColor })}>
          {lable}
          {required ? <span>*</span> : null}
        </div>
      ) : null}
      <input
        css={inputfield({
          error,
          height,
          border,
          disabled,
          focusStyle,
          padding,
          color,
          background,
          isValid
        })}
        onChange={e => inputChange(e.target.value)}
        onBlur={() => onBlur()}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        required={required}
        className={className}
        value={val}
      />
      {error && <p css={errorText({ errorColor })}>{error}</p>}
    </div>
  );
}

export default Input;
