import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "element-react";

export default class DropdownButon extends React.Component {
  static propTypes = {
    items: PropTypes.arrays,
    options: PropTypes.object,
    onCommand: PropTypes.func,
    children: PropTypes.node
  };

  render() {
    const { items, onCommand, options } = this.props;
    return (
      <Dropdown
        {...options}
        menu={
          <Dropdown.Menu>
            {items.map((item, index) => {
              return (
                <Dropdown.Item key={index} command={item}>
                  {" "}
                  {item}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        }
        onCommand={onCommand}
      >
        {this.props.children}
      </Dropdown>
    );
  }
}
