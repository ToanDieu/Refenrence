import React from "react";
import PropTypes from "prop-types";
import { Tag } from "element-react";
import ss from "classnames";
import c from "./tag.comp.scss";

export default class ListTags extends React.Component {
  static propTypes = {
    selectedTags: PropTypes.array,
    onRemoveTag: PropTypes.func
  };

  render() {
    const { selectedTags, onRemoveTag } = this.props;
    return (
      <div>
        {selectedTags.map(({ name, id }) => (
          <Tag
            key={id}
            type="gray"
            closable={true}
            closeTransition={false}
            className={ss(c["tag"])}
            onClose={() => onRemoveTag(id)}
          >
            {name}
          </Tag>
        ))}
      </div>
    );
  }
}
