import React, { cloneElement } from "react";
import PropTypes from "prop-types";

import { Radio } from "element-react";

import ss from "classnames";
import c from "./style.comp.scss";

export default class RadioField extends React.Component {
  static propTypes = {
    items: PropTypes.arrays,
    options: PropTypes.object,
    onChange: PropTypes.func,
    children: PropTypes.node,
    format: PropTypes.string
  };

  onClick = key => {
    const { onChange } = this.props;
    if (onChange) {
      this.props.onChange(key);
    }
  };

  render() {
    const { items, options, onChange, format } = this.props;
    const childrens = React.Children.toArray(this.props.children);
    if (!childrens || childrens.length <= 0) {
      return (
        <Radio.Group {...options} onChange={onChange}>
          {items.map(item => (
            <Radio.Button key={item} value={item} />
          ))}
        </Radio.Group>
      );
    } else {
      return (
        <div className={format == "horizontal" ? ss(c["horizontal"]) : {}}>
          {childrens.map((child, index) =>
            cloneElement(child, {
              onClick: () => this.onClick(index),
              key: index
            })
          )}
        </div>
      );
    }
  }
}
