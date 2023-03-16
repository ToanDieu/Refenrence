import { createSelector } from "reselect";
import { WorkflowsState, ByIdState, AllIdsState } from "./types";

interface State {
  workflows: WorkflowsState;
}

export const selectWorkflows = (state: State) => state.workflows;

export const makeSelectById = () =>
  createSelector(
    selectWorkflows,
    workflows => workflows.byId
  );

export const makeSelectAllIds = () =>
  createSelector(
    selectWorkflows,
    workflows => workflows.allIds
  );

export const makeSelectWorkflows = () =>
  createSelector(
    makeSelectById(),
    makeSelectAllIds(),
    (byId: ByIdState, allIds: AllIdsState) => allIds.map(id => byId[id])
  );
