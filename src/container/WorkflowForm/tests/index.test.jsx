import React from "react";
import { render, fireEvent } from "react-testing-library";
import { Provider } from "react-redux";
import { initialize, addTranslationForLanguage } from "react-localize-redux";
import { Notification } from "element-react";

import languages from "@/i18n/languages.json";
import english from "@/i18n/en.json";
import { store as appStore } from "@/store/configureStore";
import { WorkflowForm } from "../index";
import { initialForm } from "../reducer";

jest.mock("@/components/HocComponent", () => ({
  ProtectedScopedComponent: ({ children }) => <div>{children}</div>
}));

describe("<WorkflowForm />", () => {
  let store;

  beforeAll(() => {
    store = appStore;
    const defaultLanguage = "en";
    store.dispatch(initialize(languages, { defaultLanguage }));
    store.dispatch(addTranslationForLanguage(english, "en"));
  });

  it("should render the form", () => {
    const translate = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <WorkflowForm translate={translate} form={initialForm} />
      </Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should handles when create button was clicked", () => {
    const text = "Create";
    const translate = key => (key === "createWorkflow" ? text : "");
    const clickSpy = jest.fn();
    const { getAllByText } = render(
      <Provider store={store}>
        <WorkflowForm
          translate={translate}
          form={initialForm}
          setDialogVisible={clickSpy}
        />
      </Provider>
    );
    fireEvent.click(getAllByText(text)[0]);
    expect(clickSpy).toBeCalledTimes(1);
  });

  it("should handles when submit button was clicked", () => {
    const translate = jest.fn();
    const submitSpy = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <WorkflowForm
          translate={translate}
          form={{ ...initialForm, name: "Test" }}
          createWorkflow={submitSpy}
        />
      </Provider>
    );
    fireEvent.click(container.querySelector("button[type=submit]"));
    expect(submitSpy).toBeCalledTimes(1);
  });

  it("should handles when name input was changed", () => {
    const translate = jest.fn();
    const changeSpy = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <WorkflowForm
          translate={translate}
          form={initialForm}
          changeFormData={changeSpy}
        />
      </Provider>
    );
    const inputs = container.querySelectorAll("input[type=text]");
    fireEvent.change(inputs[0], { target: { value: "Test" } });
    expect(changeSpy).toBeCalledWith("name", "Test");
  });

  it("should handles when description input was changed", () => {
    const translate = jest.fn();
    const changeSpy = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <WorkflowForm
          translate={translate}
          form={initialForm}
          changeFormData={changeSpy}
        />
      </Provider>
    );
    const inputs = container.querySelectorAll("input[type=text]");
    fireEvent.change(inputs[1], { target: { value: "Test" } });
    expect(changeSpy).toBeCalledWith("description", "Test");
  });

  it("should handles when dialog was closed", () => {
    const translate = jest.fn();
    const closeSpy = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <WorkflowForm
          translate={translate}
          form={initialForm}
          setDialogVisible={closeSpy}
        />
      </Provider>
    );
    const closeButton = container.querySelectorAll("button[type=button]")[1];
    fireEvent.click(closeButton);
    expect(closeSpy).toBeCalledWith(false);
  });

  it("should show error notification when re-render within error", () => {
    const translate = jest.fn();
    const spy = jest.spyOn(Notification, "error");
    render(
      <Provider store={store}>
        <WorkflowForm
          translate={translate}
          form={initialForm}
          error={{ message: "Error" }}
        />
      </Provider>
    );
    expect(spy).toHaveBeenCalled();
  });
});
