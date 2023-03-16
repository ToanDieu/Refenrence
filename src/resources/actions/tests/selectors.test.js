import {
  selectActions,
  makeSelectById,
  makeSelectAllIds,
  makeSelectActions
} from "../selectors";

describe("selectActions", () => {
  it("should select the actions state", () => {
    const state = {
      byId: {}
    };
    const mockedState = {
      actions: state
    };
    expect(selectActions(mockedState)).toEqual(state);
  });
});

describe("makeSelectById", () => {
  const selector = makeSelectById();
  it("should select the byId state", () => {
    const byId = { 1: { id: 1 } };
    const mockedState = {
      actions: {
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
      actions: {
        allIds
      }
    };
    expect(selector(mockedState)).toEqual(allIds);
  });
});

describe("makeSelectActions", () => {
  const selector = makeSelectActions();
  it("should select all actions", () => {
    const id = 1;
    const fixture = { id };
    const mockedState = {
      actions: {
        byId: { [id]: fixture },
        allIds: [id]
      }
    };
    expect(selector(mockedState)).toEqual([fixture]);
  });
});
