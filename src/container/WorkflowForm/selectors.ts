import { createSelector } from "reselect";
import { initialState } from "./reducer";
import { State, WorkflowFormState } from "./types";

export const selectWorkflowForm = (state: State) =>
  state.workflowForm || initialState;

export const makeSelectVisible = () =>
  createSelector(
    selectWorkflowForm,
    (state: WorkflowFormState) => state.visible
  );

export const makeSelectSubmitting = () =>
  createSelector(
    selectWorkflowForm,
    (state: WorkflowFormState) => state.submitting
  );

export const makeSelectForm = () =>
  createSelector(
    selectWorkflowForm,
    (state: WorkflowFormState) => state.form
  );

export const makeSelectError = () =>
  createSelector(
    selectWorkflowForm,
    (state: WorkflowFormState) => state.error
  );
