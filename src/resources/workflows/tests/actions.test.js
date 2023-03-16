import {
  LOAD_WORKFLOWS_SUCCESS,
  CREATE_WORKFLOW_SUCCESS,
  UPDATE_WORKFLOW_SUCCESS
} from "../constants";
import {
  loadWorkflowsSuccess,
  createWorkflowSuccess,
  updateWorkflowSuccess
} from "../actions";

describe("Workflows actions", () => {
  it("should return the correct type of loadWorkflowsSuccess action", () => {
    const id = 1;
    const workflows = { [id]: { id } };
    const ids = [id];
    const expectedResult = {
      type: LOAD_WORKFLOWS_SUCCESS,
      workflows,
      ids
    };
    expect(loadWorkflowsSuccess(workflows, ids)).toEqual(expectedResult);
  });

  it("should return the correct type of createWorkflowSuccess action", () => {
    const id = 1;
    const workflows = { [id]: { id } };
    const expectedResult = {
      type: CREATE_WORKFLOW_SUCCESS,
      workflows,
      id
    };
    expect(createWorkflowSuccess(workflows, id)).toEqual(expectedResult);
  });

  it("should return the correct type of updateWorkflowSuccess action", () => {
    const id = 1;
    const workflows = { [id]: { id } };
    const expectedResult = {
      type: UPDATE_WORKFLOW_SUCCESS,
      workflows
    };
    expect(updateWorkflowSuccess(workflows, id)).toEqual(expectedResult);
  });
});
