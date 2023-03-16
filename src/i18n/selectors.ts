import { createSelector } from "reselect";
import { getTranslate, getActiveLanguage } from "react-localize-redux";

export const selectLocale = (state: any) => state.locale;

export const makeSelectTranslate = () =>
  createSelector(
    selectLocale,
    locale => getTranslate(locale)
  );

export const makeSelectCurrentLanguage = () =>
  createSelector(
    selectLocale,
    locale => getActiveLanguage(locale).code
  );
