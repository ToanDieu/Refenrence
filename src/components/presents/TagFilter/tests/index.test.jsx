import React from "react";
import { render, cleanup, fireEvent } from "react-testing-library";

import TagFilter from "../index";

const tags = [
  { id: "id1", name: "name1" },
  { id: "id2", name: "name2" },
  { id: "id3", name: "name3" }
];

const onSelectTag = item => {
  console.log(item);
};

const labelProp = "label test";

afterEach(cleanup);

describe("<TagFilter />", () => {
  it("should render an <div> tag in Dropdown", () => {
    const { container } = render(
      <TagFilter label={labelProp} tags={tags} onSelectTag={onSelectTag} />
    );
    expect(container.firstChild.firstChild.tagName).toEqual("DIV");
  });

  it("should render an <span> tag and label as 'label test'", () => {
    const { container } = render(
      <TagFilter label={labelProp} tags={tags} onSelectTag={onSelectTag} />
    );
    const node = container.firstChild.firstChild.firstChild;
    expect(node.tagName).toEqual("SPAN");
    expect(node.textContent).toEqual("label test");
  });

  it("should render tag items and invoke onSelectTag function", () => {
    const spy = jest.fn();
    const { container } = render(
      <TagFilter label={labelProp} tags={tags} onSelectTag={spy} />
    );

    jest.useFakeTimers();
    const span = container.querySelector(".el-dropdown-link");
    fireEvent.click(span); // open dropdown
    jest.advanceTimersByTime(1000);
    const dropdown = container.querySelector(".el-dropdown-menu");
    const li = dropdown.firstChild;
    // const nodesParents = container.firstChild.firstChild.childNodes; // [span, ul]
    // const nodes = nodesParents[1].childNodes; // [li, div]
    // const nodeItems = nodes[1].childNodes;
    // console.log("nodeItems: ", nodeItems);
    expect(li.tagName).toEqual("LI");
    fireEvent.click(li);
    jest.advanceTimersByTime(1000);

    expect(spy).toBeCalled();
  });
});
