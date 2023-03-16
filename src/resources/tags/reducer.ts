import { combineReducers } from "redux";
import { union } from "lodash/fp";

import { LOAD_TAGS_SUCCESS, CREATE_TAG_SUCCESS } from "./constants";
import { ByIdState, AllIdsState, TagsActions } from "./types";

export const byId = (state: ByIdState = {}, action: TagsActions): ByIdState => {
  switch (action.type) {
    case LOAD_TAGS_SUCCESS:
      return { ...state, ...action.tags };
    case CREATE_TAG_SUCCESS:
      return { ...state, ...action.tags };
    default:
      return state;
  }
};

export const allIds = (
  state: AllIdsState = [],
  action: TagsActions
): AllIdsState => {
  switch (action.type) {
    case LOAD_TAGS_SUCCESS:
      return union(action.ids)(state);
    case CREATE_TAG_SUCCESS:
      return [...state, action.id];
    default:
      return state;
  }
};

export default combineReducers({
  byId,
  allIds
} as any); // TODO: Upgrade redux
