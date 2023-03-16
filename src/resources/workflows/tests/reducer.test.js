import { byId, allIds } from "../reducer";
import {
  loadWorkflowsSuccess,
  createWorkflowSuccess,
  updateWorkflowSuccess
} from "../actions";
import { createWorkflowActionSuccess } from "@/resources/actions/actions";

describe("byId reducer", () => {
  let state;
  beforeEach(() => {
    state = {};
  });

  it("should return the initial state", () => {
    const expectedResult = state;
    expect(byId(undefined, {})).toEqual(expectedResult);
  });

  it("should handle the loadWorkflowsSuccess action correctly", () => {
    const fixture = { 1: { id: 1 } };
    const expectedResult = { ...state, ...fixture };
    expect(byId(state, loadWorkflowsSuccess(fixture))).toEqual(expectedResult);
  });

  it("should handle the createWorkflowSuccess action correctly", () => {
    const fixture = { 1: { id: 1 } };
    const expectedResult = { ...state, ...fixture };
    expect(byId(state, createWorkflowSuccess(fixture))).toEqual(expectedResult);
  });

  it("should handle the updateWorkflowSuccess action correctly", () => {
    const fixture = { 1: { id: 1 } };
    const expectedResult = { ...state, ...fixture };
    expect(byId(state, updateWorkflowSuccess(fixture))).toEqual(expectedResult);
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

  it("should handle the loadWorkflowsSuccess action correctly", () => {
    const fixture = [1, 2];
    const expectedResult = [...state, ...fixture];
    expect(allIds(state, loadWorkflowsSuccess({}, fixture))).toEqual(
      expectedResult
    );
  });

  it("should handle the createWorkflowSuccess action correctly", () => {
    const fixture = 1;
    const expectedResult = [...state, fixture];
    expect(allIds(state, createWorkflowSuccess({}, fixture))).toEqual(
      expectedResult
    );
  });
});
