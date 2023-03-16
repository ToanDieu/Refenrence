import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";

import config from "@/appConfig";
import { fetchTags, fetchBases, fetchAll } from "../thunks";
import { loadAllPending, loadAllSuccess, loadAllError } from "../actions";
import { loadTagsSuccess } from "@/resources/tags/actions";
import { loadBasesSuccess } from "@/resources/bases/actions";

describe("BaseListPage thunks", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const baseID = 1;
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe("fetchTags", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const id = 1;
      const tag = { id };
      moxios.stubRequest(`${config.TSE_API}/tags`, {
        status: 200,
        responseText: JSON.stringify([tag])
      });

      const byId = { [id]: tag };
      const allIds = [id];
      const store = mockStore({ tags: { byId, allIds } });
      const expectedActions = [loadTagsSuccess(byId, allIds)];
      return store.dispatch(fetchTags(baseID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("fetchBases", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const id = 1;
      const base = { id };
      const typeID = 1;
      moxios.stubRequest(`${config.TSE_API}/my-org/types/${typeID}/bases`, {
        status: 200,
        responseText: JSON.stringify([base])
      });

      const byId = { [id]: base };
      const allIds = [id];
      const store = mockStore({ bases: { byId, allIds } });
      const expectedActions = [loadBasesSuccess(byId, allIds)];
      return store.dispatch(fetchBases(typeID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("fetchAll", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const typeID = 1;
      moxios.stubRequest(`${config.TSE_API}/tags`, {
        status: 200,
        responseText: JSON.stringify([])
      });
      moxios.stubRequest(`${config.TSE_API}/my-org/types/${typeID}/bases`, {
        status: 200,
        responseText: JSON.stringify([])
      });
      moxios.stubRequest(`${config.TSE_API}/bases/tags/ids`, {
        status: 200,
        responseText: JSON.stringify([])
      });

      const byId = {};
      const allIds = [];
      const store = mockStore({
        baseListPage: {
          loading: false
        },
        tags: { byId, allIds },
        bases: { byId, allIds }
      });
      const expectedActions = [
        loadAllPending(),
        loadTagsSuccess(byId, allIds),
        loadBasesSuccess(byId, allIds),
        loadBasesSuccess(byId, allIds),
        loadAllSuccess()
      ];
      return store.dispatch(fetchAll(typeID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should dispatch the expected actions if it requests the data error", () => {
      const typeID = 1;
      const error = new Error("Request failed with status code 400");
      moxios.stubRequest(`${config.TSE_API}/tags`, {
        status: 400,
        response: { error }
      });

      const store = mockStore({});
      const expectedActions = [loadAllPending(), loadAllError(error)];
      return store.dispatch(fetchAll(typeID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
