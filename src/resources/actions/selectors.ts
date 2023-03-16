import { createSelector } from "reselect";
import { ActionsState, ByIdState, AllIdsState } from "./types";

interface State {
  actions: ActionsState;
}

export const selectActions = (state: State) => state.actions;

export const makeSelectById = () =>
  createSelector(
    selectActions,
    actions => actions.byId
  );

export const makeSelectAllIds = () =>
  createSelector(
    selectActions,
    actions => actions.allIds
  );

export const makeSelectActions = () =>
  createSelector(
    makeSelectById(),
    makeSelectAllIds(),
    (byId: ByIdState, allIds: AllIdsState) => allIds.map(id => byId[id])
  );
