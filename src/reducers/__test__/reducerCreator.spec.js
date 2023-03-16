import { loadStateReducer } from "../utils";
import * as types from "../../constants/actionTypes";

const sampleRes = {
  createdAt: "2018-04-03T05:40:32.165128Z",
  currentStep: 2,
  id: 73,
  isRegistered: true
};
const sampleError = "Error 500";

describe("Async reducer creator", () => {
  // create a typical async reducer
  const caseListReducer = loadStateReducer(types.CASE_LIST);
  const initState = { loading: false, data: null, error: null };
  // start from request state first so
  const requestState = {
    ...initState,
    loading: true
  };
  const successState = {
    ...requestState,
    loading: false,
    data: sampleRes
  };
  const failureState = {
    ...requestState,
    loading: false,
    error: sampleError
  };

  it("should return the initial state", () => {
    expect(caseListReducer(undefined, {})).toEqual(initState);
  });

  it("should handle REQUEST", () => {
    expect(
      caseListReducer(initState, {
        type: types.CASE_LIST.REQUEST
      })
    ).toEqual(requestState);
  });

  it("should handle SUCCESS", () => {
    expect(
      caseListReducer(requestState, {
        type: types.CASE_LIST.SUCCESS,
        payload: sampleRes
      })
    ).toEqual(successState);
  });

  it("should handle FAILURE", () => {
    expect(
      caseListReducer(requestState, {
        type: types.CASE_LIST.FAILURE,
        payload: sampleError
      })
    ).toEqual(failureState);
  });
});
