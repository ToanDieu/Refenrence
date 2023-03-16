import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { Button } from "element-react";
import ss from "classnames";
import c from "./style.comp.scss";
import { pathOr } from "ramda";
import { RadioField } from "./index";

export default class RadioGroup extends React.Component {
  static propTypes = {
    listGroup: PropTypes.arrayOf(
      PropTypes.shape({
        groupItems: PropTypes.array,
        maxSelected: PropTypes.number,
        minSelected: PropTypes.number,
        disabled: PropTypes.bool
      })
    ),
    format: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string
  };

  state = { selected: [], groupID: -1 };

  componentDidMount() {
    this.defaultItem(this.props);
  }

  componentWillReceiveProps(props) {
    const { listGroup } = props;
    listGroup.map(group => {
      if (pathOr(false, ["disabled"], group)) {
        const { selected } = this.state;
        const items = pathOr(false, ["groupItems"], group);

        selected.map(item => {
          if (items.includes(item)) {
            this.defaultItem(props);
            return;
          }
        });
      }
    });
  }

  defaultItem(props) {
    const { listGroup } = props;
    let defaultItem = [];

    const firstItem = listGroup.findIndex(item => {
      return !item.disabled;
    });

    defaultItem = pathOr("", ["listGroup", firstItem, "groupItems", 0], props);
    this.addSelection(firstItem, defaultItem);
  }

  addSelection = (id, value) => {
    const { listGroup, onChange } = this.props;
    let { selected, groupID } = this.state;

    if (id != groupID) {
      selected = [];
      this.setState({
        groupID: id,
        selected: selected
      });
    }

    if (selected.includes(value)) {
      if (pathOr(0, [id, "minSelected"], listGroup) <= selected.length - 1) {
        selected.splice(selected.indexOf(value), 1);
        this.setState({
          selected: selected
        });
        onChange(selected);
      }
    } else {
      if (pathOr(0, [id, "maxSelected"], listGroup) > selected.length) {
        selected.push(value);
        this.setState({
          groupID: id,
          selected: selected
        });
        onChange(selected);
      }
    }
  };

  render() {
    const { listGroup, format, className } = this.props;
    const { selected } = this.state;
    const background = ["dark-violet", "dark-pink"];

    return (
      <RadioField format={format}>
        {listGroup.map((group, index) => {
          const groupID = index;
          return (
            <Fragment key={index}>
              {group.groupItems.map((value, index) => (
                <Button
                  disabled={pathOr(false, ["disabled"], group)}
                  key={index}
                  className={ss(
                    c["text"],
                    selected.includes(value) ? c["selected"] : c["default"],
                    c[`background--${background[index]}`],
                    className
                  )}
                  onClick={() => this.addSelection(groupID, value)}
                >
                  {value}
                </Button>
              ))}
            </Fragment>
          );
        })}
      </RadioField>
    );
  }
}
