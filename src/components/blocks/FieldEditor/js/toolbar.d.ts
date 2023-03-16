import * as React from "react";

export interface JSToolbarPlugin {
  createToolbarPlugin: any;
}

declare const jsToolbarPlugin: JSToolbarPlugin;

export default jsToolbarPlugin;
