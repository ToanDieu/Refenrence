import React from "react";
import { storiesOf } from "@storybook/react";
import { css } from "@emotion/core";
import ActionFieldVisibility from "@/components/presents/NodeDetail/ActionShowHideField";

const style = css`
  width: 100%;
  justify-content: center;
  display: flex;
`;

const values = {
  back_1: {
    content: "isAssignedFrom",
    extention: "boolean"
  },
  back_2: {
    content: "isHidden"
  }
};

const params = [
  { id: "boolean", name: "boolean", type: "boolean" },
  { id: "solved", name: "solved", type: "boolean" }
];

const fields = [
  { id: "back_1", label: "Back 1" },
  { id: "back_2", label: "Webhook" },
  { id: "back_4", label: "OpenUI" },
  { id: "back_3", label: "Param text" }
];

storiesOf("ActionFieldVisibility", module)
  .add("Default", () => (
    <div css={style}>
      <div
        css={css`
          width: 70%;
        `}
      >
        <ActionFieldVisibility
          params={params}
          fields={fields}
          onChange={val => console.log(val)}
        />
      </div>
    </div>
  ))
  .add("Edit", () => (
    <div css={style}>
      <div
        css={css`
          width: 70%;
        `}
      >
        <ActionFieldVisibility
          params={params}
          fields={fields}
          values={values}
          onChange={val => console.log(val)}
        />
      </div>
    </div>
  ));
