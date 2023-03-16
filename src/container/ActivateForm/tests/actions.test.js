import {
  SET_DIALOG_VISIBLE,
  ACTIVATE_WORKFLOW_PENDING,
  ACTIVATE_WORKFLOW_ERROR,
  ACTIVATE_WORKFLOW_SUCCESS
} from "../constants";
import {
  setDialogVisible,
  activateWorkflowPending,
  activateWorkflowError,
  activateWorkflowSuccess
} from "../actions";

describe("ActivateForm actions", () => {
  describe("setDialogVisible", () => {
    it("should return the correct type", () => {
      const visible = true;
      const expectedResult = {
        type: SET_DIALOG_VISIBLE,
        visible
      };
      expect(setDialogVisible(visible)).toEqual(expectedResult);
    });
  });

  describe("activateWorkflowPending", () => {
    it("should return the correct type", () => {
      const expectedResult = {
        type: ACTIVATE_WORKFLOW_PENDING
      };
      expect(activateWorkflowPending()).toEqual(expectedResult);
    });
  });

  describe("activateWorkflowSuccess", () => {
    it("should return the correct type", () => {
      const expectedResult = {
        type: ACTIVATE_WORKFLOW_SUCCESS
      };
      expect(activateWorkflowSuccess()).toEqual(expectedResult);
    });
  });

  describe("activateWorkflowError", () => {
    it("should return the correct type", () => {
      const fixture = {
        message: "Error"
      };
      const expectedResult = {
        type: ACTIVATE_WORKFLOW_ERROR,
        error: fixture
      };
      expect(activateWorkflowError(fixture)).toEqual(expectedResult);
    });
  });
});
