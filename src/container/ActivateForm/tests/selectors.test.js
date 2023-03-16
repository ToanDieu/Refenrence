import {
  selectActivateForm,
  makeSelectSubmitting,
  makeSelectVisible,
  makeSelectError
} from "../selectors";

describe("selectActivateForm", () => {
  it("should select the activate form state", () => {
    const state = {
      visible: true
    };
    const mockedState = {
      activateForm: state
    };
    expect(selectActivateForm(mockedState)).toEqual(state);
  });
});

describe("makeSelectVisible", () => {
  const selector = makeSelectVisible();
  it("should select the visible state", () => {
    const visible = true;
    const mockedState = {
      activateForm: {
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
      activateForm: {
        submitting
      }
    };
    expect(selector(mockedState)).toEqual(submitting);
  });
});

describe("makeSelectError", () => {
  const selector = makeSelectError();
  it("should select the error state", () => {
    const error = { message: "Test" };
    const mockedState = {
      activateForm: {
        error
      }
    };
    expect(selector(mockedState)).toEqual(error);
  });
});
