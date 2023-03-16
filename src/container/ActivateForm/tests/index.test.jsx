import React from "react";
import { render, fireEvent } from "react-testing-library";
import { Provider } from "react-redux";
import { initialize, addTranslationForLanguage } from "react-localize-redux";
import { Notification } from "element-react";

import languages from "@/i18n/languages.json";
import english from "@/i18n/en.json";
import { store as appStore } from "@/store/configureStore";
import { ActivateForm } from "../index";

describe("<ActivateForm />", () => {
  let store;
  const translate = jest.fn();

  beforeAll(() => {
    store = appStore;
    const defaultLanguage = "en";
    store.dispatch(initialize(languages, { defaultLanguage }));
    store.dispatch(addTranslationForLanguage(english, "en"));
  });

  it("should render the form", () => {
    const workflow = { name: "Test" };
    const { container } = render(
      <Provider store={store}>
        <ActivateForm translate={translate} workflow={workflow} />
      </Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should handles when activate button was clicked", () => {
    const workflow = { name: "Test" };
    const clickSpy = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <ActivateForm
          translate={translate}
          workflow={workflow}
          setDialogVisible={clickSpy}
        />
      </Provider>
    );
    fireEvent.click(container.lastChild);
    expect(clickSpy).toBeCalledWith(true);
  });

  it("should handles when submit button was clicked", () => {
    const workflow = { name: "Test" };
    const submitSpy = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <ActivateForm
          translate={translate}
          workflow={workflow}
          activateWorkflow={submitSpy}
        />
      </Provider>
    );
    fireEvent.click(container.querySelector("button[type=submit]"));
    expect(submitSpy).toBeCalledTimes(1);
  });

  it("should handles when dialog was closed", () => {
    const workflow = { name: "Test" };
    const closeSpy = jest.fn();
    const { container } = render(
      <Provider store={store}>
        <ActivateForm
          translate={translate}
          workflow={workflow}
          setDialogVisible={closeSpy}
        />
      </Provider>
    );
    const closeButton = container.querySelector("button.el-dialog__headerbtn");
    fireEvent.click(closeButton);
    expect(closeSpy).toBeCalledWith(false);
  });

  it("should show error notification when re-render within error", () => {
    const workflow = { name: "Test" };
    const spy = jest.spyOn(Notification, "error");
    render(
      <Provider store={store}>
        <ActivateForm
          translate={translate}
          workflow={workflow}
          error={{ message: "Error" }}
        />
      </Provider>
    );
    expect(spy).toHaveBeenCalled();
  });

  it("should show success notification when re-render within activated", () => {
    const workflow = { name: "Test" };
    const spy = jest.spyOn(Notification, "error");
    render(
      <Provider store={store}>
        <ActivateForm translate={translate} workflow={workflow} activated />
      </Provider>
    );
    expect(spy).toHaveBeenCalled();
  });
});
