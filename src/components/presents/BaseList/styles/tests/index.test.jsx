import React from "react";
import { render } from "react-testing-library";
import { MemoryRouter } from "react-router-dom";

import { MemoLink, ActionLink, Table } from "../index";

describe("<BaseList /> styles", () => {
  it("should render and match the snapshot", () => {
    const { container } = render(
      <MemoryRouter>
        <MemoLink to="/">Memo Link</MemoLink>
      </MemoryRouter>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render <ActionLink /> and match the snapshot", () => {
    const { container } = render(
      <MemoryRouter>
        <ActionLink to="/">Action Link</ActionLink>
      </MemoryRouter>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render <ActionLink /> and match the snapshot", () => {
    const cols = [1, 2, 3, 4, 5, 6];
    const { container } = render(
      <Table>
        <thead>
          <tr>
            {cols.map(i => (
              <td>{i}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {cols.map(i => (
              <td>{i}</td>
            ))}
          </tr>
          <tr>
            {cols.map(i => (
              <td>{i}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
