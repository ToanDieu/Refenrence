import React from "react";
import { render } from "react-testing-library";
import { Provider } from "react-redux";
import { initialize, addTranslationForLanguage } from "react-localize-redux";

import languages from "@/i18n/languages.json";
import english from "@/i18n/en.json";
import { store as appStore } from "@/store/configureStore";
import { BaseListPage, mapDispatchToProps } from "../index";

describe("<BaseListPage />", () => {
  let store;

  beforeAll(() => {
    store = appStore;
    const defaultLanguage = "en";
    store.dispatch(initialize(languages, { defaultLanguage }));
    store.dispatch(addTranslationForLanguage(english, "en"));
  });

  it("should render and match the snapshot", () => {
    const { container } = render(
      <Provider store={store}>
        <BaseListPage bases={[]} translate={jest.fn()} />
      </Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render and match the snapshot on loading", () => {
    const { container } = render(
      <Provider store={store}>
        <BaseListPage loading bases={[]} translate={jest.fn()} />
      </Provider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should fetch data on mount", () => {
    const spy = jest.fn();
    render(
      <Provider store={store}>
        <BaseListPage
          typeID={1}
          bases={[]}
          fetchAll={spy}
          translate={jest.fn()}
        />
      </Provider>
    );
    expect(spy).toHaveBeenCalled();
  });

  describe("mapDispatchToProps", () => {
    describe("fetchAll", () => {
      it("should be injected", () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.fetchAll).toBeDefined();
      });

      it("should dispatch fetchAll when called", () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const typeID = 1;
        result.fetchAll(typeID);
        expect(dispatch).toHaveBeenCalled();
      });
    });
  });
});
