import { BaseListPageActions } from "./types";
import {
  LOAD_ALL_PENDING,
  LOAD_ALL_SUCCESS,
  LOAD_ALL_ERROR,
  CHANGE_TAG_FILTER
} from "./constants";

export const loadAllPending = (): BaseListPageActions => ({
  type: LOAD_ALL_PENDING
});

export const loadAllSuccess = (): BaseListPageActions => ({
  type: LOAD_ALL_SUCCESS
});

export const loadAllError = (error: Error): BaseListPageActions => ({
  type: LOAD_ALL_ERROR,
  error
});

export const changeTagFilter = (tagID: number): BaseListPageActions => ({
  type: CHANGE_TAG_FILTER,
  tagID
});
