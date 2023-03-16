import React from "react";
import { render } from "react-testing-library";

import List from "../List";

const renderFunc = item => <span>{item.id}</span>;

describe("<List />", () => {
  it("should render an <ul> tag", () => {
    const { container } = render(<List data={[]} renderFunc={renderFunc} />);
    expect(container.firstChild.tagName).toEqual("UL");
  });

  it("should render an <li> tag and label", () => {
    const data = [
      {
        id: "test",
        children: []
      }
    ];
    const { container } = render(<List data={data} renderFunc={renderFunc} />);
    const node = container.firstChild.firstChild;
    expect(node.tagName).toEqual("LI");
    expect(node.textContent).toEqual("test");
  });

  it("should invoke renderFunc prop", () => {
    const spy = jest.fn();
    const data = [
      {
        id: "test",
        children: []
      }
    ];
    render(<List data={data} renderFunc={spy} />);
    expect(spy).toBeCalled();
  });

  it("should render a recursive list", () => {
    const data = [
      {
        id: "test",
        children: [
          {
            id: "child",
            children: []
          }
        ]
      }
    ];
    const { container } = render(<List data={data} renderFunc={renderFunc} />);
    const node = container.firstChild.querySelector("ul");
    expect(node.querySelector("span").textContent).toEqual("child");
  });
});
