import { BaseListPageState, BaseListPageActions } from "./types";
import {
  LOAD_ALL_PENDING,
  LOAD_ALL_SUCCESS,
  LOAD_ALL_ERROR,
  CHANGE_TAG_FILTER
} from "./constants";
import { BasesActions } from "@/resources/bases/types";

export const FILTER_ALL = -1;

export const initialState: BaseListPageState = {
  loading: true,
  error: undefined,
  tagFilter: FILTER_ALL
};

export default function(
  state = initialState,
  action: BaseListPageActions | BasesActions
): BaseListPageState {
  switch (action.type) {
    case LOAD_ALL_PENDING:
      return { ...state, loading: true };
    case LOAD_ALL_SUCCESS:
      return { ...state, loading: false };
    case LOAD_ALL_ERROR:
      return { ...state, error: action.error };
    case CHANGE_TAG_FILTER:
      return { ...state, tagFilter: action.tagID };
    default:
      return state;
  }
}
