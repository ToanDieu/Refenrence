import React from "react";
import PropTypes from "prop-types";
import FieldItem from "./FieldItem";

let SingleField = ({
  type,
  name,
  label,
  placeholder,
  onChange,
  onBlur,
  value,
  inputRef,
  isModified,
  hasErrors,
  disabled,
  tooltip,
  lengthIndication
}) => (
  <div className="field">
    <FieldItem
      disabled={disabled}
      inputRef={inputRef}
      label={label}
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      isModified={isModified}
      hasErrors={hasErrors}
      tooltip={tooltip}
      lengthIndication={lengthIndication}
    />
  </div>
);

SingleField.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  inputRef: PropTypes.func,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.string,
  isModified: PropTypes.object,
  disabled: PropTypes.bool,
  hasErrors: PropTypes.object,
  tooltip: PropTypes.node,
  lengthIndication: PropTypes.number
};

export default SingleField;
