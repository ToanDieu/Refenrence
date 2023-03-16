import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { persistReducer } from "redux-persist";
import { localeReducer as locale } from "react-localize-redux";
import storage from "redux-persist/lib/storage";

import * as types from "../constants/actionTypes";

import userReducer from "./userReducer";
import notifyReducer from "./notifyReducer";
import caseCreateReducer from "./caseCreateReducer";
import pageDetailReducer from "./pageDetailReducer";
import additinalBaseReducer from "./baseReducer";

import formsDuck from "@/ducks/forms";

import { loadStateReducer } from "./utils";
import history from "@/utils/history";

import workflows from "@/resources/workflows/reducer";
import actions from "@/resources/actions/reducer";
import params from "@/resources/params/reducer";
import bases from "@/resources/bases/reducer";
import tags from "@/resources/tags/reducer";
import baseListPage from "@/container/BaseListPage/reducer";

const typeList = loadStateReducer(types.TYPE_LIST);
const typeOrg = loadStateReducer(types.TYPE_ORG);
// //Base
const baseMeta = loadStateReducer(types.BASE);
const baseList = loadStateReducer(types.BASE_LIST);
const tagList = loadStateReducer(types.TAG_LIST);
// //Base Content
const baseDetail = loadStateReducer(types.BASE_CONTENT, additinalBaseReducer);
const baseStepList = loadStateReducer(types.BASE__STEPS);

const caseList = loadStateReducer(types.CASE_LIST);
const caseDetail = loadStateReducer(types.CASE_DETAIL);
const caseSearchList = loadStateReducer(types.CASE_SEARCH);

const passAnalytic = loadStateReducer(types.PASS_ANALYTIC);
const colAnalytic = loadStateReducer(types.COL_ANALYTIC);
const passDetail = loadStateReducer(types.PASS_DETAIL);

const changePasswordReducer = loadStateReducer(types.USER_CHANGE_PASSWORD);
const getOrgName = loadStateReducer(types.GET_USER_ORG);
const version = loadStateReducer(types.GET_VERSION);

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    router: connectRouter(history),
    locale,
    user: userReducer,
    notification: notifyReducer,
    pageDetail: pageDetailReducer,
    baseStepList,
    typeList,
    typeOrg,
    baseList,
    tagList,
    baseDetail,
    caseList,
    caseDetail,
    formsDuck,
    caseCreate: caseCreateReducer,
    caseSearchList,
    passAnalytic,
    colAnalytic,
    passDetail,
    changePassword: changePasswordReducer,
    getOrgName,
    baseMeta,
    workflows,
    actions,
    params,
    bases,
    tags,
    version,
    baseListPage,
    ...injectedReducers
  });

  const persistedReducer = persistReducer(
    {
      key: "root",
      blacklist: [
        "router",
        "caseList",
        "workflows",
        "actions",
        "params",
        "bases",
        "tags",
        "baseListPage",
        ...Object.keys(injectedReducers)
      ],
      storage
    },
    rootReducer
  );

  return persistedReducer;
}
