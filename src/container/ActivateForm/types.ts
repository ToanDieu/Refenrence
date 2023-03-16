import {
  CLEANUP_NOTIFICATIONS,
  SET_DIALOG_VISIBLE,
  ACTIVATE_WORKFLOW_PENDING,
  ACTIVATE_WORKFLOW_SUCCESS,
  ACTIVATE_WORKFLOW_ERROR
} from "./constants";

export interface ActivateFormState {
  visible: boolean;
  submitting: boolean;
  activated: boolean;
  error?: Error;
}

export interface State {
  activateForm: ActivateFormState;
}

export interface CleanupNotificationsAction {
  type: typeof CLEANUP_NOTIFICATIONS;
}

export interface SetDialogVisibleAction {
  type: typeof SET_DIALOG_VISIBLE;
  visible: boolean;
}

export interface ActivateWorkflowPendingAction {
  type: typeof ACTIVATE_WORKFLOW_PENDING;
}

export interface ActivateWorkflowSuccessAction {
  type: typeof ACTIVATE_WORKFLOW_SUCCESS;
}

export interface ActivateWorkflowErrorAction {
  type: typeof ACTIVATE_WORKFLOW_ERROR;
  error: Error;
}

export type ActivateFormActions =
  | CleanupNotificationsAction
  | SetDialogVisibleAction
  | ActivateWorkflowPendingAction
  | ActivateWorkflowSuccessAction
  | ActivateWorkflowErrorAction;
