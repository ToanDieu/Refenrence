import { createSelector } from "reselect";
import { BasesState, ByIdState, AllIdsState } from "./types";

interface State {
  bases: BasesState;
}

export const selectBases = (state: State) => state.bases;

export const makeSelectById = () =>
  createSelector(
    selectBases,
    bases => bases.byId
  );

export const makeSelectAllIds = () =>
  createSelector(
    selectBases,
    bases => bases.allIds
  );

export const makeSelectBases = () =>
  createSelector(
    makeSelectById(),
    makeSelectAllIds(),
    (byId: ByIdState, allIds: AllIdsState) => allIds.map(id => byId[id])
  );
