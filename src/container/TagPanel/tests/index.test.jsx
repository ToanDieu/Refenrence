import { mapDispatchToProps } from "../index";
import { addBaseTag, removeBaseTag, createTagAndAddToBase } from "../thunks";

jest.mock("../thunks", () => ({
  addBaseTag: () => "addBaseTag",
  removeBaseTag: () => "removeBaseTag",
  createTagAndAddToBase: () => "createTagAndAddToBase"
}));

describe("<TagFilter />", () => {
  describe("mapDispatchToProps", () => {
    describe("onSelectTag", () => {
      it("should be injected", () => {
        const dispatch = jest.fn();
        const baseID = 1;
        const props = { baseID };
        const result = mapDispatchToProps(dispatch, props);
        expect(result.onSelectTag).toBeDefined();
      });

      it("should dispatch addBaseTag when called", () => {
        const dispatch = jest.fn();
        const baseID = 1;
        const props = { baseID };
        const result = mapDispatchToProps(dispatch, props);
        const tag = { id: 1 };
        result.onSelectTag(tag);
        expect(dispatch).toHaveBeenCalledWith(addBaseTag(baseID, tag.id));
      });
    });

    describe("onRemoveTag", () => {
      it("should be injected", () => {
        const dispatch = jest.fn();
        const baseID = 1;
        const props = { baseID };
        const result = mapDispatchToProps(dispatch, props);
        expect(result.onRemoveTag).toBeDefined();
      });

      it("should dispatch removeBaseTag when called", () => {
        const dispatch = jest.fn();
        const baseID = 1;
        const props = { baseID };
        const result = mapDispatchToProps(dispatch, props);
        const tagID = 1;
        result.onRemoveTag(tagID);
        expect(dispatch).toHaveBeenCalledWith(removeBaseTag(baseID, tagID));
      });
    });

    describe("onAddTag", () => {
      it("should be injected", () => {
        const dispatch = jest.fn();
        const baseID = 1;
        const props = { baseID };
        const result = mapDispatchToProps(dispatch, props);
        expect(result.onAddTag).toBeDefined();
      });

      it("should dispatch createTagAndAddToBase when called", () => {
        const dispatch = jest.fn();
        const baseID = 1;
        const props = { baseID };
        const result = mapDispatchToProps(dispatch, props);
        const tagName = "Tag";
        result.onAddTag(tagName);
        expect(dispatch).toHaveBeenCalledWith(
          createTagAndAddToBase(baseID, tagName)
        );
      });
    });
  });
});
