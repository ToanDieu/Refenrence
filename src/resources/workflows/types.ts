import { WorkflowMedia } from "../workflows";
import {
  LOAD_WORKFLOWS_SUCCESS,
  CREATE_WORKFLOW_SUCCESS,
  UPDATE_WORKFLOW_SUCCESS
} from "./constants";

export type ByIdState = {
  [id: number]: WorkflowMedia;
};

export type AllIdsState = number[];

export interface WorkflowsState {
  byId: ByIdState;
  allIds: AllIdsState;
}

export interface LoadWorkflowsSuccessAction {
  type: typeof LOAD_WORKFLOWS_SUCCESS;
  workflows: ByIdState;
  ids: AllIdsState;
}

export interface CreateWorkflowSuccessAction {
  type: typeof CREATE_WORKFLOW_SUCCESS;
  workflows: ByIdState;
  id: number;
}

export interface UpdateWorkflowSuccessAction {
  type: typeof UPDATE_WORKFLOW_SUCCESS;
  workflows: ByIdState;
}

export type WorkflowsActions =
  | LoadWorkflowsSuccessAction
  | CreateWorkflowSuccessAction
  | UpdateWorkflowSuccessAction;
