/** @jsx jsx */
import { storiesOf } from "@storybook/react";
import { jsx, css } from "@emotion/core";

import DateTimePicker from "./DatetimePicker";
import TimePicker from "./TimePicker";
import Card from "./Card";

const style = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

storiesOf("DateTimePicker", module).add("DateTimePicker", () => (
  <div style={{ width: "500px" }}>
    <DateTimePicker
      label="Date/Time"
      value="2019/05/23"
      onChange={val => console.log(val)}
      // format="YYYY/MM/DD"
    />
  </div>
));

storiesOf("TimePicker", module).add("TimePicker", () => (
  <div style={{ width: "500px" }}>
    <TimePicker
      hours={1}
      minutes={11}
      seconds={8}
      label="Time"
      onChange={val => console.log(val)}
    />
  </div>
));

storiesOf("Card", module)
  .add("Default", () => (
    <div css={style}>
      <div style={{ width: "400px" }}>
        <Card
          label="this is main label"
          detail="this is detail text"
          iconName="workflow"
          onClick={() => console.log("onClick")}
          hover={() => console.log("onMouseOver")}
        />
      </div>
    </div>
  ))
  .add("Green", () => (
    <div css={style}>
      <div style={{ width: "400px" }}>
        <Card
          label="this is main label"
          detail="this is detail text"
          iconName="workflow"
          backgroundColor="green"
        />
      </div>
    </div>
  ));
