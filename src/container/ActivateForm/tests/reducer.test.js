import activateFormReducer, { initialState } from "../reducer";
import {
  setDialogVisible,
  activateWorkflowPending,
  activateWorkflowSuccess,
  activateWorkflowError
} from "../actions";

describe("activateFormReducer", () => {
  let state;
  beforeEach(() => {
    state = initialState;
  });

  it("should return the initial state", () => {
    const expectedResult = state;
    expect(activateFormReducer(undefined, {})).toEqual(expectedResult);
  });

  it("should handle the setDialogVisible action correctly", () => {
    const visible = true;
    const expectedResult = { ...state, visible };
    expect(activateFormReducer(state, setDialogVisible(visible))).toEqual(
      expectedResult
    );
  });

  it("should handle the activateWorkflowPending action correctly", () => {
    const expectedResult = { ...state, submitting: true, error: undefined };
    expect(activateFormReducer(state, activateWorkflowPending())).toEqual(
      expectedResult
    );
  });

  it("should handle the activateWorkflowSuccess action correctly", () => {
    const expectedResult = {
      ...state,
      submitting: false,
      activated: true,
      visible: false
    };
    expect(activateFormReducer(state, activateWorkflowSuccess())).toEqual(
      expectedResult
    );
  });

  it("should handle the activateWorkflowError action correctly", () => {
    const error = { message: "Error" };
    const expectedResult = { ...state, submitting: false, error };
    expect(activateFormReducer(state, activateWorkflowError(error))).toEqual(
      expectedResult
    );
  });
});
