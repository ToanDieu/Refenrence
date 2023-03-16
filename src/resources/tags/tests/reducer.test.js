import { byId, allIds } from "../reducer";
import { loadTagsSuccess, createTagSuccess } from "../actions";

describe("byId reducer", () => {
  let state;
  beforeEach(() => {
    state = {};
  });

  it("should return the initial state", () => {
    const expectedResult = state;
    expect(byId(undefined, {})).toEqual(expectedResult);
  });

  it("should handle the loadTagsSuccess action correctly", () => {
    const fixture = { 1: { id: 1 } };
    const expectedResult = { ...state, ...fixture };
    expect(byId(state, loadTagsSuccess(fixture))).toEqual(expectedResult);
  });

  it("should handle the createTagSuccess action correctly", () => {
    const fixture = { 1: { id: 1 } };
    const expectedResult = { ...state, ...fixture };
    expect(byId(state, createTagSuccess(fixture))).toEqual(expectedResult);
  });
});

describe("allIds reducer", () => {
  let state;
  beforeEach(() => {
    state = [];
  });

  it("should return the initial state", () => {
    const expectedResult = state;
    expect(allIds(undefined, {})).toEqual(expectedResult);
  });

  it("should handle the loadTagsSuccess action correctly", () => {
    const fixture = [1, 2];
    const expectedResult = [...state, ...fixture];
    expect(allIds(state, loadTagsSuccess({}, fixture))).toEqual(expectedResult);
  });

  it("should handle the createTagSuccess action correctly", () => {
    const fixture = 1;
    const expectedResult = [...state, fixture];
    expect(allIds(state, createTagSuccess({}, fixture))).toEqual(
      expectedResult
    );
  });
});
