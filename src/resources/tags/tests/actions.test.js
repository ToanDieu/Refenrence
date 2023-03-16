import { LOAD_TAGS_SUCCESS, CREATE_TAG_SUCCESS } from "../constants";
import { loadTagsSuccess, createTagSuccess } from "../actions";

describe("Tags actions", () => {
  it("should return the correct type of loadTagsSuccess action", () => {
    const id = 1;
    const tags = { [id]: { id } };
    const ids = [id];
    const expectedResult = {
      type: LOAD_TAGS_SUCCESS,
      tags,
      ids
    };
    expect(loadTagsSuccess(tags, ids)).toEqual(expectedResult);
  });

  it("should return the correct type of createTagSuccess action", () => {
    const id = 1;
    const tags = { [id]: { id } };
    const expectedResult = {
      type: CREATE_TAG_SUCCESS,
      tags,
      id
    };
    expect(createTagSuccess(tags, id)).toEqual(expectedResult);
  });
});
