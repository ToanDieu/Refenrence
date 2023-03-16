import { ActivateFormState, ActivateFormActions } from "./types";
import {
  CLEANUP_NOTIFICATIONS,
  SET_DIALOG_VISIBLE,
  ACTIVATE_WORKFLOW_PENDING,
  ACTIVATE_WORKFLOW_SUCCESS,
  ACTIVATE_WORKFLOW_ERROR
} from "./constants";

export const initialState: ActivateFormState = {
  visible: false,
  submitting: false,
  error: undefined,
  activated: false
};

export default function(
  state = initialState,
  action: ActivateFormActions
): ActivateFormState {
  switch (action.type) {
    case CLEANUP_NOTIFICATIONS:
      return { ...state, error: undefined, activated: false };
    case SET_DIALOG_VISIBLE:
      return { ...state, visible: action.visible };
    case ACTIVATE_WORKFLOW_PENDING:
      return { ...state, submitting: true, error: undefined };
    case ACTIVATE_WORKFLOW_SUCCESS:
      return { ...state, submitting: false, activated: true, visible: false };
    case ACTIVATE_WORKFLOW_ERROR:
      return { ...state, submitting: false, error: action.error };
    default:
      return state;
  }
}
