import {
  selectWorkflowForm,
  makeSelectSubmitting,
  makeSelectVisible,
  makeSelectForm,
  makeSelectError
} from "../selectors";

describe("selectWorkflowForm", () => {
  it("should select the workflow form state", () => {
    const state = {
      visible: true
    };
    const mockedState = {
      workflowForm: state
    };
    expect(selectWorkflowForm(mockedState)).toEqual(state);
  });
});

describe("makeSelectVisible", () => {
  const selector = makeSelectVisible();
  it("should select the visible state", () => {
    const visible = true;
    const mockedState = {
      workflowForm: {
        visible
      }
    };
    expect(selector(mockedState)).toEqual(visible);
  });
});

describe("makeSelectSubmitting", () => {
  const selector = makeSelectSubmitting();
  it("should select the submitting state", () => {
    const submitting = true;
    const mockedState = {
      workflowForm: {
        submitting
      }
    };
    expect(selector(mockedState)).toEqual(submitting);
  });
});

describe("makeSelectForm", () => {
  const selector = makeSelectForm();
  it("should select the form state", () => {
    const form = { name: "Test" };
    const mockedState = {
      workflowForm: {
        form
      }
    };
    expect(selector(mockedState)).toEqual(form);
  });
});

describe("makeSelectError", () => {
  const selector = makeSelectError();
  it("should select the error state", () => {
    const error = { message: "Test" };
    const mockedState = {
      workflowForm: {
        error
      }
    };
    expect(selector(mockedState)).toEqual(error);
  });
});
