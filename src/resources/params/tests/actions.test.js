import { LOAD_BASE_PARAMS_SUCCESS } from "../constants";
import { loadBaseParamsSuccess } from "../actions";

describe("Params actions", () => {
  it("should return the correct type of loadBaseParamsSuccess action", () => {
    const id = 1;
    const params = { [id]: { id } };
    const ids = [id];
    const expectedResult = {
      type: LOAD_BASE_PARAMS_SUCCESS,
      params,
      ids
    };
    expect(loadBaseParamsSuccess(params, ids)).toEqual(expectedResult);
  });
});
