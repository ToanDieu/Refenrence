import axios from "axios";
import config from "../appConfig";
import * as types from "../constants/actionTypes";
import { asyncActionCreator, defaultHeaders } from "./utils";

const getPassDetail = params => {
  return axios.get(`${config.TSE_API}/bases/${params.baseId}/applejson`, {
    headers: defaultHeaders()
  });
};
export const fetchPassDetail = asyncActionCreator(
  types.PASS_DETAIL,
  params => () => getPassDetail(params)
);

export const fetchPassDetailWithoutStore = params => {
  return getPassDetail(params);
};
