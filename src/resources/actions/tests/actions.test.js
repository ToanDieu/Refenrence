import {
  LOAD_WORKFLOW_ACTIONS_SUCCESS,
  CREATE_WORKFLOW_TEMP_ACTION,
  UPDATE_WORKFLOW_ACTION_SUCCESS
} from "../constants";
import {
  loadWorkflowActionsSuccess,
  createWorkflowTempAction,
  updateWorkflowActionSuccess
} from "../actions";

describe("Workflow actions actions", () => {
  describe("loadWorkflowActionsSuccess", () => {
    it("should return the correct type", () => {
      const id = 1;
      const fixture = { [id]: { id } };
      const ids = [id];
      const expectedResult = {
        type: LOAD_WORKFLOW_ACTIONS_SUCCESS,
        actions: fixture,
        ids
      };
      expect(loadWorkflowActionsSuccess(fixture, ids)).toEqual(expectedResult);
    });
  });

  describe("createWorkflowActionSuccess", () => {
    it("should return the correct type", () => {
      const id = 1;
      const fixture = { [id]: { id } };
      const expectedResult = {
        type: CREATE_WORKFLOW_TEMP_ACTION,
        actions: fixture,
        id
      };
      expect(createWorkflowTempAction(fixture, id)).toEqual(expectedResult);
    });
  });

  describe("updateWorkflowActionSuccess", () => {
    it("should return the correct type", () => {
      const id = 1;
      const fixture = { [id]: { id } };
      const expectedResult = {
        type: UPDATE_WORKFLOW_ACTION_SUCCESS,
        actions: fixture
      };
      expect(updateWorkflowActionSuccess(fixture)).toEqual(expectedResult);
    });
  });
});
