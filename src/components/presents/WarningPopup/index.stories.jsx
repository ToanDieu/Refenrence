import React from "react";
import { storiesOf } from "@storybook/react";

import WarningPopup from "./index";

storiesOf("WarningPopup", module)
  .add("Delete action", () => <WarningPopup visible type="deleteAction" />)
  .add("Delete trigger", () => <WarningPopup visible type="deleteTrigger" />);
