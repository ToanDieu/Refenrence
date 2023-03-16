import {
  LOAD_ALL_PENDING,
  LOAD_ALL_SUCCESS,
  CHANGE_TAG_FILTER,
  LOAD_ALL_ERROR
} from "../constants";
import {
  loadAllPending,
  loadAllSuccess,
  loadAllError,
  changeTagFilter
} from "../actions";

describe("BaseListPage actions", () => {
  it("should return the correct type of loadAllPending action", () => {
    const expectedResult = {
      type: LOAD_ALL_PENDING
    };
    expect(loadAllPending()).toEqual(expectedResult);
  });

  it("should return the correct type of loadAllSuccess action", () => {
    const expectedResult = {
      type: LOAD_ALL_SUCCESS
    };
    expect(loadAllSuccess()).toEqual(expectedResult);
  });

  it("should return the correct type of loadAllError action", () => {
    const fixture = {
      message: "Error"
    };
    const expectedResult = {
      type: LOAD_ALL_ERROR,
      error: fixture
    };
    expect(loadAllError(fixture)).toEqual(expectedResult);
  });

  it("should return the correct type of changeTagFilter action", () => {
    const tagID = 1;
    const expectedResult = {
      type: CHANGE_TAG_FILTER,
      tagID
    };
    expect(changeTagFilter(tagID)).toEqual(expectedResult);
  });
});
