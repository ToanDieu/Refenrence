import { ActionMedia } from "../actions";
import {
  LOAD_WORKFLOW_ACTIONS_SUCCESS,
  CREATE_WORKFLOW_TEMP_ACTION,
  UPDATE_WORKFLOW_TEMP_ACTION,
  REPLACE_WORKFLOW_TEMP_ACTION_SUCCESS,
  REMOVE_WORKFLOW_TEMP_ACTION
} from "./constants";

export type ByIdState = {
  [id: number]: ActionMedia;
};

export type AllIdsState = number[];

export interface ActionsState {
  byId: ByIdState;
  allIds: AllIdsState;
}

export interface LoadWorkflowActionsSuccess {
  type: typeof LOAD_WORKFLOW_ACTIONS_SUCCESS;
  actions: ByIdState;
  ids: AllIdsState;
}

export interface CreateWorkflowTempActionAction {
  type: typeof CREATE_WORKFLOW_TEMP_ACTION;
  actions: ByIdState;
  id: number;
}

export interface UpdateWorkflowTempActionAction {
  type: typeof UPDATE_WORKFLOW_TEMP_ACTION;
  actions: ByIdState;
}

export interface ReplaceWorkflowTempActionSuccessAction {
  type: typeof REPLACE_WORKFLOW_TEMP_ACTION_SUCCESS;
  actions: ByIdState;
  id: number;
}

export interface RemoveWorkflowTempActionAction {
  type: typeof REMOVE_WORKFLOW_TEMP_ACTION;
}

export type ActionsActions =
  | LoadWorkflowActionsSuccess
  | CreateWorkflowTempActionAction
  | UpdateWorkflowTempActionAction
  | ReplaceWorkflowTempActionSuccessAction
  | RemoveWorkflowTempActionAction;
