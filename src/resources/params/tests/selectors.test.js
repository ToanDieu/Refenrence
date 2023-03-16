import {
  selectParams,
  makeSelectById,
  makeSelectAllIds,
  makeSelectParams
} from "../selectors";

describe("selectParams", () => {
  it("should select the params state", () => {
    const state = {
      byId: {}
    };
    const mockedState = {
      params: state
    };
    expect(selectParams(mockedState)).toEqual(state);
  });
});

describe("makeSelectById", () => {
  const selector = makeSelectById();
  it("should select the byId state", () => {
    const byId = { 1: { id: 1 } };
    const mockedState = {
      params: {
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
      params: {
        allIds
      }
    };
    expect(selector(mockedState)).toEqual(allIds);
  });
});

describe("makeSelectParams", () => {
  const selector = makeSelectParams();
  it("should select params list", () => {
    const id = 1;
    const param = { id };
    const mockedState = {
      params: {
        byId: { [id]: param },
        allIds: [id]
      }
    };
    expect(selector(mockedState)).toEqual([param]);
  });
});
