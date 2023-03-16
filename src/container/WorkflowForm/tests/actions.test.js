import {
  SET_DIALOG_VISIBLE,
  CHANGE_FORM_DATA,
  CREATE_WORKFLOW_PENDING,
  CREATE_WORKFLOW_ERROR
} from "../constants";
import {
  setDialogVisible,
  changeFormData,
  createWorkflowPending,
  createWorkflowError
} from "../actions";

describe("WorkflowForm actions", () => {
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

  describe("changeFormData", () => {
    it("should return the correct type", () => {
      const key = "name";
      const value = "Test";
      const expectedResult = {
        type: CHANGE_FORM_DATA,
        key,
        value
      };
      expect(changeFormData(key, value)).toEqual(expectedResult);
    });
  });

  describe("createWorkflowPending", () => {
    it("should return the correct type", () => {
      const expectedResult = {
        type: CREATE_WORKFLOW_PENDING
      };
      expect(createWorkflowPending()).toEqual(expectedResult);
    });
  });

  describe("createWorkflowError", () => {
    it("should return the correct type", () => {
      const fixture = {
        message: "Error"
      };
      const expectedResult = {
        type: CREATE_WORKFLOW_ERROR,
        error: fixture
      };
      expect(createWorkflowError(fixture)).toEqual(expectedResult);
    });
  });
});
