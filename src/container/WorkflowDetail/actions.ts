import { normalize } from "normalizr";
import { ActionMedia } from "@/resources/actions";
import { updateWorkflowTempAction } from "@/resources/actions/actions";
import * as actionSchema from "@/resources/actions/schema";
import { WorkFlowDetailActions } from "./types";

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

export const setBaseID = (id: number): WorkFlowDetailActions => ({
  type: SET_BASE_ID,
  baseID: id
});

export const loadWorkflows = (): WorkFlowDetailActions => ({
  type: LOAD_WORKFLOWS_PENDING
});

export const loadWorkflowsError = (error: Error): WorkFlowDetailActions => ({
  type: LOAD_WORKFLOWS_ERROR,
  error
});

export const updateAction = (actionData: ActionMedia) => {
  const { entities } = normalize(actionData, actionSchema.action);
  const { actions = {} } = entities;
  return updateWorkflowTempAction(actions);
};

export const loadWorkflowActionsError = (
  error: Error
): WorkFlowDetailActions => ({
  type: LOAD_WORKFLOW_ACTIONS_ERROR,
  error
});

export const setEditMode = (mode: boolean): WorkFlowDetailActions => ({
  type: SET_EDIT_MODE,
  mode
});

export const createWorkflowActionError = (
  error: Error
): WorkFlowDetailActions => ({
  type: CREATE_WORKFLOW_ACTION_ERROR,
  error
});

export const updateWorkflowActionError = (
  error: Error
): WorkFlowDetailActions => ({
  type: UPDATE_WORKFLOW_ACTION_ERROR,
  error
});

export const deleteWorkflowActionError = (
  error: Error
): WorkFlowDetailActions => ({
  type: DELETE_WORKFLOW_ACTION_ERROR,
  error
});

export const setLastSave = (time: number): WorkFlowDetailActions => ({
  type: SET_LAST_SAVE,
  time
});
