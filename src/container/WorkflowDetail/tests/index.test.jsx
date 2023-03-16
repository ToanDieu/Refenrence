import React from "react";
import { render } from "react-testing-library";
import { Provider } from "react-redux";
import { initialize, addTranslationForLanguage } from "react-localize-redux";
import { Notification } from "element-react";

import languages from "@/i18n/languages.json";
import english from "@/i18n/en.json";
import { store as appStore } from "@/store/configureStore";
import { WorkflowDetail } from "../index";

describe("<WorkflowDetail />", () => {
  let store;

  beforeAll(() => {
    store = appStore;
    const defaultLanguage = "en";
    store.dispatch(initialize(languages, { defaultLanguage }));
    store.dispatch(addTranslationForLanguage(english, "en"));
  });

  it("should render the loading indicator when its loading", () => {
    const { container } = render(
      <Provider store={store}>
        <WorkflowDetail loading />
      </Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render the create workflow form & button when there is no workflow", () => {
    const { container } = render(
      <Provider store={store}>
        <WorkflowDetail loading={false} />
      </Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render the add action button when there is no actions yet", () => {
    const workflow = { id: 1, name: "Test workflow", initialActionID: 1 };
    const actions = [];
    const translate = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <WorkflowDetail
          loading={false}
          workflow={workflow}
          actions={actions}
          translate={translate}
        />
      </Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render the workflow graph within actions/triggers", () => {
    const workflow = { id: 1, name: "Test workflow", initialActionID: 1 };
    const actions = [
      { id: 1, acceptActionID: 2, rejectActionID: 3, actionType: "Branch" },
      { id: 2, acceptActionID: undefined, rejectActionID: undefined },
      { id: 3, acceptActionID: undefined, rejectActionID: undefined }
    ];
    const { container } = render(
      <Provider store={store}>
        <WorkflowDetail loading={false} workflow={workflow} actions={actions} />
      </Provider>
    );
    expect(container.firstChild.lastChild).toMatchSnapshot();
  });

  it("should fetch data on mount", () => {
    const spy = jest.fn();
    render(
      <Provider store={store}>
        <WorkflowDetail baseID={1} fetchData={spy} />
      </Provider>
    );
    expect(spy).toHaveBeenCalled();
  });

  it("should show error notification when re-render within error", () => {
    const spy = jest.spyOn(Notification, "error");
    render(
      <Provider store={store}>
        <WorkflowDetail error={{ message: "Error" }} />
      </Provider>
    );
    expect(spy).toHaveBeenCalled();
  });
});
