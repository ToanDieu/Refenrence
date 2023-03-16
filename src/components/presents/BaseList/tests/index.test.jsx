import React from "react";
import { render } from "react-testing-library";
import { MemoryRouter } from "react-router-dom";

import BaseList from "../index";

describe("<BaseList />", () => {
  it("should render and match the snapshot", () => {
    const data = [
      {
        id: 1,
        name: "base 1",
        memo: "",
        shortcode: "",
        updatedAt: "2019-06-19T14:56:55Z"
      },
      {
        id: 2,
        name: "base 2",
        memo: "",
        shortcode: "",
        updatedAt: "2019-06-19T14:56:55Z"
      },
      {
        id: 3,
        name: "base 3",
        memo: "",
        shortcode: "",
        updatedAt: ""
      }
    ];
    const { container } = render(
      <MemoryRouter>
        <BaseList bases={data} currentBaseId={1} translate={jest.fn()} />
      </MemoryRouter>
    );
    expect(container.querySelectorAll("tbody tr").length).toEqual(3);
  });
});
