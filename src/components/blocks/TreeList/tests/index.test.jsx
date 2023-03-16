import React from "react";
import { render } from "react-testing-library";

import TreeList from "../index";

describe("<TreeList />", () => {
  it("should render the <Wrapper /> component", () => {
    const { container } = render(<TreeList data={[]} />);
    expect(container.firstChild.tagName).toEqual("DIV");
  });

  it("should render the <List /> component", () => {
    const { container } = render(<TreeList data={[]} />);
    expect(container.firstChild.firstChild.tagName).toEqual("UL");
  });
});
