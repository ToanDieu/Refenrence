import { byId, allIds } from "../reducer";
import {
  loadWorkflowActionsSuccess,
  createWorkflowActionSuccess,
  updateWorkflowActionSuccess
} from "../actions";

describe("byId reducer", () => {
  let state;
  beforeEach(() => {
    state = {};
  });

  it("should return the initial state", () => {
    const expectedResult = state;
    expect(byId(undefined, {})).toEqual(expectedResult);
  });

  it("should handle the loadWorkflowActionsSuccess action correctly", () => {
    const fixture = { 1: { id: 1 } };
    const expectedResult = { ...state, ...fixture };
    expect(byId(state, loadWorkflowActionsSuccess(fixture))).toEqual(
      expectedResult
    );
  });

  describe("handle createWorkflowActionSuccess", () => {
    it("should handle correctly", () => {
      const id = 1;
      const fixture = { [id]: { id } };
      const expectedResult = { ...state, ...fixture };
      expect(byId(state, createWorkflowActionSuccess(fixture, id))).toEqual(
        expectedResult
      );
    });

    it("should handle setting accept/reject action id", () => {
      const parentId = 1;
      const actionId = 2;
      const actions = {
        [actionId]: {
          id: actionId,
          assignParent: { id: parentId, branching: "accept" }
        }
      };
      const currentState = { [parentId]: { id: parentId } };
      const expectedResult = {
        ...state,
        [parentId]: { id: parentId, acceptActionID: actionId },
        ...actions
      };
      expect(
        byId(currentState, createWorkflowActionSuccess(actions, actionId))
      ).toEqual(expectedResult);
    });
  });

  it("should handle the updateWorkflowActionSuccess action correctly", () => {
    const fixture = { 1: { id: 1 } };
    const expectedResult = { ...state, ...fixture };
    expect(byId(state, updateWorkflowActionSuccess(fixture))).toEqual(
      expectedResult
    );
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

  it("should handle the loadWorkflowActionsSuccess action correctly", () => {
    const fixture = [1, 2];
    const expectedResult = [...state, ...fixture];
    expect(allIds(state, loadWorkflowActionsSuccess({}, fixture))).toEqual(
      expectedResult
    );
  });

  it("should handle the createWorkflowActionSuccess action correctly", () => {
    const fixture = 1;
    const expectedResult = [...state, fixture];
    expect(allIds(state, createWorkflowActionSuccess({}, fixture))).toEqual(
      expectedResult
    );
  });
});
