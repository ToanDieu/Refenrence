import {
  LOAD_WORKFLOW_ACTIONS_SUCCESS,
  CREATE_WORKFLOW_TEMP_ACTION,
  UPDATE_WORKFLOW_TEMP_ACTION,
  REPLACE_WORKFLOW_TEMP_ACTION_SUCCESS,
  REMOVE_WORKFLOW_TEMP_ACTION,
  REMOVE_WORKFLOW_ACTION
} from "./constants";
import { ActionsActions, ByIdState, AllIdsState } from "./types";

export const loadWorkflowActionsSuccess = (
  actions: ByIdState,
  ids: AllIdsState
): ActionsActions => ({
  type: LOAD_WORKFLOW_ACTIONS_SUCCESS,
  actions,
  ids
});

export const createWorkflowTempAction = (actions: ByIdState, id: number) => ({
  type: CREATE_WORKFLOW_TEMP_ACTION,
  actions,
  id
});

export const updateWorkflowTempAction = (actions: ByIdState) => ({
  type: UPDATE_WORKFLOW_TEMP_ACTION,
  actions
});

export const replaceWorkflowTempActionSuccess = (
  actions: ByIdState,
  id: number
) => ({
  type: REPLACE_WORKFLOW_TEMP_ACTION_SUCCESS,
  actions,
  id
});

export const removeWorkflowTempAction = () => ({
  type: REMOVE_WORKFLOW_TEMP_ACTION
});

export const removeWorkflowAction = (id: number) => ({
  type: REMOVE_WORKFLOW_ACTION,
  id
});
