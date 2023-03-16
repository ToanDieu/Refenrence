import {
  LOAD_ALL_PENDING,
  LOAD_ALL_ERROR,
  LOAD_ALL_SUCCESS,
  CHANGE_TAG_FILTER
} from "./constants";

export interface BaseListPageState {
  loading: boolean;
  error?: Error;
  tagFilter: number;
}

export interface State {
  baseListPage: BaseListPageState;
}

export interface LoadAllPendingAction {
  type: typeof LOAD_ALL_PENDING;
}

export interface LoadAllSuccessAction {
  type: typeof LOAD_ALL_SUCCESS;
}

export interface LoadAllErrorAction {
  type: typeof LOAD_ALL_ERROR;
  error: Error;
}

export interface ChangeTagFilterAction {
  type: typeof CHANGE_TAG_FILTER;
  tagID: number;
}

export type BaseListPageActions =
  | LoadAllPendingAction
  | LoadAllSuccessAction
  | LoadAllErrorAction
  | ChangeTagFilterAction;
