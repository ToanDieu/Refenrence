import React from "react";
import { storiesOf } from "@storybook/react";
import { NextIcon } from "./index";

storiesOf("Icon", module).add("Default", () => (
  <div>
    <NextIcon name="workflow" />
  </div>
));
