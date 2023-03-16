import {
  selectWorkflowDetail,
  selectMatchParams,
  makeSelectQueryBaseID,
  makeSelectLoading,
  makeSelectError,
  makeSelectIsEditMode,
  makeSelectLastSave,
  makeSelectWorkflowsByBase,
  makeSelectCurrentWorkflow,
  makeSelectActionsByWorkflow,
  makeSelectParamsByBase
} from "../selectors";
import { initialState } from "../reducer";

describe("selectWorkflowDetail", () => {
  it("should select the workflow detail state", () => {
    const state = {
      loading: false
    };
    const mockedState = {
      workflowDetail: state
    };
    expect(selectWorkflowDetail(mockedState)).toEqual(state);
  });

  it("should select the workflow detail initial state", () => {
    const mockedState = {
      workflowDetail: undefined
    };
    expect(selectWorkflowDetail(mockedState)).toEqual(initialState);
  });
});

describe("selectMatchParams", () => {
  it("should select the match params props", () => {
    const params = {
      id: "test"
    };
    const mockedProps = {
      match: {
        params
      }
    };
    expect(selectMatchParams(undefined, mockedProps)).toEqual(params);
  });
});

describe("makeSelectQueryBaseID", () => {
  const selector = makeSelectQueryBaseID();
  it("should select the baseID", () => {
    const baseID = 1;
    const mockedProps = {
      match: {
        params: {
          baseID
        }
      }
    };
    expect(selector(undefined, mockedProps)).toEqual(baseID);
  });
});

describe("makeSelectLoading", () => {
  const selector = makeSelectLoading();
  it("should select loading state", () => {
    const loading = true;
    const mockedState = {
      workflowDetail: {
        loading
      }
    };
    expect(selector(mockedState)).toEqual(loading);
  });
});

describe("makeSelectError", () => {
  const selector = makeSelectError();
  it("should select the error", () => {
    const error = {
      message: "Error"
    };
    const mockedState = {
      workflowDetail: {
        error
      }
    };
    expect(selector(mockedState)).toEqual(error);
  });
});

describe("makeSelectIsEditMode", () => {
  const selector = makeSelectIsEditMode();
  it("should select edit mode state", () => {
    const isEditMode = true;
    const mockedState = {
      workflowDetail: {
        isEditMode
      }
    };
    expect(selector(mockedState)).toEqual(isEditMode);
  });
});

describe("makeSelectLastSave", () => {
  const selector = makeSelectLastSave();
  it("should select last save state", () => {
    const lastSave = 123;
    const mockedState = {
      workflowDetail: {
        lastSave
      }
    };
    expect(selector(mockedState)).toEqual(lastSave);
  });
});

describe("makeSelectWorkflowsByBase", () => {
  const baseID = 123;
  const id = 1;
  const workflow = { id, baseID };
  const selector = makeSelectWorkflowsByBase(baseID);

  it("should select workflows list by baseID", () => {
    const mockedState = {
      workflows: {
        byId: { [id]: workflow },
        allIds: [id]
      }
    };
    expect(selector(mockedState)).toEqual([workflow]);
  });
});

describe("makeSelectCurrentWorkflow", () => {
  const baseID = 123;
  const id = 1;
  const workflow = { id, baseID };
  const selector = makeSelectCurrentWorkflow(baseID);

  it("should select the first workflow", () => {
    const mockedState = {
      workflows: {
        byId: { [id]: workflow },
        allIds: [id]
      }
    };
    expect(selector(mockedState)).toEqual(workflow);
  });
});

describe("makeSelectActionsByWorkflow", () => {
  const baseID = 123;
  const id = 1;
  const workflow = { id, baseID };
  const actionId = 3;
  const action = { id: actionId, workflowID: id };
  const selector = makeSelectActionsByWorkflow(baseID);

  it("should select actions list by workflow", () => {
    const mockedState = {
      workflows: {
        byId: { [id]: workflow },
        allIds: [id]
      },
      actions: {
        byId: { [actionId]: action },
        allIds: [actionId]
      }
    };
    expect(selector(mockedState)).toEqual([action]);
  });

  it("should select an empty list if there is no current workflow", () => {
    const mockedState = {
      workflows: {
        byId: {},
        allIds: []
      },
      actions: {
        byId: { [actionId]: action },
        allIds: [actionId]
      }
    };
    expect(selector(mockedState)).toEqual([]);
  });
});

describe("makeSelectWorkflowsByBase", () => {
  const baseID = 123;
  const id = 5;
  const param = { id, baseID };
  const selector = makeSelectParamsByBase(baseID);

  it("should select params list by baseID", () => {
    const mockedState = {
      params: {
        byId: { [id]: param },
        allIds: [id]
      }
    };
    expect(selector(mockedState)).toEqual([param]);
  });
});
