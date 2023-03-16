import React from "react";
import { render, fireEvent } from "react-testing-library";
import { Provider } from "react-redux";
import { initialize, addTranslationForLanguage } from "react-localize-redux";

import languages from "@/i18n/languages.json";
import english from "@/i18n/en.json";
import { store as appStore } from "@/store/configureStore";
import { PageHeader } from "../PageHeader";

describe("<PageHeader />", () => {
  let store;
  const translate = jest.fn();

  beforeAll(() => {
    store = appStore;
    const defaultLanguage = "en";
    store.dispatch(initialize(languages, { defaultLanguage }));
    store.dispatch(addTranslationForLanguage(english, "en"));
  });

  it("should render the header without active button & the mode dropdown", () => {
    const workflow = { id: 1, name: "My test workflow" };
    const actions = [];
    const { container } = render(
      <PageHeader translate={translate} workflow={workflow} actions={actions} />
    );
    expect(container).toMatchSnapshot();
  });

  it("should render the header within active button & the mode dropdown", () => {
    const workflow = { id: 1, name: "My test workflow" };
    const actions = [{ id: 1 }, { id: 2 }];
    const { container } = render(
      <Provider store={store}>
        <PageHeader
          translate={translate}
          workflow={workflow}
          actions={actions}
        />
      </Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should disable active button if workflow is activated", () => {
    const workflow = { id: 1, name: "My test workflow", active: true };
    const actions = [{ id: 1 }, { id: 2 }];
    const { container } = render(
      <Provider store={store}>
        <PageHeader
          translate={translate}
          workflow={workflow}
          actions={actions}
        />
      </Provider>
    );
    expect(container.querySelector("button")).toMatchSnapshot();
  });

  describe("should toggle edit/view mode", () => {
    it("should toggle mode to edit when click dropdown item", () => {
      const toggleSpy = jest.fn();
      const workflow = { id: 1, name: "My test workflow" };
      const actions = [{ id: 1 }, { id: 2 }];
      const { getAllByText } = render(
        <Provider store={store}>
          <PageHeader
            translate={translate}
            workflow={workflow}
            actions={actions}
            setEditMode={toggleSpy}
          />
        </Provider>
      );
      fireEvent.click(getAllByText("Edit Mode")[0]);
      expect(toggleSpy).toBeCalledWith(true);
    });

    it("should toggle mode to view when click dropdown item", () => {
      const toggleSpy = jest.fn();
      const workflow = { id: 1, name: "My test workflow" };
      const actions = [{ id: 1 }, { id: 2 }];
      const { getAllByText } = render(
        <Provider store={store}>
          <PageHeader
            translate={translate}
            workflow={workflow}
            actions={actions}
            setEditMode={toggleSpy}
          />
        </Provider>
      );
      fireEvent.click(getAllByText("View Mode")[0]);
      expect(toggleSpy).toBeCalledWith(false);
    });
  });
});
