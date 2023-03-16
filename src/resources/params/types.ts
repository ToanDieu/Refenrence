import { ParamMedia } from "../params";
import { LOAD_BASE_PARAMS_SUCCESS } from "./constants";

export type ByIdState = {
  [id: number]: ParamMedia;
};

export type AllIdsState = number[];

export interface ParamsState {
  byId: ByIdState;
  allIds: AllIdsState;
}

export interface LoadBaseParamsSuccess {
  type: typeof LOAD_BASE_PARAMS_SUCCESS;
  params: ByIdState;
  ids: AllIdsState;
}

export type ParamsActions = LoadBaseParamsSuccess;
