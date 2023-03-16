import { BaseMedia } from "../bases";
import {
  LOAD_BASES_SUCCESS,
  UPDATE_BASE_SUCCESS,
  CREATE_BASE_SUCCESS
} from "./constants";

export type ByIdState = {
  [id: number]: BaseMedia;
};

export type AllIdsState = number[];

export interface BasesState {
  byId: ByIdState;
  allIds: AllIdsState;
}

export interface LoadBasesSuccess {
  type: typeof LOAD_BASES_SUCCESS;
  bases: ByIdState;
  ids: AllIdsState;
}

export interface CreateBaseSuccess {
  type: typeof CREATE_BASE_SUCCESS;
  bases: ByIdState;
  id: number;
}

export interface UpdateBaseSuccess {
  type: typeof UPDATE_BASE_SUCCESS;
  bases: ByIdState;
}

export type BasesActions =
  | LoadBasesSuccess
  | CreateBaseSuccess
  | UpdateBaseSuccess;
