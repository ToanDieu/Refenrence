import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";

import config from "@/appConfig";
import { createTagSuccess } from "@/resources/tags/actions";
import { loadBasesSuccess, updateBaseSuccess } from "@/resources/bases/actions";
import {
  fetchBaseTags,
  addBaseTag,
  removeBaseTag,
  createTag,
  createTagAndAddToBase
} from "../thunks";

describe("TagPanel thunks", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const baseID = 1;
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe("fetchBaseTags", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const id = 1;
      const tagIDs = [1, 2];
      moxios.stubRequest(`${config.TSE_API}/bases/tags/ids`, {
        status: 200,
        responseText: JSON.stringify([{ baseID: id, tagIDs }])
      });

      const base = { id };
      const byId = { [id]: base };
      const allIds = [id];
      const store = mockStore({ bases: { byId, allIds } });
      const expectedActions = [
        loadBasesSuccess({ [id]: { ...base, tagIDs } }, [id])
      ];
      return store.dispatch(fetchBaseTags(baseID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("addBaseTag", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const id = 1;
      const tagID = 1;
      moxios.stubRequest(`${config.TSE_API}/bases/${id}/tags/${tagID}`, {
        status: 200,
        responseText: JSON.stringify([])
      });

      const base = { id };
      const byId = { [id]: base };
      const store = mockStore({
        bases: { byId }
      });
      const newById = { [id]: { ...base, tagIDs: [tagID] } };
      const expectedActions = [updateBaseSuccess(newById)];
      return store.dispatch(addBaseTag(id, tagID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should dispatch the expected actions if it requests the data error", () => {
      const id = 1;
      const tagID = 1;
      const error = new Error("Request failed with status code 400");
      moxios.stubRequest(`${config.TSE_API}/bases/${id}/tags/${tagID}`, {
        status: 400,
        response: { error }
      });

      const store = mockStore({});
      const expectedActions = [];
      return store.dispatch(addBaseTag(id, tagID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("removeBaseTag", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const id = 1;
      const tagID = 1;
      moxios.stubRequest(`${config.TSE_API}/bases/${id}/tags/${tagID}`, {
        status: 200,
        responseText: JSON.stringify([])
      });

      const base = { id, tagIDs: [tagID] };
      const byId = { [id]: base };
      const store = mockStore({
        bases: { byId }
      });
      const newById = { [id]: { ...base, tagIDs: [] } };
      const expectedActions = [updateBaseSuccess(newById)];
      return store.dispatch(removeBaseTag(id, tagID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should dispatch the expected actions if it requests the data error", () => {
      const id = 1;
      const tagID = 1;
      const error = new Error("Request failed with status code 400");
      moxios.stubRequest(`${config.TSE_API}/bases/${id}/tags/${tagID}`, {
        status: 400,
        response: { error }
      });

      const store = mockStore({});
      const expectedActions = [];
      return store.dispatch(removeBaseTag(id, tagID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("createTag", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const tagID = 1;
      const tagName = "Tag";
      const tag = { id: tagID, name: tagName };
      moxios.stubRequest(`${config.TSE_API}/tags`, {
        status: 200,
        responseText: JSON.stringify(tag)
      });

      const byId = { [tagID]: tag };
      const store = mockStore({});
      const expectedActions = [createTagSuccess(byId, tagID)];
      return store.dispatch(createTag(tagName)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should dispatch the expected actions if it requests the data error", () => {
      const tagName = "Tag";
      const error = new Error("Request failed with status code 400");
      moxios.stubRequest(`${config.TSE_API}/tags`, {
        status: 400,
        response: { error }
      });

      const store = mockStore({});
      const expectedActions = [];
      return store.dispatch(createTag(tagName)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("createTagAndAddToBase", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const id = 1;
      const tagID = 1;
      const tagName = "Tag";
      const tag = { id: tagID, name: tagName };
      moxios.stubRequest(`${config.TSE_API}/tags`, {
        status: 200,
        responseText: JSON.stringify(tag)
      });

      const byId = { [tagID]: tag };
      const store = mockStore({});
      const expectedActions = [createTagSuccess(byId, tagID)];
      return store.dispatch(createTagAndAddToBase(id, tagName)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
