import { TagMedia } from "../tags";
import { LOAD_TAGS_SUCCESS, CREATE_TAG_SUCCESS } from "./constants";

export type ByIdState = {
  [id: number]: TagMedia;
};

export type AllIdsState = number[];

export interface TagsState {
  byId: ByIdState;
  allIds: AllIdsState;
}

export interface LoadTagsSuccess {
  type: typeof LOAD_TAGS_SUCCESS;
  tags: ByIdState;
  ids: AllIdsState;
}

export interface CreateTagSuccess {
  type: typeof CREATE_TAG_SUCCESS;
  tags: ByIdState;
  id: number;
}

export type TagsActions = LoadTagsSuccess | CreateTagSuccess;
