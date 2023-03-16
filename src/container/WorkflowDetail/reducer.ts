import { LOAD_WORKFLOWS_SUCCESS } from "@/resources/workflows/constants";
import { WorkflowsActions } from "@/resources/workflows/types";
import { LOAD_WORKFLOW_ACTIONS_SUCCESS } from "@/resources/actions/constants";
import { ActionsActions } from "@/resources/actions/types";
import { WorkFlowDetailState, WorkFlowDetailActions } from "./types";
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

export const initialState: WorkFlowDetailState = {
  baseID: undefined,
  loading: false,
  error: undefined,
  isEditMode: true,
  lastSave: undefined,
  activating: false
};

export default function(
  state = initialState,
  action: WorkFlowDetailActions | WorkflowsActions | ActionsActions
): WorkFlowDetailState {
  switch (action.type) {
    case SET_BASE_ID:
      return { ...state, baseID: action.baseID };
    case LOAD_WORKFLOWS_PENDING:
      return {
        ...state,
        loading: true
      };
    // Continue loading if there is at least a workflow
    case LOAD_WORKFLOWS_SUCCESS: {
      return { ...state, loading: action.ids.length > 0 };
    }
    case LOAD_WORKFLOW_ACTIONS_SUCCESS:
      return { ...state, loading: false };
    case SET_EDIT_MODE:
      return { ...state, isEditMode: action.mode };
    case LOAD_WORKFLOWS_ERROR:
    case LOAD_WORKFLOW_ACTIONS_ERROR:
    case CREATE_WORKFLOW_ACTION_ERROR:
    case UPDATE_WORKFLOW_ACTION_ERROR:
    case DELETE_WORKFLOW_ACTION_ERROR:
      return { ...state, error: action.error };
    case SET_LAST_SAVE:
      return { ...state, lastSave: action.time };
    default:
      return state;
  }
}
