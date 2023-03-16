import { ThunkDispatch } from "redux-thunk";
import { normalize } from "normalizr";

import config from "@/appConfig";
import request from "@/utils/request";
import { workflow } from "@/resources/workflows/schema";
import { createWorkflowSuccess } from "@/resources/workflows/actions";
import { makeSelectForm } from "./selectors";
import { State } from "./types";
import { createWorkflowPending, createWorkflowError } from "./actions";

export const createWorkflow = (baseID: number) => (
  dispatch: ThunkDispatch<{}, {}, any>,
  getState: () => State
) => {
  const formSelector = makeSelectForm();
  const formData = formSelector(getState());
  dispatch(createWorkflowPending());
  const url = `${config.TSE_API}/bases/${baseID}/workflows`;
  const { name, description } = formData;
  return request(url, {
    method: "post",
    data: {
      name,
      description
    }
  })
    .then(({ data }) => {
      const { entities, result } = normalize(data, workflow);
      const { workflows = {} } = entities;
      dispatch(createWorkflowSuccess(workflows, result));
    })
    .catch(error => {
      dispatch(createWorkflowError(error));
    });
};
