import React from "react";
import { storiesOf } from "@storybook/react";
import { css } from "@emotion/core";
import ActionDelay from ".";

const style = css`
  width: 100%;
  justify-content: center;
  display: flex;
`;

const translate = code => {
  if (code === "required") {
    return "required";
  }
  if (code === "actionDelayFormatMess") {
    return "Please use format 00h00m00s (Where 00 are digits)";
  }
  if (code === "actionDelayTitle") {
    return "sleep";
  }
  if (code === "durationLabel") {
    return "duration";
  }
  if (code === "cancel") {
    return "cancel";
  }
  if (code === "add") {
    return "add";
  }
  return null;
};
storiesOf("ActionDelay", module)
  .add("Default", () => (
    <div css={style}>
      <ActionDelay
        onOffForm={() => console.log("OffForm")}
        onChange={e => console.log(e)}
        value="24h00m00s"
        requiredMess="required"
        formatMess="Use format xxhxxmxxs (where xx are digits)"
        onSubmit={e => console.log(e)}
        translate={code => translate(code)}
      />
    </div>
  ))
  .add("Disabled", () => (
    <div css={style}>
      <ActionDelay
        onOffForm={() => console.log("OffForm")}
        onChange={e => console.log(e)}
        value="24h00m00s"
        translate={code => translate(code)}
        onSubmit={e => console.log(e)}
        disabled
      />
    </div>
  ))
  .add("Loading", () => (
    <div css={style}>
      <ActionDelay
        onOffForm={() => console.log("OffForm")}
        onChange={e => console.log(e)}
        value="24h00m00s"
        translate={code => translate(code)}
        onSubmit={e => console.log(e)}
        loading
      />
    </div>
  ));
