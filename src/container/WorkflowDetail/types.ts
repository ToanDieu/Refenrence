import {
  LOAD_WORKFLOWS_PENDING,
  LOAD_WORKFLOWS_ERROR,
  LOAD_WORKFLOW_ACTIONS_ERROR,
  SET_EDIT_MODE,
  CREATE_WORKFLOW_ACTION_ERROR,
  UPDATE_WORKFLOW_ACTION_ERROR,
  SET_LAST_SAVE,
  SET_BASE_ID,
  DELETE_WORKFLOW_ACTION_ERROR
} from "./constants";

export interface WorkFlowDetailState {
  baseID?: number;
  loading: boolean;
  error?: Error;
  isEditMode: boolean;
  lastSave?: number;
  activating: boolean;
}

export interface State {
  workflowDetail: WorkFlowDetailState;
}

export interface SetBaseIDAction {
  type: typeof SET_BASE_ID;
  baseID: number;
}

export interface LoadWorkflowsAction {
  type: typeof LOAD_WORKFLOWS_PENDING;
}

export interface LoadWorkflowsErrorAction {
  type: typeof LOAD_WORKFLOWS_ERROR;
  error: Error;
}

export interface LoadWorkflowActionsErrorAction {
  type: typeof LOAD_WORKFLOW_ACTIONS_ERROR;
  error: Error;
}

export interface SetEditModeAction {
  type: typeof SET_EDIT_MODE;
  mode: boolean;
}

export interface CreateWorkflowActionErrorAction {
  type: typeof CREATE_WORKFLOW_ACTION_ERROR;
  error: Error;
}

export interface UpdateWorkflowActionErrorAction {
  type: typeof UPDATE_WORKFLOW_ACTION_ERROR;
  error: Error;
}

export interface DeleteWorkflowActionErrorAction {
  type: typeof DELETE_WORKFLOW_ACTION_ERROR;
  error: Error;
}

export interface SetLastSaveAction {
  type: typeof SET_LAST_SAVE;
  time: number;
}

export type WorkFlowDetailActions =
  | SetBaseIDAction
  | LoadWorkflowsAction
  | LoadWorkflowsErrorAction
  | LoadWorkflowActionsErrorAction
  | SetEditModeAction
  | CreateWorkflowActionErrorAction
  | UpdateWorkflowActionErrorAction
  | DeleteWorkflowActionErrorAction
  | SetLastSaveAction;
