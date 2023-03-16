import { combineReducers } from "redux";
import { set, union } from "lodash/fp";
import { dissocPath, pathOr, assocPath } from "ramda";

import {
  LOAD_WORKFLOW_ACTIONS_SUCCESS,
  CREATE_WORKFLOW_TEMP_ACTION,
  UPDATE_WORKFLOW_TEMP_ACTION,
  REMOVE_WORKFLOW_TEMP_ACTION,
  REMOVE_WORKFLOW_ACTION
} from "./constants";

import {
  ByIdState,
  AllIdsState,
  ActionsActions,
  CreateWorkflowTempActionAction,
  ReplaceWorkflowTempActionSuccessAction
} from "./types";

const linkedChildNodeState = (
  state: ByIdState = {},
  action:
    | CreateWorkflowTempActionAction
    | ReplaceWorkflowTempActionSuccessAction
) => {
  const { actions, id } = action;
  const newState = { ...state, ...actions };
  // Set accept/reject action id of new action's parent
  const { assignParent } = actions[id];
  if (assignParent) {
    const { id: parentId, branching } = assignParent;
    const childProp =
      branching === "reject" ? "rejectActionID" : "acceptActionID";
    if (parentId) {
      return set([parentId, childProp], id)(newState);
    }
  }
  return newState;
};

export const byId = (
  state: ByIdState = {},
  action: ActionsActions
): ByIdState => {
  switch (action.type) {
    case LOAD_WORKFLOW_ACTIONS_SUCCESS:
      return { ...state, ...action.actions };
    case CREATE_WORKFLOW_TEMP_ACTION: {
      return linkedChildNodeState(state, action);
    }
    case UPDATE_WORKFLOW_TEMP_ACTION:
      return { ...state, ...action.actions };
    // case REPLACE_WORKFLOW_TEMP_ACTION_SUCCESS: {
    //   const newState = dissocPath(["-1"], linkedChildNodeState(state, action));

    //   return { ...newState, ...action.actions };
    // }
    case REMOVE_WORKFLOW_TEMP_ACTION: {
      const parentId = pathOr(0, ["-1", "assignParent", "id"], state);
      const branch = pathOr(0, ["-1", "assignParent", "branching"], state);

      const currentChild = pathOr(
        undefined,
        [parentId, `${branch}ActionID`],
        state
      );

      let changedParentData = state;
      if (currentChild === -1) {
        changedParentData = assocPath(
          [parentId, `${branch}ActionID`],
          undefined,
          state
        );
      }

      return dissocPath(["-1"], changedParentData);
    }
    default:
      return state;
  }
};

export const allIds = (
  state: AllIdsState = [],
  action: ActionsActions
): AllIdsState => {
  switch (action.type) {
    case LOAD_WORKFLOW_ACTIONS_SUCCESS:
      return union(action.ids)(state);
    case CREATE_WORKFLOW_TEMP_ACTION:
      return [...state, action.id];
    // case REPLACE_WORKFLOW_TEMP_ACTION_SUCCESS: {
    //   const newState = state.filter(id => id !== -1);
    //   return [...newState, action.id];
    // }
    case REMOVE_WORKFLOW_TEMP_ACTION: {
      const newState = state.filter(id => id !== -1);
      return newState;
    }
    case REMOVE_WORKFLOW_ACTION:
      return state.filter(id => id !== action.id);
    default:
      return state;
  }
};

export default combineReducers({
  byId,
  allIds
} as any); // TODO: Upgrade redux
