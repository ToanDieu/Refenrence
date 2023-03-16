import { createSelector } from "reselect";
import { initialState } from "./reducer";
import { State, ActivateFormState } from "./types";

export const selectActivateForm = (state: State) =>
  state.activateForm || initialState;

export const makeSelectVisible = () =>
  createSelector(
    selectActivateForm,
    (state: ActivateFormState) => state.visible
  );

export const makeSelectSubmitting = () =>
  createSelector(
    selectActivateForm,
    (state: ActivateFormState) => state.submitting
  );

export const makeSelectActivated = () =>
  createSelector(
    selectActivateForm,
    (state: ActivateFormState) => state.activated
  );

export const makeSelectError = () =>
  createSelector(
    selectActivateForm,
    (state: ActivateFormState) => state.error
  );
