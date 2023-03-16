import {
  selectWorkflows,
  makeSelectById,
  makeSelectAllIds,
  makeSelectWorkflows
} from "../selectors";

describe("selectWorkflows", () => {
  it("should select the workflows state", () => {
    const state = {
      byId: {}
    };
    const mockedState = {
      workflows: state
    };
    expect(selectWorkflows(mockedState)).toEqual(state);
  });
});

describe("makeSelectById", () => {
  const selector = makeSelectById();
  it("should select the byId state", () => {
    const byId = { 1: { id: 1 } };
    const mockedState = {
      workflows: {
        byId
      }
    };
    expect(selector(mockedState)).toEqual(byId);
  });
});

describe("makeSelectAllIds", () => {
  const selector = makeSelectAllIds();
  it("should select the allIds state", () => {
    const allIds = [1, 2];
    const mockedState = {
      workflows: {
        allIds
      }
    };
    expect(selector(mockedState)).toEqual(allIds);
  });
});

describe("makeSelectWorkflows", () => {
  const selector = makeSelectWorkflows();
  it("should select workflows list", () => {
    const id = 1;
    const workflow = { id };
    const mockedState = {
      workflows: {
        byId: { [id]: workflow },
        allIds: [id]
      }
    };
    expect(selector(mockedState)).toEqual([workflow]);
  });
});
