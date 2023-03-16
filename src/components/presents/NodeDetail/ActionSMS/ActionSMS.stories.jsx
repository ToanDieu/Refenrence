import React from "react";
import { storiesOf } from "@storybook/react";
import { css } from "@emotion/core";
import { ActionSMS } from ".";

const style = css`
  width: 100%;
  justify-content: center;
  display: flex;
`;

const params = [
  { id: "phone 1", name: "phone 1" },
  { id: "phone 2", name: "phone 2" },
  { id: "phone 3", name: "phone 3" }
];

const inital = { paramName: "phone 2", value: "this is value phone 2" };

storiesOf("ActionSMS", module)
  .add("Default", () => (
    <div css={style}>
      <ActionSMS
        params={params}
        onChange={form => console.log("onChange: ", form)}
        onValidate={val => console.log("onValidate: ", val)}
      />
    </div>
  ))
  .add("Disabled", () => (
    <div css={style}>
      <ActionSMS
        params={params}
        inital={inital}
        onChange={form => console.log("onChange: ", form)}
        onValidate={val => console.log("onValidate: ", val)}
      />
    </div>
  ));
