import React from "react";
import { render } from "react-testing-library";

import Wrapper from "../Wrapper";

describe("<Wrapper />", () => {
  it("should match styles in snapshot", () => {
    const { container } = render(<Wrapper />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match styles in snapshot with different props", () => {
    const { container } = render(<Wrapper edgeLength={8} edgeThick={3} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render an <div> tag", () => {
    const { container } = render(<Wrapper />);
    expect(container.firstElementChild.tagName).toEqual("DIV");
  });

  it("should have a class attribute", () => {
    const { container } = render(<Wrapper />);
    const element = container.firstElementChild;
    expect(element.hasAttribute("class")).toBe(true);
  });

  it("should adopt a valid attribute", () => {
    const id = "test";
    const { container } = render(<Wrapper id={id} />);
    const element = container.firstElementChild;
    expect(element.id).toEqual(id);
  });

  it("should not adopt an invalid attribute", () => {
    const { container } = render(<Wrapper attribute="test" />);
    const element = container.firstElementChild;
    expect(element.hasAttribute("attribute")).toBe(false);
  });
});
