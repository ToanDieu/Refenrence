import { combineReducers } from "redux";
import { union } from "lodash/fp";

import {
  LOAD_BASES_SUCCESS,
  UPDATE_BASE_SUCCESS,
  CREATE_BASE_SUCCESS
} from "./constants";
import { ByIdState, AllIdsState, BasesActions } from "./types";

export const byId = (
  state: ByIdState = {},
  action: BasesActions
): ByIdState => {
  switch (action.type) {
    case LOAD_BASES_SUCCESS:
      return { ...state, ...action.bases };
    case CREATE_BASE_SUCCESS:
      return { ...state, ...action.bases };
    case UPDATE_BASE_SUCCESS:
      return { ...state, ...action.bases };
    default:
      return state;
  }
};

export const allIds = (
  state: AllIdsState = [],
  action: BasesActions
): AllIdsState => {
  switch (action.type) {
    case LOAD_BASES_SUCCESS:
      return union(action.ids)(state);
    case CREATE_BASE_SUCCESS:
      return [...state, action.id];
    default:
      return state;
  }
};

export default combineReducers({
  byId,
  allIds
} as any); // TODO: Upgrade redux
