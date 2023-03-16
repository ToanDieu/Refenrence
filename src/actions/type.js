import * as types from "../constants/actionTypes";
import { defaultHeaders, catchHandler } from "./utils";
import config from "../appConfig";
import axios from "axios";

export const fetchTypeOrg = orgID => dispatch => {
  dispatch({ type: types.TYPE_ORG.REQUEST });
  return axios
    .get(`${config.TSE_API}/my/orgs/${orgID}/types`, {
      headers: defaultHeaders()
    })
    .then(res => dispatch({ type: types.TYPE_ORG.SUCCESS, payload: res.data }))
    .catch(err => catchHandler(types.TYPE_ORG.FAILURE, err, dispatch));
};

export const fetchBaseOrg = typeID => dispatch => {
  dispatch({ type: types.BASE_LIST.REQUEST });
  return axios
    .get(`${config.TSE_API}/my-org/types/${typeID}/bases`, {
      headers: defaultHeaders()
    })
    .then(res => {
      console.log("baseID", res.data);
      localStorage.setItem("baseID", res.data[0].id);
      dispatch({ type: types.BASE_LIST.SUCCESS, payload: res.data });
      return res;
    })
    .catch(err => catchHandler(types.BASE_LIST.FAILURE, err, dispatch));
};
