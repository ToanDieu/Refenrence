import React from "react";
import { storiesOf } from "@storybook/react";
import { css } from "@emotion/core";
import TriggerRelativeTime from "./TriggerRelativeTime";

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
  if (code === "triggerRelativeTimeTitle") {
    return "before/after";
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
  if (code === "parameter") {
    return "parameter";
  }
  return null;
};

storiesOf("TriggerRelativeTime", module)
  .add("Default", () => (
    <div css={style}>
      <TriggerRelativeTime
        onOffForm={() => console.log("OffForm")}
        durationChange={e => console.log(e)}
        onSubmit={e => console.log(e)}
        paramList={[
          {
            id: "1",
            name: "param 1"
          },
          { id: "2", name: "param 2" }
        ]}
        selectedIndex={2}
        value="1h30m"
        translate={code => translate(code)}
      />
    </div>
  ))
  .add("Disabled", () => (
    <div css={style}>
      <TriggerRelativeTime
        onOffForm={() => console.log("OffForm")}
        durationChange={e => console.log(e)}
        onSubmit={e => console.log(e)}
        paramList={[
          {
            id: "1",
            name: "param 1"
          },
          { id: "2", name: "param 2" }
        ]}
        selectedIndex={2}
        value="1h30m"
        disabled
        translate={code => translate(code)}
      />
    </div>
  ))
  .add("Loading", () => (
    <div css={style}>
      <TriggerRelativeTime
        onOffForm={() => console.log("OffForm")}
        durationChange={e => console.log(e)}
        translate={code => translate(code)}
        onSubmit={e => console.log(e)}
        paramList={[
          {
            id: "1",
            name: "param 1"
          },
          { id: "2", name: "param 2" }
        ]}
        selectedIndex={2}
        value="1h30m"
        loading
      />
    </div>
  ));
