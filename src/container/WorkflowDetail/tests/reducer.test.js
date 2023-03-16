import { loadWorkflowsSuccess } from "@/resources/workflows/actions";
import { loadWorkflowActionsSuccess } from "@/resources/actions/actions";
import workflowDetailReducer, { initialState } from "../reducer";
import {
  loadWorkflows,
  loadWorkflowsError,
  loadWorkflowActionsError,
  setEditMode,
  setLastSave
} from "../actions";

describe("workflowDetailReducer", () => {
  let state;
  beforeEach(() => {
    state = initialState;
  });

  it("should return the initial state", () => {
    const expectedResult = state;
    expect(workflowDetailReducer(undefined, {})).toEqual(expectedResult);
  });

  it("should handle the loadWorkflows action correctly", () => {
    const expectedResult = { ...state, loading: true };
    expect(workflowDetailReducer(state, loadWorkflows())).toEqual(
      expectedResult
    );
  });

  describe("handle the loadWorkflowsSuccess action", () => {
    it("should set loading to true if there is at least a workflow", () => {
      const workflows = { 1: { id: 1 } };
      const ids = [1];
      const expectedResult = { ...state, loading: true };
      expect(
        workflowDetailReducer(state, loadWorkflowsSuccess(workflows, ids))
      ).toEqual(expectedResult);
    });

    it("should set loading to false if there is no workflow was returned", () => {
      const workflows = {};
      const ids = [];
      const expectedResult = { ...state, loading: false };
      expect(
        workflowDetailReducer(state, loadWorkflowsSuccess(workflows, ids))
      ).toEqual(expectedResult);
    });
  });

  it("should handle the loadWorkflowsError action correctly", () => {
    const error = { message: "Error" };
    const expectedResult = { ...state, error };
    expect(workflowDetailReducer(state, loadWorkflowsError(error))).toEqual(
      expectedResult
    );
  });

  it("should handle the loadWorkflowActionsSuccess action correctly", () => {
    const expectedResult = { ...state, loading: false };
    expect(workflowDetailReducer(state, loadWorkflowActionsSuccess())).toEqual(
      expectedResult
    );
  });

  it("should handle the loadWorkflowsError action correctly", () => {
    const error = { message: "Error" };
    const expectedResult = { ...state, error };
    expect(
      workflowDetailReducer(state, loadWorkflowActionsError(error))
    ).toEqual(expectedResult);
  });

  it("should handle the setEditMode action correctly", () => {
    const mode = true;
    const expectedResult = { ...state, isEditMode: mode };
    expect(workflowDetailReducer(state, setEditMode(mode))).toEqual(
      expectedResult
    );
  });

  it("should handle the successful operations action correctly", () => {
    const time = 123;
    const expectedResult = { ...state, lastSave: time };
    expect(workflowDetailReducer(state, setLastSave(time))).toEqual(
      expectedResult
    );
  });
});
