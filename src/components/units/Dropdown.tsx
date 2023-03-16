import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import { css } from "@emotion/core";
import { Theme, default as configedTheme } from "@/components/theme";
import Icon from "@/components/units/Icon";

const wrapper = (theme: Theme) => css`
  position: relative;

  min-width: 200px;
  width: fit-content;

  font-family: ${theme.fontFamily ||
    `'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif`};
  color: ${theme.primary || "#1E5A6E"};
`;

const dropList = (show: boolean) => css`
  /* display: ${show ? "block" : "none"}; */    
  position: absolute;
  top: 100%;
  left: 0;
  margin: 0;
  padding-left: 0;
  z-index: 100;

  width: 100%;
  height: ${show ? "auto" : "0px"};
  opacity: ${show ? "1" : "0"};  

  overflow: hidden;
  transition: opacity 0.3s ease-out;
  list-style-type: none;
`;

const dropItem = ({ disable }: { disable: boolean }) => (theme: Theme) => css`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  width: 100%;
  height: ${theme.fieldHeight}px;

  list-style-type: none;
  border: 1px solid ${theme.gray || "#E8E6E2"};
  background-color: white;
  border-bottom: none;
  cursor: pointer;

  ${disable &&
    `
    color: ${theme.coldTurkey};
    cursor: not-allowed;
    &:hover {
      background: #FFFFFF;
    }`}

  &:last-child {
    border-bottom: 1px solid ${theme.gray || "#E8E6E2"};
  }

  &:last-of-type {
    border-bottom: 1px solid ${theme.gray || "#E8E6E2"};
  }

  &:hover {
    background-color: ${theme.gray || "#E8E6E2"};
  }
`;

export interface DropdownItem {
  id: string | number;
  name?: string;
  icon?: string;
  render?: (
    item: DropdownItem,
    selectItem: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    selected?: boolean
  ) => JSX.Element;
  disabled?: boolean;
}

interface DropdownSelectedPrps {
  className?: string;
  iconName: string;
  placeHolder?: string;
  item?: DropdownItem;
}

export const DropdownSelected: FunctionComponent<DropdownSelectedPrps> = ({
  iconName,
  className,
  item,
  placeHolder = "Select option..."
}) => {
  return (
    <span
      className={className}
      css={dropItem({ disable: item ? !!item.disabled : false })}
    >
      {item ? item.name : placeHolder}
      &nbsp;
      <Icon iconName={iconName} size={20} color={configedTheme.primary} />
    </span>
  );
};

interface ListItemPrps {
  onSelectItem: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
  item?: DropdownItem;
}

export const ListItem: FunctionComponent<ListItemPrps> = ({
  onSelectItem,
  className,
  item,
  children
}) => {
  return (
    <div
      role="presentation"
      className={className}
      onClick={onSelectItem}
      css={dropItem({ disable: item ? !!item.disabled : false })}
    >
      {children || (item ? item.name : "No Value")}
    </div>
  );
};

interface DropdownPrps {
  className?: string;
  listClassName?: string;
  selectedClassName?: string;
  disable?: boolean;
  iconName?: string;
  mode?: "click" | "hover";
  /**
   * initial value is item {id}
   */
  initial?: string | undefined;
  onChange?: (item?: DropdownItem) => void;
  placeHolder?: string;
  renderSelected?: (
    item: DropdownItem | undefined,
    disable?: boolean
  ) => JSX.Element;
  items?: DropdownItem[];
}

const Dropdown: FunctionComponent<DropdownPrps> = ({
  iconName = "chevron-down",
  disable = false,
  className,
  listClassName,
  selectedClassName,
  mode = "click",
  initial,
  onChange = item => {
    console.log("Dropdown selected: ", item);
  },
  renderSelected,
  placeHolder = "Select option...",
  items = []
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showList, setShowList] = useState<boolean>(false);
  const [selected, selectItem] = useState<{
    item: DropdownItem | undefined;
    initial?: boolean;
  }>({ item: items.find(item => item.id === initial), initial: true });

  const toggleList = () => setShowList(!showList);
  const selectThisItem = (item: DropdownItem) => () => {
    selectItem({ item });
  };
  const closeList = (e: Event) => {
    if (dropdownRef.current && e.target) {
      if (dropdownRef.current.contains(e.target as Node)) {
        return;
      }
      setShowList(false);
    }
  };

  useEffect(() => {
    const initialItem = items.find(item => item.id === initial);
    if (initialItem) {
      selectItem({ item: initialItem, initial: true });
    }
  }, [initial]);

  useEffect(() => {
    if (selected && !selected.initial) {
      onChange(selected.item);
    }
  }, [selected]);

  useEffect(() => {
    if (mode === "click") {
      document.addEventListener("mousedown", closeList, false);
      return () => document.removeEventListener("mousedown", closeList, false);
    }
    return () => {};
  }, [dropdownRef]);

  let props: any =
    mode === "click"
      ? {
          onClick: toggleList
        }
      : {
          onMouseEnter: () => setShowList(true),
          onMouseLeave: () => setShowList(false)
        };

  if (disable) {
    props = undefined;
  }

  return (
    <div
      role="presentation"
      ref={dropdownRef}
      css={wrapper}
      className={className}
      {...props}
    >
      <div className={listClassName} css={dropList(showList)}>
        {items.map(item =>
          !item.render ? (
            <ListItem
              key={item.id}
              onSelectItem={selectThisItem(item)}
              item={item}
            />
          ) : (
            item.render(
              item,
              selectThisItem(item),
              selected.item ? selected.item.id === item.id : false
            )
          )
        )}
      </div>
      {!renderSelected ? (
        <DropdownSelected
          className={selectedClassName}
          css={
            disable &&
            css`
              background-color: #e8e6e2;
            `
          }
          placeHolder={placeHolder}
          iconName={iconName}
          item={selected.item}
        />
      ) : (
        renderSelected(selected.item, disable)
      )}
    </div>
  );
};

export default Dropdown;
