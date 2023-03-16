import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import moxios from "moxios";

import config from "@/appConfig";
import { createWorkflowSuccess } from "@/resources/workflows/actions";
import { createWorkflow } from "../thunks";
import { createWorkflowPending, createWorkflowError } from "../actions";

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

  describe("createWorkflow", () => {
    it("should dispatch the expected actions if it requests the data successfully", () => {
      const workflowId = 1;
      const workflow = { id: workflowId };
      moxios.stubRequest(`${config.TSE_API}/bases/${baseID}/workflows`, {
        status: 200,
        responseText: JSON.stringify(workflow)
      });

      const store = mockStore({
        workflowForm: { form: { name: "Test", description: "" } }
      });
      const expectedActions = [
        createWorkflowPending(),
        createWorkflowSuccess({ [workflowId]: workflow }, workflowId)
      ];
      return store.dispatch(createWorkflow(baseID)).then(() => {
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
      const expectedActions = [
        createWorkflowPending(),
        createWorkflowError(error)
      ];
      return store.dispatch(createWorkflow(baseID)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
