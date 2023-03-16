import { byId, allIds } from "../reducer";
import { loadBasesSuccess, updateBaseSuccess } from "../actions";

describe("byId reducer", () => {
  let state;
  beforeEach(() => {
    state = {};
  });

  it("should return the initial state", () => {
    const expectedResult = state;
    expect(byId(undefined, {})).toEqual(expectedResult);
  });

  it("should handle the loadBasesSuccess action correctly", () => {
    const fixture = { 1: { id: 1 } };
    const expectedResult = { ...state, ...fixture };
    expect(byId(state, loadBasesSuccess(fixture))).toEqual(expectedResult);
  });

  it("should handle the updateBaseSuccess action correctly", () => {
    const fixture = { 1: { id: 1 } };
    const expectedResult = { ...state, ...fixture };
    expect(byId(state, updateBaseSuccess(fixture))).toEqual(expectedResult);
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

  it("should handle the loadBasesSuccess action correctly", () => {
    const fixture = [1, 2];
    const expectedResult = [...state, ...fixture];
    expect(allIds(state, loadBasesSuccess({}, fixture))).toEqual(
      expectedResult
    );
  });
});
