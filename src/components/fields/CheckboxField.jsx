import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from "element-react";
import ss from "classnames";
import c from "./field.comp.scss";
import Tooltip from "@/components/tooltip";

const CheckboxField = ({ items, options, onChange, label, tooltip }) => {
  return (
    <div>
      {label ? (
        <div className={ss(c.field__label)}>
          <span className={ss(c.label)}>{label}</span>
          {tooltip && <Tooltip content={tooltip} />}
        </div>
      ) : (
        ""
      )}

      <Checkbox.Group
        {...options}
        onChange={onChange}
        className={ss(c["contain-default"])}
      >
        {items.map((item, index) => (
          <Checkbox key={index} label={item} />
        ))}
      </Checkbox.Group>
    </div>
  );
};

CheckboxField.propTypes = {
  items: PropTypes.arrays,
  options: PropTypes.object,
  onChange: PropTypes.func,
  label: PropTypes.string,
  tooltip: PropTypes.node
};

CheckboxField.defaultProps = {
  tooltip: <span />,
  label: "",
  onChange: () => {},
  options: {},
  items: []
};

export default CheckboxField;
