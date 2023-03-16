import { createSelector } from "reselect";
import { TagsState, ByIdState, AllIdsState } from "./types";

interface State {
  tags: TagsState;
}

export const selectTags = (state: State) => state.tags;

export const makeSelectById = () =>
  createSelector(
    selectTags,
    tags => tags.byId
  );

export const makeSelectAllIds = () =>
  createSelector(
    selectTags,
    tags => tags.allIds
  );

export const makeSelectTags = () =>
  createSelector(
    makeSelectById(),
    makeSelectAllIds(),
    (byId: ByIdState, allIds: AllIdsState) => allIds.map(id => byId[id])
  );
