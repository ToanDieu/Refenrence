import React, { FunctionComponent, ReactNode } from "react";
import { css } from "@emotion/core";
import { Theme } from "@/components/theme";
import { NextIcon } from "@/components/units/Icon";
import Dropdown, { ListItem, DropdownItem } from "@/components/units/Dropdown";

interface EditDropdownPrps {
  className?: string;
  onEdit: () => void;
  onDelete: () => void;
  items?: DropdownItem[];
  disable: boolean;
  editing?: boolean;
  renderSelected?: () => ReactNode;
}

const EditDropdown: FunctionComponent<EditDropdownPrps> = ({
  className,
  disable = false,
  editing = false,
  items = [
    {
      id: "edit",
      name: "Edit",
      icon: "edit"
    },
    {
      id: "delete",
      name: "Delete",
      icon: "trash"
    }
  ],
  onEdit,
  onDelete,
  renderSelected = () => <div>None</div>
}) => {
  return (
    <Dropdown
      className={className}
      css={(theme: Theme) => css`
        color: inherit;

        &:first-child {
          margin-top: 0px;
        }

        .p-workflow-list {
          box-shadow: 0 8px 6px -6px #3e3e3e;
        }

        ${editing &&
          `&:hover {              
              border-radius: 4px;
              background-color: white;
              color: ${theme.primary};
            }`}
      `}
      disable={disable}
      mode="hover"
      items={items.map(({ id, name, icon, disabled }) => {
        return {
          id,
          name,
          disabled,
          render: item => (
            <ListItem
              item={item}
              css={css`
                border: none;

                &:first-child {
                  margin-top: 2px;
                  border-top-left-radius: 4px;
                  border-top-right-radius: 4px;
                }

                &:last-child {
                  border-bottom-left-radius: 4px;
                  border-bottom-right-radius: 4px;
                }
              `}
              onSelectItem={() => {
                if (disabled) {
                  return;
                }

                if (item.id === "edit") {
                  onEdit();
                } else if (item.id === "delete") {
                  onDelete();
                }
              }}
            >
              <div
                css={css`
                  i {
                    margin-right: 8px;
                  }
                `}
              >
                <NextIcon name={icon as string} size={20} />
                <span>{name}</span>
              </div>
            </ListItem>
          )
        };
      })}
      listClassName="p-workflow-list"
      renderSelected={() => renderSelected() as JSX.Element}
    />
  );
};

export default EditDropdown;
