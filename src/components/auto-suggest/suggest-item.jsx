import React from "react";
import PropTypes from "prop-types";

import { Tag } from "element-react";

import ss from "classnames";
import c from "./suggest-item.comp.scss";

const SuggestItem = p =>
  p.newSuggest ? (
    <div
      onClick={() => p.onAdd(p.newSuggest)}
      className={ss(c["container-new"])}
    >
      <span className={ss(c["btn-new-tag-label"])}>Add</span>{" "}
      <Tag type="gray">{p.newSuggest}</Tag>
    </div>
  ) : p.item ? (
    <div onClick={() => p.onSelect(p.item)} className={ss(c["container"])}>
      <span>{p.item.name}</span>
    </div>
  ) : null;

SuggestItem.propTypes = {
  item: PropTypes.object,
  type: PropTypes.string,
  onSelect: PropTypes.func,
  onAdd: PropTypes.func,
  newSuggest: PropTypes.string
};

SuggestItem.defaultProps = {
  onSelect: item => console.log("selecting: ", item),
  onAdd: item => console.log("adding: ", item)
};

export default SuggestItem;
