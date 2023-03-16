import React from "react";
import { storiesOf } from "@storybook/react";
import Dialog from "./Dialog";

storiesOf("Dialog", module).add("Default", () => (
  <div
    style={{ maxWidth: "400px", margin: "auto", border: "1px solid #e8e6e2" }}
  >
    <Dialog
      title="this is title"
      boderWidthTitle="0px 0px 2px 0px"
      // loading
      offForm={() => {
        console.log("off Dialog");
      }}
    >
      This is dialog
    </Dialog>
  </div>
));
