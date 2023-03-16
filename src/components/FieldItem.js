import React, { Fragment } from "react";
import PropTypes from "prop-types";
import closeIcon from "../assets/icons/ic-circle-close.svg";
import Tooltip from "@/components/tooltip";

let FieldItem = ({
  type,
  name,
  label,
  placeholder,
  onChange,
  onBlur,
  onClose,
  value,
  inputRef,
  isModified,
  hasErrors,
  disabled,
  tooltip,
  lengthIndication
}) => (
  <Fragment>
    {label || onClose ? (
      <div
        className="field__label field__label--default"
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <span>{label}</span>

        {tooltip && <Tooltip content={tooltip} />}

        {onClose && (
          <img
            style={{ marginLeft: "6px", cursor: "pointer" }}
            src={closeIcon}
            onClick={disabled ? null : onClose}
          />
        )}
      </div>
    ) : null}
    <div className="field__item">
      {type == "textarea" ? (
        <textarea
          disabled={disabled}
          style={{
            padding: "1em",
            height: "5em"
          }}
          ref={inputRef}
          className={`field__input field__input--default ${
            isModified ? "input-dirty" : ""
          }`}
          type={type}
          name={name}
          placeholder={placeholder}
          onChange={disabled ? null : onChange}
          onBlur={onBlur}
          value={value ? value : ""}
        />
      ) : (
        <input
          disabled={disabled}
          ref={inputRef}
          className={`field__input field__input--default ${
            isModified ? "input-dirty" : ""
          }`}
          type={type}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          value={value ? value : ""}
        />
      )}

      {!hasErrors && isModified && (
        <span className="u-color--dark-blue u-font-size--12 label__under-field">
          modified{" "}
          {lengthIndication
            ? value.length +
              "/" +
              lengthIndication +
              " (suggested number of characters)"
            : ""}
        </span>
      )}
      {hasErrors && (
        <span className="u-color--vin-red u-font-size--12 label__under-field">
          {hasErrors}
        </span>
      )}
    </div>
  </Fragment>
);

FieldItem.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  inputRef: PropTypes.func,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.string,
  isModified: PropTypes.object,
  disabled: PropTypes.bool,
  hasErrors: PropTypes.object,
  tooltip: PropTypes.node,
  lengthIndication: PropTypes.number
};

export default FieldItem;
