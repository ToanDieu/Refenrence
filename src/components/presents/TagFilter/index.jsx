import React from "react";
import ss from "classnames";

import { Dropdown } from "element-react";

import c from "./tag-filter.comp.scss";
import filterIcon from "./assets/ic-circle-menu.svg";

const TagFilter = ({ onSelectTag, tags, label, translate }) => (
  <div className={c["container"]}>
    <Dropdown
      trigger="click"
      onCommand={onSelectTag}
      menu={
        <Dropdown.Menu>
          <Dropdown.Item key={-1} command="-1">
            <div className={ss(c["all-item"])}>{translate("All")}</div>
          </Dropdown.Item>
          <div className={ss(c["tags"])}>
            {tags.map(tag => (
              <Dropdown.Item key={tag.id} command={`${tag.id}`}>
                {tag.name}
              </Dropdown.Item>
            ))}
          </div>
        </Dropdown.Menu>
      }
    >
      <span className={ss("el-dropdown-link", c["button"])}>
        {label}
        <img
          className="icon-img--24 el-icon-caret-bottom el-icon--right"
          src={filterIcon}
        />
      </span>
    </Dropdown>
  </div>
);

export default TagFilter;
