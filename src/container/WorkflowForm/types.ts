import {
  SET_DIALOG_VISIBLE,
  CHANGE_FORM_DATA,
  CREATE_WORKFLOW_PENDING,
  CREATE_WORKFLOW_ERROR
} from "./constants";

export interface FormModel {
  [key: string]: string;
}

export interface WorkflowFormState {
  visible: boolean;
  submitting: boolean;
  error?: Error;
  form: FormModel;
}

export interface State {
  workflowForm: WorkflowFormState;
}

export interface SetDialogVisibleAction {
  type: typeof SET_DIALOG_VISIBLE;
  visible: boolean;
}

export interface ChangeFormDataAction {
  type: typeof CHANGE_FORM_DATA;
  key: string;
  value: any;
}

export interface CreateWorkflowPendingAction {
  type: typeof CREATE_WORKFLOW_PENDING;
}

export interface CreateWorkflowErrorAction {
  type: typeof CREATE_WORKFLOW_ERROR;
  error: Error;
}

export type WorflowFormActions =
  | SetDialogVisibleAction
  | ChangeFormDataAction
  | CreateWorkflowPendingAction
  | CreateWorkflowErrorAction;
