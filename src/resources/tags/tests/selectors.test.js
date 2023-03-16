import {
  selectTags,
  makeSelectById,
  makeSelectAllIds,
  makeSelectTags
} from "../selectors";

describe("selectTags", () => {
  it("should select the tags state", () => {
    const state = {
      byId: {}
    };
    const mockedState = {
      tags: state
    };
    expect(selectTags(mockedState)).toEqual(state);
  });
});

describe("makeSelectById", () => {
  const selector = makeSelectById();
  it("should select the byId state", () => {
    const byId = { 1: { id: 1 } };
    const mockedState = {
      tags: {
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
      tags: {
        allIds
      }
    };
    expect(selector(mockedState)).toEqual(allIds);
  });
});

describe("makeSelectTags", () => {
  const selector = makeSelectTags();
  it("should select tags list", () => {
    const id = 1;
    const param = { id };
    const mockedState = {
      tags: {
        byId: { [id]: param },
        allIds: [id]
      }
    };
    expect(selector(mockedState)).toEqual([param]);
  });
});
