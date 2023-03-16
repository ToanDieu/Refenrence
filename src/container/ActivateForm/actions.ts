import { ActivateFormActions } from "./types";

import {
  CLEANUP_NOTIFICATIONS,
  SET_DIALOG_VISIBLE,
  ACTIVATE_WORKFLOW_PENDING,
  ACTIVATE_WORKFLOW_ERROR,
  ACTIVATE_WORKFLOW_SUCCESS
} from "./constants";

export const cleanupNotifications = (): ActivateFormActions => ({
  type: CLEANUP_NOTIFICATIONS
});

export const setDialogVisible = (visible: boolean): ActivateFormActions => ({
  type: SET_DIALOG_VISIBLE,
  visible
});

export const activateWorkflowPending = (): ActivateFormActions => ({
  type: ACTIVATE_WORKFLOW_PENDING
});

export const activateWorkflowSuccess = (): ActivateFormActions => ({
  type: ACTIVATE_WORKFLOW_SUCCESS
});

export const activateWorkflowError = (error: Error): ActivateFormActions => ({
  type: ACTIVATE_WORKFLOW_ERROR,
  error
});
