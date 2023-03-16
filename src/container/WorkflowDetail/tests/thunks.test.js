import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";

import config from "@/appConfig";
import {
  loadWorkflowsSuccess,
  updateWorkflowSuccess
} from "@/resources/workflows/actions";
import {
  loadWorkflowActionsSuccess,
  createWorkflowActionSuccess,
  updateWorkflowActionSuccess
} from "@/resources/actions/actions";
import {
  fetchWorkflows,
  fetchWorkflowActions,
  createWorkflowAction,
  updateWorkflowAction,
  fetchBaseParams
} from "../thunks";
import {
  loadWorkflows,
  loadWorkflowsError,
  loadWorkflowActionsError,
  setLastSave,
  createWorkflowActionError,
  updateWorkflowActionError
} from "../actions";
import { loadBaseParamsSuccess } from "@/resources/params/actions";

const time = 123;
jest.spyOn(Date, "now").mockImplementation(() => time);

describe("Workflow detail thunks", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const baseID = 1;
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe("fetchWorkflows", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const workflowId = 1;
      const workflow = { id: workflowId };
      moxios.stubRequest(`${config.TSE_API}/bases/${baseID}/workflows`, {
        status: 200,
        responseText: JSON.stringify([workflow])
      });

      const byId = { [workflowId]: workflow };
      const allIds = [workflowId];
      const store = mockStore({ workflows: { byId, allIds } });
      const expectedActions = [
        loadWorkflows(),
        loadWorkflowsSuccess(byId, allIds)
      ];
      return store.dispatch(fetchWorkflows(baseID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should dispatch the expected actions if it requests the data successfully without any workflow", () => {
      moxios.stubRequest(`${config.TSE_API}/bases/${baseID}/workflows`, {
        status: 200,
        responseText: JSON.stringify([])
      });

      const byId = {};
      const allIds = [];
      const store = mockStore({ workflows: { byId, allIds } });
      const expectedActions = [
        loadWorkflows(),
        loadWorkflowsSuccess(byId, allIds)
      ];
      return store.dispatch(fetchWorkflows(baseID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should dispatch the expected actions if it requests the data error", () => {
      const error = new Error("Request failed with status code 400");
      moxios.stubRequest(`${config.TSE_API}/bases/${baseID}/workflows`, {
        status: 400,
        response: { error }
      });

      const store = mockStore({});
      const expectedActions = [loadWorkflows(), loadWorkflowsError(error)];
      return store.dispatch(fetchWorkflows(baseID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("fetchWorkflowActions", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const workflowId = 1;
      const workflow = { id: workflowId, baseID };
      const actionId = 2;
      const action = { id: actionId, workflowID: workflowId };
      const actions = [action];
      moxios.stubRequest(
        `${config.TSE_API}/bases/${baseID}/workflows/${workflowId}/actions`,
        {
          status: 200,
          responseText: JSON.stringify(actions)
        }
      );

      const byId = { [workflowId]: workflow };
      const allIds = [workflowId];
      const store = mockStore({ workflows: { byId, allIds } });
      const expectedActions = [
        loadWorkflowActionsSuccess({ [actionId]: action }, [actionId])
      ];
      return store.dispatch(fetchWorkflowActions(baseID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should dispatch the expected actions if it requests the data successfully without any action", () => {
      const workflowId = 1;
      const workflow = { id: workflowId, baseID };
      moxios.stubRequest(
        `${config.TSE_API}/bases/${baseID}/workflows/${workflowId}/actions`,
        {
          status: 200,
          responseText: JSON.stringify([])
        }
      );

      const byId = { [workflowId]: workflow };
      const allIds = [workflowId];
      const store = mockStore({ workflows: { byId, allIds } });
      const expectedActions = [loadWorkflowActionsSuccess({}, [])];
      return store.dispatch(fetchWorkflowActions(baseID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should not dispatch any action if no workflow in store", () => {
      const byId = {};
      const allIds = [];
      const store = mockStore({ workflows: { byId, allIds } });
      expect(store.dispatch(fetchWorkflowActions(baseID))).toEqual(false);
    });

    it("should dispatch the expected actions if it requests the data error", () => {
      const workflowId = 1;
      const workflow = { id: workflowId, baseID };
      const error = new Error("Request failed with status code 400");
      moxios.stubRequest(
        `${config.TSE_API}/bases/${baseID}/workflows/${workflowId}/actions`,
        {
          status: 400,
          response: { error }
        }
      );

      const byId = { [workflowId]: workflow };
      const allIds = [workflowId];
      const store = mockStore({ workflows: { byId, allIds } });
      const expectedActions = [loadWorkflowActionsError(error)];
      return store.dispatch(fetchWorkflowActions(baseID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("createWorkflowAction", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const workflowId = 1;
      const workflow = { id: workflowId, baseID, initialActionID: 0 };
      const actionId = 3;
      const action = {
        id: actionId,
        workflowID: workflowId,
        assignParent: undefined
      };
      moxios.stubRequest(
        `${config.TSE_API}/bases/${baseID}/workflows/${workflowId}/actions`,
        {
          status: 200,
          responseText: JSON.stringify(action)
        }
      );

      const byId = { [actionId]: action };
      const allIds = [actionId];
      const workflowById = { [workflowId]: workflow };
      const store = mockStore({
        workflows: { byId: workflowById, allIds: [workflowId] },
        actions: { byId, allIds }
      });
      const expectedActions = [
        updateWorkflowSuccess({
          [workflowId]: { ...workflow, initialActionID: actionId }
        }),
        setLastSave(time)
      ];
      return store.dispatch(createWorkflowAction(baseID, action)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should not dispatch any action if no current workflow in store", () => {
      const byId = {};
      const allIds = [];
      const store = mockStore({ workflows: { byId, allIds } });
      expect(store.dispatch(createWorkflowAction(baseID, {}))).toEqual(false);
    });

    it("should dispatch the expected actions if it requests the data error", () => {
      const workflowId = 1;
      const workflow = { id: workflowId, baseID };
      const error = new Error("Request failed with status code 400");
      moxios.stubRequest(
        `${config.TSE_API}/bases/${baseID}/workflows/${workflowId}/actions`,
        {
          status: 400,
          response: { error }
        }
      );

      const byId = { [workflowId]: workflow };
      const allIds = [workflowId];
      const store = mockStore({ workflows: { byId, allIds } });
      const expectedActions = [createWorkflowActionError(error)];
      return store.dispatch(createWorkflowAction(baseID, {})).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("updateWorkflowAction", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const workflowId = 1;
      const workflow = { id: workflowId, baseID };
      const actionId = 3;
      const action = {
        id: actionId,
        workflowID: workflowId,
        assignParent: undefined
      };
      moxios.stubRequest(
        `${
          config.TSE_API
        }/bases/${baseID}/workflows/${workflowId}/actions/${actionId}`,
        {
          status: 200,
          responseText: JSON.stringify(action)
        }
      );

      const byId = { [actionId]: action };
      const allIds = [actionId];
      const store = mockStore({
        workflows: { byId: { [workflowId]: workflow }, allIds: [workflowId] },
        actions: { byId, allIds }
      });
      const expectedActions = [setLastSave(time)];
      return store.dispatch(updateWorkflowAction(baseID, action)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should not dispatch any action if no current workflow in store", () => {
      const byId = {};
      const allIds = [];
      const store = mockStore({ workflows: { byId, allIds } });
      expect(store.dispatch(updateWorkflowAction(baseID, {}))).toEqual(false);
    });

    it("should dispatch the expected actions if it requests the data error", () => {
      const workflowId = 1;
      const actionId = 3;
      const workflow = { id: workflowId, baseID };
      const action = {
        id: actionId,
        workflowID: workflowId,
        assignParent: undefined
      };
      const error = new Error("Request failed with status code 400");
      moxios.stubRequest(
        `${config.TSE_API}/bases/${baseID}/workflows/${workflowId}/actions/${
          action.id
        }`,
        {
          status: 400,
          response: { error }
        }
      );

      const byId = { [workflowId]: workflow };
      const allIds = [workflowId];
      const store = mockStore({ workflows: { byId, allIds } });
      const expectedActions = [updateWorkflowActionError(error)];
      return store.dispatch(updateWorkflowAction(baseID, action)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("fetchBaseParams", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const id = 1;
      const param = { ID: id };
      moxios.stubRequest(`${config.TSE_API}/bases/${baseID}/params`, {
        status: 200,
        responseText: JSON.stringify([param])
      });

      const byId = { [id]: param };
      const allIds = [id];
      const store = mockStore({ params: { byId, allIds } });
      const expectedActions = [loadBaseParamsSuccess(byId, allIds)];
      return store.dispatch(fetchBaseParams(baseID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
