import React from "react";
import { storiesOf } from "@storybook/react";
import { css } from "@emotion/core";
import ActionSetParam from ".";

const style = css`
  width: 100%;
  justify-content: center;
  display: flex;
`;

storiesOf("ActionSetParam", module)
  .add("Default", () => (
    <div css={style}>
      <div
        css={css`
          width: 40%;
        `}
      >
        <ActionSetParam
          selectedChange={e => console.log(e)}
          inputChange={e => console.log(e)}
          value=""
          params={[
            {
              id: "number",
              name: "number",
              type: "number"
            }
          ]}
        />
      </div>
    </div>
  ))
  .add("Disabled", () => (
    <div css={style}>
      <div
        css={css`
          width: 40%;
        `}
      >
        <ActionSetParam
          selectedChange={e => console.log(e)}
          inputChange={e => console.log(e)}
          value=""
          disabled
        />
      </div>
    </div>
  ));
