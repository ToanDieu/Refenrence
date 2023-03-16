import React from "react";
import { storiesOf } from "@storybook/react";
import { css } from "@emotion/core";
import Button from "./Button";

const style = css`
  width: 100%;
  justify-content: center;
  display: flex;
`;
storiesOf("Button", module)
  .add("Default", () => (
    <div css={style}>
      <Button label="Default" />
    </div>
  ))
  .add("Primary", () => (
    <div css={style}>
      <Button label="Primary" type="primary" />
    </div>
  ))
  .add("Primary-Disabled", () => (
    <div css={style}>
      <Button label="Diasabled" disabled type="primary" />
    </div>
  ))
  .add("Danger", () => (
    <div css={style}>
      <Button label="Danger" type="danger" />
    </div>
  ))
  .add("Warning", () => (
    <div css={style}>
      <Button label="waring" type="warning" />
    </div>
  ))
  .add("With-Icon", () => (
    <div css={style}>
      <Button iconName="chart" label="Danger" type="primary" />
    </div>
  ));
