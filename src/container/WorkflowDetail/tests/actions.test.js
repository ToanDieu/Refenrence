import {
  LOAD_WORKFLOWS_PENDING,
  LOAD_WORKFLOWS_ERROR,
  LOAD_WORKFLOW_ACTIONS_ERROR,
  SET_EDIT_MODE,
  CREATE_WORKFLOW_ACTION_ERROR,
  UPDATE_WORKFLOW_ACTION_ERROR
} from "../constants";
import {
  loadWorkflows,
  loadWorkflowsError,
  loadWorkflowActionsError,
  setEditMode,
  createWorkflowActionError,
  updateWorkflowActionError
} from "../actions";

describe("WorkflowDetail actions", () => {
  it("should return the correct type of loadWorkflows action", () => {
    const expectedResult = {
      type: LOAD_WORKFLOWS_PENDING
    };
    expect(loadWorkflows()).toEqual(expectedResult);
  });

  it("should return the correct type of loadWorkflowsError action", () => {
    const fixture = {
      message: "Error"
    };
    const expectedResult = {
      type: LOAD_WORKFLOWS_ERROR,
      error: fixture
    };
    expect(loadWorkflowsError(fixture)).toEqual(expectedResult);
  });

  it("should return the correct type of loadWorkflowActionsError action", () => {
    const fixture = {
      message: "Error"
    };
    const expectedResult = {
      type: LOAD_WORKFLOW_ACTIONS_ERROR,
      error: fixture
    };
    expect(loadWorkflowActionsError(fixture)).toEqual(expectedResult);
  });

  it("should return the correct type of setEditMode action", () => {
    const mode = true;
    const expectedResult = {
      type: SET_EDIT_MODE,
      mode
    };
    expect(setEditMode(mode)).toEqual(expectedResult);
  });

  it("should return the correct type of createWorkflowActionError action", () => {
    const fixture = {
      message: "Error"
    };
    const expectedResult = {
      type: CREATE_WORKFLOW_ACTION_ERROR,
      error: fixture
    };
    expect(createWorkflowActionError(fixture)).toEqual(expectedResult);
  });

  it("should return the correct type of updateWorkflowActionError action", () => {
    const fixture = {
      message: "Error"
    };
    const expectedResult = {
      type: UPDATE_WORKFLOW_ACTION_ERROR,
      error: fixture
    };
    expect(updateWorkflowActionError(fixture)).toEqual(expectedResult);
  });
});
