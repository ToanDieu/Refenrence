import {
  LOAD_WORKFLOWS_SUCCESS,
  CREATE_WORKFLOW_SUCCESS,
  UPDATE_WORKFLOW_SUCCESS
} from "./constants";
import { WorkflowsActions, ByIdState, AllIdsState } from "./types";

export const loadWorkflowsSuccess = (
  workflows: ByIdState,
  ids: AllIdsState
): WorkflowsActions => ({
  type: LOAD_WORKFLOWS_SUCCESS,
  workflows,
  ids
});

export const createWorkflowSuccess = (workflows: ByIdState, id: number) => ({
  type: CREATE_WORKFLOW_SUCCESS,
  workflows,
  id
});

export const updateWorkflowSuccess = (workflows: ByIdState) => ({
  type: UPDATE_WORKFLOW_SUCCESS,
  workflows
});
