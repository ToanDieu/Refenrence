import { LOAD_BASES_SUCCESS, UPDATE_BASE_SUCCESS } from "../constants";
import { loadBasesSuccess, updateBaseSuccess } from "../actions";

describe("Bases actions", () => {
  it("should return the correct type of loadBasesSuccess action", () => {
    const id = 1;
    const bases = { [id]: { id } };
    const ids = [id];
    const expectedResult = {
      type: LOAD_BASES_SUCCESS,
      bases,
      ids
    };
    expect(loadBasesSuccess(bases, ids)).toEqual(expectedResult);
  });

  describe("updateBaseSuccess", () => {
    it("should return the correct type", () => {
      const id = 1;
      const fixture = { [id]: { id } };
      const expectedResult = {
        type: UPDATE_BASE_SUCCESS,
        bases: fixture
      };
      expect(updateBaseSuccess(fixture)).toEqual(expectedResult);
    });
  });
});
