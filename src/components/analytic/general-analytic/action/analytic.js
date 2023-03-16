import axios from "axios";
import { defaultHeaders } from "@/actions/utils";
import config from "@/appConfig";
import { pathOr } from "ramda";

export const fetchGeneralAnalytic = payload => (dispatch, store) =>
  axios
    .post(
      `${config.TSE_API}/orgs/${pathOr(
        "",
        ["user", "data", "orgName"],
        store()
      )}/activities/report`,
      payload,
      {
        headers: defaultHeaders()
      }
    )
    .then(({ data }) => data)
    .catch(err => err);
