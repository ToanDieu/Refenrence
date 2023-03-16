/* eslint-disable import/default */
import React from "react";
import { render } from "react-dom";
import { initialize, addTranslationForLanguage } from "react-localize-redux";
import { persistStore } from "redux-persist";

import Root from "./container/Root";

import { store, history } from "./store/configureStore";

import languages from "./i18n/languages.json";
import english from "./i18n/en.json";
import deutsch from "./i18n/de.json";

import "./assets/style/main.scss";
import "./icons.font";

const persistor = persistStore(store);

const defaultLanguage = localStorage.getItem("language") || languages[0].code;
store.dispatch(initialize(languages, { defaultLanguage }));
store.dispatch(addTranslationForLanguage(english, "en"));
store.dispatch(addTranslationForLanguage(deutsch, "de"));

render(
  <Root store={store} history={history} persistor={persistor} />,
  document.getElementById("app")
);
