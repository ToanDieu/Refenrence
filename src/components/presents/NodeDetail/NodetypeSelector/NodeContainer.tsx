import React, { FunctionComponent } from "react";
import { css } from "@emotion/core";
import ItemDescriber, { CardProps } from "@/components/blocks/Card";
import Dialog from "@/components/blocks/Dialog";

interface ItemDescribersProps {
  onOffForm: () => void;
  title: string;
  items: CardProps[];
}

const ListNode: FunctionComponent<ItemDescribersProps> = ({
  items,
  onOffForm,
  title
}) => {
  return items.length > 0 ? (
    <div
      css={css`
        background: #ffffff;
        width: 38%;
      `}
    >
      <Dialog
        offForm={onOffForm}
        boderWidthTitle="0px 0px 1px 0px"
        title={title}
      >
        <div
          css={css`
            padding: 12px 20px;
            box-sizing: border-box;
          `}
        >
          {items.map((item: CardProps, index: number) => {
            const indexKey = index;
            return (
              <div
                key={indexKey}
                css={css`
                  padding-bottom: 8px;
                `}
              >
                <ItemDescriber
                  iconName={item.iconName}
                  label={item.label}
                  detail={item.detail}
                  backgroundColor={item.backgroundColor}
                  hover={item.hover}
                  onClick={item.onClick}
                />
              </div>
            );
          })}
        </div>
      </Dialog>
    </div>
  ) : null;
};

export default ListNode;
