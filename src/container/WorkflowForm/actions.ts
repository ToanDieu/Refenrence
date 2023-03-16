import { WorflowFormActions } from "./types";

import {
  SET_DIALOG_VISIBLE,
  CHANGE_FORM_DATA,
  CREATE_WORKFLOW_PENDING,
  CREATE_WORKFLOW_ERROR
} from "./constants";

export const setDialogVisible = (visible: boolean): WorflowFormActions => ({
  type: SET_DIALOG_VISIBLE,
  visible
});

export const changeFormData = (
  key: string,
  value: any
): WorflowFormActions => ({
  type: CHANGE_FORM_DATA,
  key,
  value
});

export const createWorkflowPending = (): WorflowFormActions => ({
  type: CREATE_WORKFLOW_PENDING
});

export const createWorkflowError = (error: Error): WorflowFormActions => ({
  type: CREATE_WORKFLOW_ERROR,
  error
});
