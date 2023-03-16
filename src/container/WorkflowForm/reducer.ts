import { CREATE_WORKFLOW_SUCCESS } from "@/resources/workflows/constants";
import { WorkflowsActions } from "@/resources/workflows/types";
import { WorkflowFormState, WorflowFormActions } from "./types";
import {
  SET_DIALOG_VISIBLE,
  CHANGE_FORM_DATA,
  CREATE_WORKFLOW_PENDING,
  CREATE_WORKFLOW_ERROR
} from "./constants";

export const initialForm = {
  name: "",
  description: ""
};

export const initialState: WorkflowFormState = {
  visible: false,
  submitting: false,
  error: undefined,
  form: initialForm
};

export default function(
  state = initialState,
  action: WorflowFormActions | WorkflowsActions
): WorkflowFormState {
  switch (action.type) {
    case SET_DIALOG_VISIBLE:
      return { ...state, visible: action.visible };
    case CHANGE_FORM_DATA:
      return {
        ...state,
        form: {
          ...state.form,
          [action.key]: action.value
        }
      };
    case CREATE_WORKFLOW_PENDING:
      return { ...state, submitting: true, error: undefined };
    case CREATE_WORKFLOW_SUCCESS:
      return { ...state, submitting: false, form: initialForm, visible: false };
    case CREATE_WORKFLOW_ERROR:
      return { ...state, submitting: false, error: action.error };
    default:
      return state;
  }
}
