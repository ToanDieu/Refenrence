import {
  LOAD_BASES_SUCCESS,
  UPDATE_BASE_SUCCESS,
  CREATE_BASE_SUCCESS
} from "./constants";
import { ByIdState, AllIdsState, BasesActions } from "./types";

export const loadBasesSuccess = (
  bases: ByIdState,
  ids: AllIdsState
): BasesActions => ({
  type: LOAD_BASES_SUCCESS,
  bases,
  ids
});

export const createBaseSuccess = (
  bases: ByIdState,
  id: number
): BasesActions => ({
  type: CREATE_BASE_SUCCESS,
  bases,
  id
});

export const updateBaseSuccess = (bases: ByIdState): BasesActions => ({
  type: UPDATE_BASE_SUCCESS,
  bases
});
