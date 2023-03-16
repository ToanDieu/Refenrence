import axios from "axios/index";
import { defaultHeaders } from "@/actions/utils";
import config from "@/appConfig";

export const getBaseTags = ({ baseIDs }) => () =>
  axios
    .post(
      `${config.TSE_API}/bases/tags/ids`,
      { baseIDs },
      {
        headers: defaultHeaders()
      }
    )
    .then(({ data }) => data)
    .catch(err => err);
