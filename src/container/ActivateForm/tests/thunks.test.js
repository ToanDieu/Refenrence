import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";

import config from "@/appConfig";
import { updateWorkflowSuccess } from "@/resources/workflows/actions";
import { activateWorkflow } from "../thunks";
import {
  activateWorkflowPending,
  activateWorkflowSuccess,
  activateWorkflowError
} from "../actions";

describe("Workflow form thunks", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const baseID = 1;
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe("activateWorkflow", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const workflowId = 1;
      const workflow = { id: workflowId, baseID };
      moxios.stubRequest(
        `${config.TSE_API}/bases/${baseID}/workflows/${workflowId}`,
        {
          status: 200,
          responseText: JSON.stringify(workflow)
        }
      );

      const byId = { [workflowId]: workflow };
      const allIds = [workflowId];
      const store = mockStore({ workflows: { byId, allIds } });
      const expectedActions = [
        activateWorkflowPending(),
        updateWorkflowSuccess(byId),
        activateWorkflowSuccess()
      ];
      return store.dispatch(activateWorkflow(baseID, workflow)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should dispatch the expected actions if it requests the data error", () => {
      const workflowId = 1;
      const workflow = { id: workflowId, baseID };
      const error = new Error("Request failed with status code 400");
      moxios.stubRequest(
        `${config.TSE_API}/bases/${baseID}/workflows/${workflowId}`,
        {
          status: 400,
          response: { error }
        }
      );

      const byId = { [workflowId]: workflow };
      const allIds = [workflowId];
      const store = mockStore({ workflows: { byId, allIds } });
      const expectedActions = [
        activateWorkflowPending(),
        activateWorkflowError(error)
      ];
      return store.dispatch(activateWorkflow(baseID, workflow)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
