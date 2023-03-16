import axios from "axios/index";
import { defaultHeaders, asyncActionCreator } from "@/actions/utils";
import config from "@/appConfig";

import * as types from "@/constants/actionTypes";

export const getAvailableTagsStore = asyncActionCreator(
  types.TAG_LIST,
  () => () =>
    axios.get(`${config.TSE_API}/tags`, {
      headers: defaultHeaders()
    })
);
