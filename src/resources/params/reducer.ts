import { combineReducers } from "redux";
import { union } from "lodash/fp";

import { LOAD_BASE_PARAMS_SUCCESS } from "./constants";
import { ByIdState, AllIdsState, ParamsActions } from "./types";

export const byId = (
  state: ByIdState = {},
  action: ParamsActions
): ByIdState => {
  switch (action.type) {
    case LOAD_BASE_PARAMS_SUCCESS:
      return { ...state, ...action.params };
    default:
      return state;
  }
};

export const allIds = (
  state: AllIdsState = [],
  action: ParamsActions
): AllIdsState => {
  switch (action.type) {
    case LOAD_BASE_PARAMS_SUCCESS:
      return union(action.ids)(state);
    default:
      return state;
  }
};

export default combineReducers({
  byId,
  allIds
} as any); // TODO: Upgrade redux
