import { mapDispatchToProps } from "../TagFilter";
import { changeTagFilter } from "../actions";

describe("<TagFilter />", () => {
  describe("mapDispatchToProps", () => {
    describe("onSelectTag", () => {
      it("should be injected", () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onSelectTag).toBeDefined();
      });

      it("should dispatch changeTagFilter when called", () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        result.onSelectTag("1");
        expect(dispatch).toHaveBeenCalledWith(changeTagFilter(1));
      });
    });
  });
});
