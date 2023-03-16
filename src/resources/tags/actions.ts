import { LOAD_TAGS_SUCCESS, CREATE_TAG_SUCCESS } from "./constants";
import { ByIdState, AllIdsState, TagsActions } from "./types";

export const loadTagsSuccess = (
  tags: ByIdState,
  ids: AllIdsState
): TagsActions => ({
  type: LOAD_TAGS_SUCCESS,
  tags,
  ids
});

export const createTagSuccess = (tags: ByIdState, id: number) => ({
  type: CREATE_TAG_SUCCESS,
  tags,
  id
});
