import React from "react";
import { storiesOf } from "@storybook/react";
import { css } from "@emotion/core";
import Dropdown, { DropdownSelected, ListItem } from "./Dropdown";

storiesOf("Dropdown", module)
  .add("normal", () => (
    <Dropdown
      initial="2"
      onChange={item => {
        console.log("selected: ", item);
      }}
      items={[
        {
          id: "1",
          name: "Edit Mode"
        },
        { id: "2", name: "View Mode" }
      ]}
      iconName="chevron-down"
    />
  ))
  .add("custom", () => (
    <Dropdown
      renderSelected={item => (
        <DropdownSelected iconName="chevron-down" item={item} />
      )}
      items={[
        {
          id: "A",
          name: "A",
          render: (item, selectItem) => (
            // console.log(selected);
            <ListItem
              key={item.id}
              css={css`
                z-index: 1000;
              `}
              onSelectItem={selectItem}
              item={item}
            />
          )
        },
        { id: "B", name: "B" },
        { id: "D", name: "D" }
      ]}
      iconName="chevron-down"
    />
  ));
