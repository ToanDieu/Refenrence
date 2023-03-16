import { createSelector } from "reselect";
import { ParamsState, ByIdState, AllIdsState } from "./types";

interface State {
  params: ParamsState;
}

export const selectParams = (state: State) => state.params;

export const makeSelectById = () =>
  createSelector(
    selectParams,
    params => params.byId
  );

export const makeSelectAllIds = () =>
  createSelector(
    selectParams,
    params => params.allIds
  );

export const makeSelectParams = () =>
  createSelector(
    makeSelectById(),
    makeSelectAllIds(),
    (byId: ByIdState, allIds: AllIdsState) => allIds.map(id => byId[id])
  );
