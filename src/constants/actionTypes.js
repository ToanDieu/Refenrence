const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";

// automate create req actiontypes
const createRequestTypes = base => ({
  [REQUEST]: `${base}_${REQUEST}`,
  [SUCCESS]: `${base}_${SUCCESS}`,
  [FAILURE]: `${base}_${FAILURE}`
});

export const BASE = createRequestTypes("BASE");
export const BASE_LIST = createRequestTypes("BASE_LIST");
export const TAG_LIST = createRequestTypes("TAG_LIST");
export const TYPE_LIST = createRequestTypes("TYPE_LIST");
export const BASE_CONTENT = createRequestTypes("BASE_CONTENT");
export const BASE_CONTENT_UPDATE = createRequestTypes("BASE_CONTENT_UPDATE");
export const BASE__IMAGES_UPDATE = createRequestTypes("BASE__IMAGES_UPDATE");
export const BASE__STEPS = createRequestTypes("BASE__STEPS");
export const BASE_CREATE = createRequestTypes("BASE_CREATE");
export const TYPE_ORG = createRequestTypes("TYPE_ORG");

export const CASE_LIST = createRequestTypes("CASE_LIST");
export const CASE_DETAIL = createRequestTypes("CASE_DETAIL");
export const CASE_CREATE = createRequestTypes("CASE_CREATE");
export const CASE_SEARCH = createRequestTypes("CASE_SEARCH");
export const CASE_HOLD = createRequestTypes("CASE_HOLD");
export const CLEAR_CASE_FORM = "CLEAR_CASE_FORM";

export const USER_LOGIN = createRequestTypes("USER_LOGIN");
export const USER_LOGOUT = "USER_LOGOUT";
export const USER_CHANGE_PASSWORD = createRequestTypes("USER_CHANGE_PASSWORD");

export const NOTIFY_EVENT = "NOTIFY_EVENT";
export const NOTIFY_BUTTON_CLICK = "NOTIFY_BUTTON_CLICK";
export const NOTIFICATION_LIST = createRequestTypes("NOTIFICATION_LIST");

export const CHANGE_PAGE = "CHANGE_PAGE";
export const PASS_ANALYTIC = createRequestTypes("PASS_ANALYTIC");
export const COL_ANALYTIC = createRequestTypes("COL_ANALYTIC");
export const PASS_DETAIL = createRequestTypes("PASS_DETAIL");

export const GET_USER_ORG = createRequestTypes("GET_USER_ORG");

export const GET_VERSION = createRequestTypes("GET_VERSION");
