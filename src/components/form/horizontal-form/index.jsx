import React from "react";
import PropTypes from "prop-types";
import ss from "classnames";
import c from "./horizontal-form.comp.scss";
import { pathOr } from "ramda";

export default class HorizontalForm extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    noneBackground: PropTypes.bool,
    className: PropTypes.string
  };

  render() {
    const childrens = React.Children.toArray(this.props.children);

    return (
      <div
        className={ss(c["list-horizontal"], this.props.className)}
        style={this.props.noneBackground ? { background: "none" } : {}}
      >
        {childrens.map((child, index) => {
          const align = pathOr("", ["props", "align"], child);
          const widthItem = pathOr("", ["props", "widthItem"], child);
          return (
            <div
              key={index}
              style={{ float: align, width: widthItem }}
              className={ss(c["item"])}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  }
}
