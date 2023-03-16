import React, { Component } from "react";
import PropTypes from "prop-types";

import ss from "classnames";
import { Popover, Tag } from "element-react";

import AutoSuggest from "@/components/auto-suggest/index";

import c from "./tag-panel.comp.scss";
import IconCircleTag from "./assets/ic-circle-tag.svg";

class TagPanel extends Component {
  constructor(props) {
    super(props);
  }

  filterTags = (searchTerm, suggest) => {
    return suggest.name.includes(searchTerm);
  };

  render = () => {
    const {
      selectedTags,
      availableTags,
      onAddTag,
      onSelectTag,
      onRemoveTag,
      placeHolder
    } = this.props;

    return (
      <div className={ss(c["container"])}>
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
        <Popover
          width="250"
          trigger="click"
          visibleArrow={false}
          placement="bottom-end"
          className={ss(c["popover-container"])}
          content={
            <AutoSuggest
              placeHolder={placeHolder}
              onSelect={onSelectTag}
              onAdd={onAddTag}
              suggestions={availableTags}
              filterFunc={this.filterTags}
            />
          }
        >
          <img
            className={ss("icon-img--24", "u-text-align--right", c["button"])}
            src={IconCircleTag}
          />
        </Popover>
      </div>
    );
  };
}

TagPanel.propTypes = {
  selectedTags: PropTypes.array,
  availableTags: PropTypes.array,
  onSelectTag: PropTypes.func,
  onAddTag: PropTypes.func,
  onRemoveTag: PropTypes.func,
  placeHolder: PropTypes.string
};

export default TagPanel;
