import { byId, allIds } from "../reducer";
import { loadBaseParamsSuccess } from "../actions";

describe("byId reducer", () => {
  let state;
  beforeEach(() => {
    state = {};
  });

  it("should return the initial state", () => {
    const expectedResult = state;
    expect(byId(undefined, {})).toEqual(expectedResult);
  });

  it("should handle the loadBaseParamsSuccess action correctly", () => {
    const fixture = { 1: { id: 1 } };
    const expectedResult = { ...state, ...fixture };
    expect(byId(state, loadBaseParamsSuccess(fixture))).toEqual(expectedResult);
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

  it("should handle the loadBaseParamsSuccess action correctly", () => {
    const fixture = [1, 2];
    const expectedResult = [...state, ...fixture];
    expect(allIds(state, loadBaseParamsSuccess({}, fixture))).toEqual(
      expectedResult
    );
  });
});
