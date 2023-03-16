import { apiCaller } from "./init";

import { Message } from "element-react";
import { fetchCaseDetail } from "@/actions/case";

export const archiveCase = ({ caseId }) => () =>
  apiCaller().put(`/my-org-type-base/cases/${caseId}/archive`);

export const updateCase = ({ caseId, payload }) => dispatch =>
  apiCaller()
    .put(`/my-org-type-base/cases/${caseId}`, payload)
    .then(response => {
      dispatch(fetchCaseDetail({ caseID: caseId }));
      return response;
    });

const messageWrapper = (
  action,
  success = "Action success",
  fail = "Action fail"
) =>
  action
    .then(resp => {
      Message({
        type: "success",
        message: success
      });
      return resp;
    })
    .catch(err => {
      Message({
        type: "error",
        message: fail
      });
      return err;
    });

export const holdCase = ({ caseId, enable, mention, duration }) => () =>
  messageWrapper(
    apiCaller().patch(`/cases/${caseId}/case__hold`, {
      enable,
      mention,
      duration
    }),
    "Toggle hold case success",
    "Fail to toggle hold case status"
  );

export const resetStepTimers = ({ caseId, stepNum }) => () =>
  messageWrapper(
    apiCaller().patch(`/cases/${caseId}/case__start-time`, {
      stepNum
    }),
    "Reset steps success",
    "Reset steps fail"
  );
