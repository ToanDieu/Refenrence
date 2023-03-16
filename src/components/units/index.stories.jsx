/** @jsx jsx */
import { storiesOf } from "@storybook/react";
import { jsx } from "@emotion/core";

import Input from "./Input";

storiesOf("Input", module).add("Default", () => (
  <div style={{ width: "500px" }}>
    <Input
      lable="test lable"
      onChange={e => console.log(e)}
      placeholder="placeholder"
      // disabled
    />
  </div>
));
