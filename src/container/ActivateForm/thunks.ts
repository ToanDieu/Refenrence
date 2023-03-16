import { ThunkDispatch } from "redux-thunk";
import { normalize } from "normalizr";

import config from "@/appConfig";
import request from "@/utils/request";
import * as workflowSchema from "@/resources/workflows/schema";
import { updateWorkflowSuccess } from "@/resources/workflows/actions";
import { WorkflowMedia } from "@/resources/workflows";
import {
  activateWorkflowPending,
  activateWorkflowSuccess,
  activateWorkflowError
} from "./actions";

export const activateWorkflow = (baseID: number, workflow: WorkflowMedia) => (
  dispatch: ThunkDispatch<{}, {}, any>
) => {
  dispatch(activateWorkflowPending());
  const url = `${config.TSE_API}/bases/${baseID}/workflows/${workflow.id}`;
  const { name, description } = workflow;
  return request(url, {
    method: "put",
    data: {
      name,
      description,
      active: true
    }
  })
    .then(({ data }) => {
      const { entities } = normalize(data, workflowSchema.workflow);
      const { workflows = {} } = entities;
      dispatch(updateWorkflowSuccess(workflows));
      dispatch(activateWorkflowSuccess());
    })
    .catch(error => {
      dispatch(activateWorkflowError(error));
    });
};
