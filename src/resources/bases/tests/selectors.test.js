import {
  selectBases,
  makeSelectById,
  makeSelectAllIds,
  makeSelectBases
} from "../selectors";

describe("selectBases", () => {
  it("should select the bases state", () => {
    const state = {
      byId: {}
    };
    const mockedState = {
      bases: state
    };
    expect(selectBases(mockedState)).toEqual(state);
  });
});

describe("makeSelectById", () => {
  const selector = makeSelectById();
  it("should select the byId state", () => {
    const byId = { 1: { id: 1 } };
    const mockedState = {
      bases: {
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
      bases: {
        allIds
      }
    };
    expect(selector(mockedState)).toEqual(allIds);
  });
});

describe("makeSelectBases", () => {
  const selector = makeSelectBases();
  it("should select bases list", () => {
    const id = 1;
    const param = { id };
    const mockedState = {
      bases: {
        byId: { [id]: param },
        allIds: [id]
      }
    };
    expect(selector(mockedState)).toEqual([param]);
  });
});
