import workflowFormReducer, { initialState, initialForm } from "../reducer";
import {
  setDialogVisible,
  changeFormData,
  createWorkflowPending,
  createWorkflowError
} from "../actions";
import { createWorkflowSuccess } from "@/resources/workflows/actions";

describe("workflowFormReducer", () => {
  let state;
  beforeEach(() => {
    state = initialState;
  });

  it("should return the initial state", () => {
    const expectedResult = state;
    expect(workflowFormReducer(undefined, {})).toEqual(expectedResult);
  });

  it("should handle the setDialogVisible action correctly", () => {
    const visible = true;
    const expectedResult = { ...state, visible };
    expect(workflowFormReducer(state, setDialogVisible(visible))).toEqual(
      expectedResult
    );
  });

  it("should handle the changeFormData action correctly", () => {
    const key = "name";
    const value = "test";
    const expectedResult = {
      ...state,
      form: { ...initialForm, [key]: value }
    };
    expect(workflowFormReducer(state, changeFormData(key, value))).toEqual(
      expectedResult
    );
  });

  it("should handle the createWorkflowPending action correctly", () => {
    const expectedResult = { ...state, submitting: true, error: undefined };
    expect(workflowFormReducer(state, createWorkflowPending())).toEqual(
      expectedResult
    );
  });

  it("should handle the createWorkflowSuccess action correctly", () => {
    const expectedResult = { ...state, submitting: false, form: initialForm };
    expect(workflowFormReducer(state, createWorkflowSuccess())).toEqual(
      expectedResult
    );
  });

  it("should handle the createWorkflowPending action correctly", () => {
    const error = { message: "Error" };
    const expectedResult = { ...state, submitting: false, error };
    expect(workflowFormReducer(state, createWorkflowError(error))).toEqual(
      expectedResult
    );
  });
});
