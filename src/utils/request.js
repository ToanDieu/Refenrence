import axios from "axios";
import { store } from "@/store/configureStore";
import { setLogout } from "@/actions/user";

export function defaultHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  };
}

export default function request(url, options) {
  return axios(url, {
    headers: defaultHeaders(),
    ...options
  }).catch(error => {
    if (error.response && error.response.status === 401) {
      store.dispatch(setLogout());
      return error;
    }

    throw error;
  });
}
