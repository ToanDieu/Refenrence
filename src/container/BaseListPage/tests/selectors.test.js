import {
  selectMatchParams,
  makeSelectSearchTerm,
  makeSelectLoading,
  makeSelectError,
  selectBaseListPage,
  makeSelectTagFilter,
  makeSelectBasesAndTags,
  makeSelectBasesByCondition
} from "../selectors";
import { initialState } from "../reducer";

describe("selectMatchParams", () => {
  it("should select the match params props", () => {
    const params = {};
    const mockedProps = {
      match: {
        params
      }
    };
    expect(selectMatchParams(undefined, mockedProps)).toEqual(params);
  });
});

describe("makeSelectSearchTerm", () => {
  const selector = makeSelectSearchTerm();
  it("should select the searchTerm", () => {
    const searchTerm = "Test";
    const mockedProps = {
      match: {
        params: {
          searchTerm
        }
      }
    };
    expect(selector(undefined, mockedProps)).toEqual(searchTerm);
  });
});

describe("selectBaseListPage", () => {
  it("should select the baseListPage state", () => {
    const state = {
      loading: true
    };
    const mockedState = {
      baseListPage: state
    };
    expect(selectBaseListPage(mockedState)).toEqual(state);
  });

  it("should select the baseListPage initial state", () => {
    const mockedState = {
      baseListPage: undefined
    };
    expect(selectBaseListPage(mockedState)).toEqual(initialState);
  });
});

describe("makeSelectLoading", () => {
  const selector = makeSelectLoading();
  it("should select loading state", () => {
    const loading = true;
    const mockedState = {
      baseListPage: {
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
      baseListPage: {
        error
      }
    };
    expect(selector(mockedState)).toEqual(error);
  });
});

describe("makeSelectTagFilter", () => {
  const selector = makeSelectTagFilter();
  it("should select tag filter state", () => {
    const tagFilter = 1;
    const mockedState = {
      baseListPage: {
        tagFilter
      }
    };
    expect(selector(mockedState)).toEqual(tagFilter);
  });
});

describe("makeSelectBasesAndTags", () => {
  const selector = makeSelectBasesAndTags();
  it("should select base list and their tags", () => {
    const mockedState = {
      bases: {
        byId: { 1: { id: 1, tagIDs: [1] }, 2: { id: 2 } },
        allIds: [1, 2]
      },
      tags: {
        byId: { 1: { id: 1, name: "Tag" } },
        allIds: [1]
      }
    };
    const expectedResult = [
      { id: 1, tagIDs: [1], tags: [{ id: 1, name: "Tag" }] },
      { id: 2, tags: [] }
    ];
    expect(selector(mockedState)).toEqual(expectedResult);
  });
});

describe("makeSelectBasesByCondition", () => {
  const selector = makeSelectBasesByCondition();
  const mockedState = {
    baseListPage: {
      tagFilter: 1
    },
    bases: {
      byId: {
        1: { id: 1, memo: "Name C", shortcode: "", tagIDs: [1] },
        2: { id: 2, memo: "Name B", shortcode: "" },
        3: { id: 3, memo: "Name A", shortcode: "", tagIDs: [1, 2] },
        4: { id: 4, memo: "Test", shortcode: "", tagIDs: [1, 2] }
      },
      allIds: [1, 2, 3, 4]
    },
    tags: {
      byId: { 1: { id: 1, name: "Tag 1" }, 2: { id: 2, name: "Tag 2" } },
      allIds: [1, 2]
    }
  };

  it("should select the filtered, sorted base list with search term", () => {
    const mockedProps = {
      match: {
        params: {
          searchTerm: "name"
        }
      }
    };
    const expectedResult = [
      {
        id: 3,
        memo: "Name A",
        shortcode: "",
        tagIDs: [1, 2],
        tags: [{ id: 1, name: "Tag 1" }, { id: 2, name: "Tag 2" }]
      },
      {
        id: 1,
        memo: "Name C",
        shortcode: "",
        tagIDs: [1],
        tags: [{ id: 1, name: "Tag 1" }]
      }
    ];
    expect(selector(mockedState, mockedProps)).toEqual(expectedResult);
  });

  it("should select the filtered, sorted base list with search term", () => {
    const mockedProps = {
      match: {
        params: {
          searchTerm: undefined
        }
      }
    };
    const expectedResult = [
      {
        id: 3,
        memo: "Name A",
        shortcode: "",
        tagIDs: [1, 2],
        tags: [{ id: 1, name: "Tag 1" }, { id: 2, name: "Tag 2" }]
      },
      {
        id: 1,
        memo: "Name C",
        shortcode: "",
        tagIDs: [1],
        tags: [{ id: 1, name: "Tag 1" }]
      },
      {
        id: 4,
        memo: "Test",
        shortcode: "",
        tagIDs: [1, 2],
        tags: [{ id: 1, name: "Tag 1" }, { id: 2, name: "Tag 2" }]
      }
    ];
    expect(selector(mockedState, mockedProps)).toEqual(expectedResult);
  });
});
