import { LOAD_BASE_PARAMS_SUCCESS } from "./constants";
import { ByIdState, AllIdsState, ParamsActions } from "./types";

export const loadBaseParamsSuccess = (
  params: ByIdState,
  ids: AllIdsState
): ParamsActions => ({
  type: LOAD_BASE_PARAMS_SUCCESS,
  params,
  ids
});
