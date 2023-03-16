import axios from "axios";
import { Number } from "core-js";
import config from "../appConfig";
import * as types from "../constants/actionTypes";
import { getLanguage, asyncActionCreator, defaultHeaders } from "./utils";

export const clearForm = payload => ({
  type: types.CLEAR_CASE_FORM,
  payload
});

export const fetchCaseListByBase = asyncActionCreator(
  types.CASE_LIST,
  params => () => {
    const lang = getLanguage();
    return axios.get(
      `${config.TSE_API}/my-org-type/bases/${
        params.baseID
      }/cases?lang=${lang}&page=${params.page || 1}&limit=${params.numItem ||
        10}`,
      {
        headers: defaultHeaders()
      }
    );
  }
);

export const fetchCaseList = asyncActionCreator(types.CASE_LIST, params => () =>
  axios.get(`${config.TSE_API}/cases/filters`, {
    headers: defaultHeaders(),
    params
  })
);

export const searchCase = asyncActionCreator(
  types.CASE_SEARCH,
  ({ params, baseID }) => () => {
    console.log("searchCase: ", baseID);
    return axios.get(`${config.TSE_API}/my-org-type/bases/${baseID}/cases`, {
      headers: defaultHeaders(),
      params
    });
  }
);

export const fetchCaseDetail = asyncActionCreator(
  types.CASE_DETAIL,
  params => () => {
    const lang = getLanguage();
    return axios.get(
      `${config.TSE_API}/my-org-type-base/cases/${params.caseID}?lang=${lang}`,
      {
        headers: defaultHeaders()
      }
    );
  }
);

export const submitNewCase = asyncActionCreator(
  types.CASE_CREATE,
  params => () => {
    if (
      typeof params.values.baseID === Number ||
      typeof params.values.baseID === String
    ) {
      params.values.baseID = parseInt(params.values.baseID, 10);
    }
    return axios.post(
      `${config.TSE_API}/my-org-type/bases/${params.values.baseID}/cases`,
      params.values,
      {
        headers: defaultHeaders()
      }
    );
  }
);

export const fetchTypeList = asyncActionCreator(types.TYPE_LIST, () => () =>
  axios.get(`${config.TSE_API}/types/`, { headers: defaultHeaders() })
);

export const turnHold = asyncActionCreator(types.CASE_HOLD, params => () => {
  return axios.patch(
    `${config.TSE_API}/base-alpha/cases/${params.caseID}`,
    {
      holdStatus: {
        patch: {
          from: "",
          op: "replace",
          path: "/isHolding",
          value: params.status
        },
        reasonMessage: params.inputComment
      }
    },
    {
      headers: defaultHeaders()
    }
  );
});

export const fetchListQuestionByBase = ({ baseId, listQuestionId }) => () => {
  return axios
    .post(
      `${config.TSE_API}/my-org-type/bases/${baseId}/report/question`,
      { ListQuestion: listQuestionId },
      { headers: defaultHeaders() }
    )
    .then(response => response.data)
    .catch(err => {
      throw err;
    });
};

export const fetchListFeedbackByBaseAndQuestionId = ({
  baseId,
  questionId,
  numItem,
  page,
  matching,
  end,
  start
}) => () => {
  return axios
    .get(
      `${
        config.TSE_API
      }/my-org-type/bases/${baseId}/report/comment/question/${questionId}`,
      {
        headers: defaultHeaders(),
        params: {
          limit: numItem,
          page,
          matching: matching || "",
          start,
          end
        }
      }
    )
    .then(response => response.data)
    .catch(err => {
      throw err;
    });
};

export const fetchCaseParam = caseID => () => {
  return axios
    .get(`${config.TSE_API}/my-org-type-base/cases/${caseID}/params`, {
      headers: defaultHeaders()
    })
    .then(response => response.data)
    .catch(err => {
      throw err;
    });
};
