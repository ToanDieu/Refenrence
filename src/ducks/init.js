import axios from "axios";
import config from "@/appConfig.js";

function defaultHeaders() {
  return {
    Authorization: "Bearer " + localStorage.getItem("token")
  };
}

export const apiCaller = () => {
  return axios.create({
    baseURL: config.TSE_API,
    headers: defaultHeaders()
  });
};
