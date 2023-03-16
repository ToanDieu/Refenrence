import { RouteComponentProps } from "react-router-dom";

import { createSelector } from "reselect";
import { initialState } from "./reducer";
import { State, WorkFlowDetailState } from "./types";
import { makeSelectActions } from "@/resources/actions/selectors";
import { ActionMedia } from "@/resources/actions";
import { makeSelectWorkflows } from "@/resources/workflows/selectors";
import { WorkflowMedia } from "@/resources/workflows";
import { makeSelectParams } from "@/resources/params/selectors";
import { ParamMedia } from "@/resources/params";
import { makeSelectById } from "@/resources/bases/selectors";
import { makeSelectCurrentLanguage } from "@/i18n/selectors";

export const selectWorkflowDetail = (state: State) =>
  state.workflowDetail || initialState;

interface Params {
  baseID: string;
}

export const selectMatchParams = (
  _: State,
  props: RouteComponentProps<Params>
) => props.match.params;

export const makeSelectQueryBaseID = () =>
  createSelector(
    selectMatchParams,
    (params: Params) => +params.baseID // parse to number
  );

export const makeSelectBaseID = () =>
  createSelector(
    selectWorkflowDetail,
    (state: WorkFlowDetailState) => state.baseID
  );

export const makeSelectLoading = () =>
  createSelector(
    selectWorkflowDetail,
    (state: WorkFlowDetailState) => state.loading
  );

export const makeSelectError = () =>
  createSelector(
    selectWorkflowDetail,
    (state: WorkFlowDetailState) => state.error
  );

export const makeSelectIsEditMode = () =>
  createSelector(
    selectWorkflowDetail,
    (state: WorkFlowDetailState) => state.isEditMode
  );

export const makeSelectLastSave = () =>
  createSelector(
    selectWorkflowDetail,
    (state: WorkFlowDetailState) => state.lastSave
  );

export const makeSelectWorkflowsByBase = (baseID: number) =>
  createSelector(
    makeSelectWorkflows(),
    (workflows: WorkflowMedia[]) =>
      workflows.filter(workflow => workflow.baseID === baseID)
  );

// Our current base only contains one workflow: workflows[0]
export const makeSelectCurrentWorkflow = (baseID: number) =>
  createSelector(
    makeSelectWorkflowsByBase(baseID),
    (workflows: WorkflowMedia[]) => workflows[0]
  );

export const makeSelectActionsByWorkflow = (baseID: number) =>
  createSelector(
    makeSelectCurrentWorkflow(baseID),
    makeSelectActions(),
    (workflow: WorkflowMedia, actions: ActionMedia[]) =>
      workflow
        ? actions.filter(action => action.workflowID === workflow.id)
        : []
  );

export const makeSelectParamsByBase = (baseID: number) =>
  createSelector(
    makeSelectParams(),
    (params: ParamMedia[]) => params.filter(param => param.baseID === baseID)
  );

export const makeSelectBase = () =>
  createSelector(
    makeSelectById(),
    makeSelectBaseID(),
    (byId, baseID) => (baseID ? byId[baseID] : undefined)
  );

export const makeSelectPassFieldsByLanguage = () =>
  createSelector(
    makeSelectBase(),
    makeSelectCurrentLanguage(),
    (base, currentLanguage) =>
      base && base.fields
        ? base.fields.back.map(field => ({
            id: field.id,
            ...field.langs[currentLanguage]
          }))
        : []
  );
