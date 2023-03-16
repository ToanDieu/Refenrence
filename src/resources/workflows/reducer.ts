import { combineReducers } from "redux";
import { union } from "lodash/fp";

import {
  LOAD_WORKFLOWS_SUCCESS,
  CREATE_WORKFLOW_SUCCESS,
  UPDATE_WORKFLOW_SUCCESS
} from "./constants";
import { ByIdState, AllIdsState, WorkflowsActions } from "./types";
import { ActionsActions } from "../actions/types";

export const byId = (
  state: ByIdState = {},
  action: WorkflowsActions | ActionsActions
): ByIdState => {
  switch (action.type) {
    case LOAD_WORKFLOWS_SUCCESS:
      return { ...state, ...action.workflows };
    case CREATE_WORKFLOW_SUCCESS:
      return { ...state, ...action.workflows };
    case UPDATE_WORKFLOW_SUCCESS:
      return { ...state, ...action.workflows };
    default:
      return state;
  }
};

export const allIds = (
  state: AllIdsState = [],
  action: WorkflowsActions
): AllIdsState => {
  switch (action.type) {
    case LOAD_WORKFLOWS_SUCCESS:
      return union(action.ids)(state);
    case CREATE_WORKFLOW_SUCCESS:
      return [...state, action.id];
    default:
      return state;
  }
};

export default combineReducers({
  byId,
  allIds
} as any); // TODO: Upgrade redux
