import { ThunkDispatch } from "redux-thunk";
import { normalize } from "normalizr";
import { set } from "lodash/fp";

import config from "@/appConfig";
import request from "@/utils/request";
import { WorkflowsState } from "@/resources/workflows/types";
import * as workflowSchema from "@/resources/workflows/schema";
import * as actionSchema from "@/resources/actions/schema";
import { paramList } from "@/resources/params/schema";
import { base } from "@/resources/bases/schema";
import { loadBaseParamsSuccess } from "@/resources/params/actions";
import {
  loadWorkflowActionsSuccess,
  removeWorkflowTempAction,
  removeWorkflowAction
} from "@/resources/actions/actions";
import {
  loadWorkflowsSuccess,
  updateWorkflowSuccess
} from "@/resources/workflows/actions";
import { makeSelectCurrentWorkflow } from "./selectors";
import {
  loadWorkflows,
  loadWorkflowsError,
  loadWorkflowActionsError,
  createWorkflowActionError,
  updateWorkflowActionError,
  setLastSave,
  deleteWorkflowActionError
} from "./actions";
import { ActionMedia } from "@/resources/actions";
import { loadBasesSuccess, updateBaseSuccess } from "@/resources/bases/actions";
import { makeSelectById } from "@/resources/bases/selectors";
import { BasesState } from "@/resources/bases/types";

export const fetchWorkflows = (baseID: number) => (
  dispatch: ThunkDispatch<{}, {}, any>
) => {
  dispatch(loadWorkflows());
  const url = `${config.TSE_API}/bases/${baseID}/workflows`;
  return request(url)
    .then(({ data }) => {
      const { entities, result } = normalize(data, workflowSchema.workflowList);
      const { workflows = {} } = entities;
      dispatch(loadWorkflowsSuccess(workflows, result));
      if (result.length > 0) {
        dispatch(fetchWorkflowActions(baseID));
      }
    })
    .catch(error => {
      dispatch(loadWorkflowsError(error));
    });
};

type State = {
  workflows: WorkflowsState;
  bases: BasesState;
};

export const fetchWorkflowActions = (baseID: number) => (
  dispatch: any,
  getState: () => State
) => {
  const workflowSelector = makeSelectCurrentWorkflow(baseID);
  let workflow = workflowSelector(getState());
  if (!workflow) return false;
  const url = `${config.TSE_API}/bases/${baseID}/workflows/${
    workflow.id
  }/actions`;
  return request(url)
    .then(({ data }) => {
      const {
        entities: { actions = {} },
        result
      } = normalize(data, actionSchema.actionList);
      // Set initialActionID manually after create first action / delete last action
      if (result.length <= 1) {
        const initialActionID = result.length === 0 ? 0 : result[0];
        workflow = set("initialActionID", initialActionID)(workflow);
        const {
          entities: { workflows = {} }
        } = normalize(workflow, workflowSchema.workflow);
        dispatch(updateWorkflowSuccess(workflows));
      }

      return dispatch(loadWorkflowActionsSuccess(actions, result));
    })
    .catch(error => {
      dispatch(loadWorkflowActionsError(error));
    });
};

export const createWorkflowAction = (baseID: number, action: ActionMedia) => (
  dispatch: ThunkDispatch<{}, {}, any>,
  getState: () => any
) => {
  const workflowSelector = makeSelectCurrentWorkflow(baseID);
  const workflow = workflowSelector(getState());
  if (!workflow) return false;
  const url = `${config.TSE_API}/bases/${baseID}/workflows/${
    workflow.id
  }/actions`;
  return request(url, {
    method: "post",
    data: action
  })
    .then(() => dispatch(fetchWorkflowActions(baseID)))
    .then(() => {
      if (action.id === -1) {
        dispatch(removeWorkflowTempAction());
      }
      return dispatch(setLastSave(Date.now()));
    })
    .catch(error => {
      dispatch(createWorkflowActionError(error));
    });
};

export const updateWorkflowAction = (baseID: number, action: ActionMedia) => (
  dispatch: ThunkDispatch<{}, {}, any>,
  getState: () => State
) => {
  const workflowSelector = makeSelectCurrentWorkflow(baseID);
  const workflow = workflowSelector(getState());
  if (!workflow) return false;
  const url = `${config.TSE_API}/bases/${baseID}/workflows/${
    workflow.id
  }/actions/${action.id}`;
  return request(url, {
    method: "put",
    data: action
  })
    .then(() => dispatch(fetchWorkflowActions(baseID)))
    .then(() => dispatch(setLastSave(Date.now())))
    .catch(error => {
      dispatch(updateWorkflowActionError(error));
      return false;
    });
};

export const deleteWorkflowAction = (baseID: number, actionId: number) => (
  dispatch: ThunkDispatch<{}, {}, any>,
  getState: () => State
) => {
  const workflowSelector = makeSelectCurrentWorkflow(baseID);
  const workflow = workflowSelector(getState());
  if (!workflow) return false;
  const url = `${config.TSE_API}/bases/${baseID}/workflows/${
    workflow.id
  }/actions/${actionId}`;
  return request(url, {
    method: "delete"
  })
    .then(() => dispatch(fetchWorkflowActions(baseID)))
    .then(() => dispatch(removeWorkflowAction(actionId)))
    .then(() => dispatch(setLastSave(Date.now())))
    .catch((error: Error) => {
      dispatch(deleteWorkflowActionError(error));
      return false;
    });
};

export const fetchBaseParams = (baseID: number) => (
  dispatch: ThunkDispatch<{}, {}, any>
) => {
  const url = `${config.TSE_API}/bases/${baseID}/params`;
  return request(url)
    .then(({ data }) => {
      const { entities, result } = normalize(data, paramList);
      const { params = {} } = entities;
      dispatch(loadBaseParamsSuccess(params, result));
    })
    .catch(error => {
      console.log(error);
    });
};

export const fetchBase = (baseID: number): any => (
  dispatch: ThunkDispatch<{}, {}, any>
): Promise<void> => {
  const url = `${config.TSE_API}/my-org-type/bases/${baseID}`;
  return request(url)
    .then(({ data }) => {
      const { entities, result } = normalize(data, base);
      const { bases = {} } = entities;
      dispatch(loadBasesSuccess(bases, [result]));
    })
    .catch((error: Error) => {
      console.log(error);
    });
};

export const fetchBaseContent = (baseID: number) => (
  dispatch: ThunkDispatch<{}, {}, any>,
  getState: () => State
) => {
  const url = `${config.TSE_API}/my-org-type/bases/${baseID}/content`;
  return request(url)
    .then(({ data }: any) => {
      const selector = makeSelectById();
      let bases = selector(getState());
      const currentBase = bases[baseID];
      const newBase = { ...currentBase, ...data };
      bases = set(baseID, newBase)(bases);
      dispatch(updateBaseSuccess(bases));
    })
    .catch((error: Error) => {
      console.log(error);
    });
};

export const fetchBaseData = (baseID: number) => (
  dispatch: ThunkDispatch<{}, {}, any>
) => {
  return dispatch(fetchBase(baseID))
    .then(() => dispatch(fetchBaseParams(baseID)))
    .then(() => dispatch(fetchBaseContent(baseID)));
};
