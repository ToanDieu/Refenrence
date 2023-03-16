import baseListPageReducer, { initialState } from "../reducer";
import {
  loadAllPending,
  loadAllSuccess,
  loadAllError,
  changeTagFilter
} from "../actions";

describe("baseListPageReducer", () => {
  let state;
  beforeEach(() => {
    state = initialState;
  });

  it("should return the initial state", () => {
    const expectedResult = state;
    expect(baseListPageReducer(undefined, {})).toEqual(expectedResult);
  });

  it("should handle the loadAllPending action correctly", () => {
    const expectedResult = { ...state, loading: true };
    expect(baseListPageReducer(state, loadAllPending())).toEqual(
      expectedResult
    );
  });

  it("should handle the loadAllSuccess action correctly", () => {
    const expectedResult = { ...state, loading: false };
    expect(baseListPageReducer(state, loadAllSuccess())).toEqual(
      expectedResult
    );
  });

  it("should handle the loadAllError action correctly", () => {
    const error = { message: "Error" };
    const expectedResult = { ...state, error };
    expect(baseListPageReducer(state, loadAllError(error))).toEqual(
      expectedResult
    );
  });

  it("should handle the loadWorkflowActionsSuccess action correctly", () => {
    const tagFilter = 1;
    const expectedResult = { ...state, tagFilter };
    expect(baseListPageReducer(state, changeTagFilter(tagFilter))).toEqual(
      expectedResult
    );
  });
});
