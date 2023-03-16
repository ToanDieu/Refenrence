import React from "react";
import { configure, addDecorator } from "@storybook/react";
import { ThemeProvider } from "emotion-theming";
import { css } from "@emotion/core";
import theme from "@/components/theme.ts";
import "@/assets/style/element/index.css";
import "@/assets/style/text/_font-family.scss";
import "@/assets/style/element/index.css";
import "@/icons.font";

addDecorator(storyFn => (
  <div
    css={css`
      * {
        box-sizing: border-box;
        font-family: "Gotham";
      }
    `}
  >
    <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
  </div>
));

function loadStories() {
  const req = require.context("../src", true, /\.stories\.[j|t]sx?$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
