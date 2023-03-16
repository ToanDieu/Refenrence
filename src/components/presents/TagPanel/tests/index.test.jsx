import React from "react";
import { render, cleanup, fireEvent } from "react-testing-library";

import TagPanel from "../index";

afterEach(cleanup);

describe("<TagPanel />", () => {
  const availabelTags = [
    {
      createdAt: "2018-11-30T03:23:18.386102Z",
      description: "",
      id: 1,
      name: "Test"
    },
    {
      createdAt: "2018-11-30T03:23:51.337762Z",
      description: "",
      id: 3,
      name: "hello world"
    },
    {
      createdAt: "2018-11-30T03:24:13.351548Z",
      description: "",
      id: 4,
      name: "tag.test.1"
    },
    {
      createdAt: "2018-12-07T08:58:18.689053Z",
      description: "",
      id: 36,
      name: "tag.test.17"
    },
    {
      createdAt: "2019-02-11T06:34:18.282565Z",
      description: "",
      id: 67,
      name: "1"
    }
  ];
  const selectedTags = [
    {
      createdAt: "2018-11-30T03:24:20.086404Z",
      description: "",
      id: 5,
      name: "tag.test.2"
    }
  ];
  const onSelectTag = tag => console.log(tag);
  const onRemoveTag = id => console.log(id);
  const onAddTag = tagName => console.log(tagName);
  it("should render an <span /> tag", () => {
    const { container } = render(
      <TagPanel
        availableTags={availabelTags}
        selectedTags={[]}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        onSelectTag={onSelectTag}
      />
    );
    expect(container.firstChild.lastChild.tagName).toEqual("SPAN");
  });

  it("should render with none selected tag when selectedTags property set as emplty", () => {
    const { container } = render(
      <TagPanel
        availableTags={availabelTags}
        selectedTags={[]} // empty
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        onSelectTag={onSelectTag}
      />
    );
    expect(container.firstChild.firstChild.hasChildNodes()).toEqual(false); // check if div contain any children
  });

  it("should render with 1 selected tag when selectedTags property passed with 1 item", () => {
    const { container } = render(
      <TagPanel
        availableTags={availabelTags}
        selectedTags={selectedTags} // has one tag item
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        onSelectTag={onSelectTag}
      />
    );
    expect(container.firstChild.firstChild.childNodes.length).toEqual(1); // check if div contain any children
  });

  it("should call onSelectTag function when suggest time clicked", () => {
    const spy = jest.fn();
    const { container } = render(
      <TagPanel
        availableTags={availabelTags}
        selectedTags={selectedTags} // has one tag item
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        onSelectTag={spy}
      />
    );

    const span = container.firstChild.lastChild;
    fireEvent.click(span); // open Popover
    const suggestItem =
      span.firstChild.firstChild.lastChild.firstChild.firstChild; // suggest item ---- container.querySelector("div[class^=suggest-item-comp__container___]") not work
    fireEvent.click(suggestItem);
    expect(spy).toBeCalled();
  });

  it("should call onRemoveTag function when selectedTags clicked", () => {
    const spy = jest.fn();
    const { container } = render(
      <TagPanel
        availableTags={availabelTags}
        selectedTags={selectedTags} // has one tag item
        onAddTag={onAddTag}
        onRemoveTag={spy}
        onSelectTag={onSelectTag}
      />
    );

    const closeIcon = container.firstChild.firstChild.firstChild.lastChild; // close icon
    fireEvent.click(closeIcon);
    expect(spy).toBeCalled();
  });

  it("should call render with 5 suggest items", () => {
    const { container } = render(
      <TagPanel
        availableTags={availabelTags}
        selectedTags={selectedTags}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        onSelectTag={onSelectTag}
      />
    );

    const span = container.firstChild.lastChild;
    fireEvent.click(span); // open Popover
    const suggestItems =
      span.firstChild.firstChild.lastChild.firstChild.childNodes; // suggest item ---- container.querySelector("div[class^=auto-suggest-comp__selectable___21SU2]") not work
    expect(suggestItems.length).toEqual(5);
  });
});
