import * as types from "../constants/actionTypes";
import axios from "axios";
import { push } from "connected-react-router";
import config from "../appConfig";
import jwtDecode from "jwt-decode";
import { fetchTypeOrg, fetchBaseOrg } from "./type";
import { webAuth } from "../auth/auth";
import { asyncActionCreator, defaultHeaders } from "@/actions/utils";

import { accessStore } from "@/actions/provider";

export const loginUserSuccess = data => dispatch => {
  return dispatch({
    type: types.USER_LOGIN.SUCCESS,
    payload: data
  });
};

export function loginUserFailure(payload) {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  localStorage.removeItem("baseID");
  return {
    type: types.USER_LOGIN.FAILURE,
    payload
  };
}

export function loginUserRequest() {
  return {
    type: types.USER_LOGIN.REQUEST
  };
}

export function logout(error) {
  return {
    type: types.USER_LOGOUT,
    payload: error
  };
}

export const setLogout = (error = "") => dispatch => {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  localStorage.removeItem("baseID");
  localStorage.removeItem("persist:root");
  webAuth.logout({
    clientID: config.AUTH0_CLIENTID,
    returnTo: config.TSE_SERVE_DOMAIN
  });
  dispatch(logout(error));
};

export const login = (accessToken = "", idToken = "") => dispatch => {
  localStorage.setItem("loginLoading", true);
  dispatch(loginUserRequest());
  if (accessToken !== "" && idToken !== "") {
    const userData = jwtDecode(idToken);
    try {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("userData", JSON.stringify(userData));
      return axios
        .get(`${config.TSE_API}/user/org`, {
          headers: defaultHeaders()
        })
        .then(response => {
          const orgName = response.data.name;
          dispatch({
            type: types.GET_USER_ORG.SUCCESS,
            payload: response.data.name
          });
          dispatch(
            loginUserSuccess({
              token: accessToken,
              orgName,
              userData
            })
          );
          return dispatch(fetchTypeOrg(orgName)).then(res => {
            return dispatch(fetchBaseOrg(res.payload[0].id)).then(() => {
              dispatch(push("/"));
            });
          });
        });
    } catch (err) {
      return dispatch(loginUserFailure(err));
    }
  }

  return webAuth.authorize();
};

export const changePassword = asyncActionCreator(
  types.USER_CHANGE_PASSWORD,
  params => () => {
    return axios.post(`${config.TSE_API}/users/changepassword`, params, {
      headers: defaultHeaders()
    });
  }
);
export const changeUserPassword = ({ userID, params }) => () => {
  return axios
    .put(`${config.TSE_API}/users/${userID}/password`, params, {
      headers: defaultHeaders()
    })
    .then(({ response }) => response)
    .catch(err => {
      throw err;
    });
};

export const createUser = params => () => {
  return accessStore().orgNameProvider(orgName => {
    return axios
      .post(`${config.TSE_API}/orgs/${orgName}/users`, params, {
        headers: defaultHeaders()
      })
      .then(({ response }) => response)
      .catch(err => {
        throw err;
      });
  });
};

export const editUser = ({ id, data }) => () => {
  return accessStore().orgNameProvider(orgName => {
    return axios.put(`${config.TSE_API}/orgs/${orgName}/users/${id}`, data, {
      headers: defaultHeaders()
    });
  });
};

export const fetchRoleList = () => () => {
  return accessStore().orgNameProvider(orgName => {
    if (orgName) {
      return axios
        .get(`${config.TSE_API}/roles?orgName=${orgName}`, {
          headers: defaultHeaders()
        })
        .then(res => {
          const roleList = {
            data: res.data
          };
          return {
            ...res,
            roleList
          };
        })
        .catch(err => {
          const roleList = {
            error: err.message
          };
          return {
            ...err,
            roleList
          };
        });
    }
    return null;
  });
};

export const fetchUserListByOrg = ({ numItem, page }) => () => {
  return accessStore().orgNameProvider(orgName => {
    return axios
      .get(
        `${config.TSE_API}/orgs/${orgName}/users?limit=${numItem ||
          10}&page=${page || 1}`,
        {
          headers: defaultHeaders()
        }
      )
      .then(res => {
        const userList = {
          data: res.data
        };
        return {
          ...res,
          userList
        };
      })
      .catch(err => {
        const userList = {
          error: err.message
        };
        return {
          ...err,
          userList
        };
      });
  });
};

export const activeUserByID = ({ userID }) => () => {
  return axios.patch(
    `${config.TSE_API}/users/${userID}/activate`,
    {},
    {
      headers: defaultHeaders()
    }
  );
};

export const blockUserByID = ({ userID }) => () => {
  return axios.patch(
    `${config.TSE_API}/users/${userID}/deactivate`,
    {},
    {
      headers: defaultHeaders()
    }
  );
};
