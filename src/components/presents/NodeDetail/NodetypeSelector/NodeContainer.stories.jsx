/** @jsx jsx */
import { storiesOf } from "@storybook/react";
import { jsx, css } from "@emotion/core";
import ListNode from "./NodeContainer";

const style = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const datas = [
  {
    label: "this is main label",
    detail: "this is detail text",
    iconName: "workflow",
    backgroundColor: "green",
    onClick: () => console.log("0")
  },
  {
    label: "this is second main label",
    detail: "this is second detail text",
    iconName: "chart",
    backgroundColor: "",
    onClick: () => console.log("1")
  }
];

storiesOf("ListNode", module).add("ListNode", () => (
  <div css={style}>
    <ListNode
      items={datas}
      onOffForm={() => console.log("offForm")}
      title="ADD ACTION"
    />
  </div>
));
