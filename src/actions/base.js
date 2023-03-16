import axios from "axios";
import { dissoc, pathOr } from "ramda";
import { normalize } from "normalizr";

import config from "../appConfig";
import * as types from "../constants/actionTypes";
import { asyncActionCreator, defaultHeaders, catchHandler } from "./utils";
import { accessStore } from "@/actions/provider";
import configs from "../constants/orgConfigs";
import * as baseSchema from "@/resources/bases/schema";
import { createBaseSuccess } from "@/resources/bases/actions";

export const fetchBaseList = asyncActionCreator(
  types.BASE_LIST,
  ({ typeID }) => () =>
    axios.get(`${config.TSE_API}/my-org/types/${typeID}/bases`, {
      headers: defaultHeaders()
    })
);

export const fetchBaseListByTag = asyncActionCreator(
  types.BASE_LIST,
  ({ typeID, tagID }) => () =>
    axios.get(`${config.TSE_API}/my-org/types/${typeID}/bases?tagID=${tagID}`, {
      headers: defaultHeaders()
    })
);

export const fetchBaseContent = asyncActionCreator(
  types.BASE_CONTENT,
  params => () =>
    axios.get(`${config.TSE_API}/my-org-type/bases/${params.baseID}/content`, {
      headers: defaultHeaders()
    })
);

export const updateBaseWithoutStore = ({ baseID, payload }) => {
  return () =>
    axios
      .put(
        `${config.TSE_API}/type-alpha/bases/${baseID}`,
        { ...payload },
        {
          headers: defaultHeaders()
        }
      )
      .then(res => res);
};

export const submitNewBase = asyncActionCreator(
  types.BASE_CREATE,
  params => dispatch => {
    console.log("submitNewBase__payload: ", params);
    const sourceID = parseInt(params.values.sourceID, 10);

    let val;
    if (isNaN(params.values.sourceID)) {
      val = dissoc("sourceID", params.values);
    } else {
      val = { ...params.values, sourceID };
    }

    if (!val.style) {
      accessStore().orgNameProvider(orgName => {
        val.style = pathOr(
          "",
          [orgName, "display", "passCreator", "passTypes", 0],
          configs
        );
      });
      console.log("val.style: ", val.style);
    }

    return axios
      .post(
        `${config.TSE_API}/type/${params.typeID}/alpha/bases`,
        { ...val },
        {
          headers: defaultHeaders()
        }
      )
      .then(({ data }) => {
        // dispatch(fetchBaseList({ typeID: params.typeID }));
        const { entities, result } = normalize(data, baseSchema.base);
        const { bases = {} } = entities;
        dispatch(createBaseSuccess(bases, result));
      });
  }
);

export const updateBaseContent = params => {
  return axios
    .put(
      `${config.TSE_API}/type-alpha/bases/${params.baseID}/content`,
      { ...params.values },
      {
        headers: defaultHeaders()
      }
    )
    .then(({ data }) => data);
};

export const updateBaseImages = asyncActionCreator(
  types.BASE__IMAGES_UPDATE,
  params => () => {
    return axios.put(
      `${config.TSE_API}/type-alpha/bases/${params.baseID}/base__images`,
      params.formData,
      {
        headers: defaultHeaders()
      }
    );
  }
);

export const getBaseSteps = asyncActionCreator(
  types.BASE__STEPS,
  ({ baseID }) => () =>
    axios.get(`${config.TSE_API}/bases/${baseID}/alpha/base__steps`, {
      headers: defaultHeaders()
    })
);

export const getBaseStepsWithoutStore = ({ baseID }) => () => {
  return axios
    .get(`${config.TSE_API}/bases/${baseID}/alpha/base__steps`, {
      headers: defaultHeaders()
    })
    .then(({ data }) => data)
    .catch(err => err);
};

export const getBaseContentWithoutStore = ({ baseID }) => () => {
  return axios
    .get(`${config.TSE_API}/my-org-type/bases/${baseID}/content`, {
      headers: defaultHeaders()
    })
    .then(({ data }) => data)
    .catch(err => err);
};

export const createBaseStepsWithoutStore = ({ baseID, payload }) => () => {
  return axios
    .post(`${config.TSE_API}/bases/${baseID}/alpha/base__steps`, payload, {
      headers: defaultHeaders()
    })
    .then(({ data }) => data)
    .catch(err => err);
};

export const createBaseSteps = ({ baseID, payload }) => dispatch => {
  return axios
    .post(`${config.TSE_API}/bases/${baseID}/alpha/base__steps`, payload, {
      headers: defaultHeaders()
    })
    .then(() =>
      // dispatch({ type: types.BASE__STEPS.SUCCESS, payload: [res.data] })
      dispatch(getBaseSteps({ baseID }))
    )
    .catch(err => catchHandler(types.BASE__STEPS.FAILURE, err, dispatch));
};

export const cancelPush = ({ baseID, stepID }) => () => {
  return axios
    .delete(`${config.TSE_API}/bases/${baseID}/alpha/base__steps/${stepID}`, {
      headers: defaultHeaders()
    })
    .then()
    .catch(err => {
      console.log("cancelPush", err);
    });
};

export const fetchBase = asyncActionCreator(types.BASE, ({ baseID }) => () =>
  axios.get(`${config.TSE_API}/my-org-type/bases/${baseID}`, {
    headers: defaultHeaders()
  })
);

export const fetchBaseWithoutStore = baseID => () => {
  return axios
    .get(`${config.TSE_API}/my-org-type/bases/${baseID}`, {
      headers: defaultHeaders()
    })
    .then(({ data }) => data)
    .catch(err => err);
};

export const fetchBasesContentWithoutStore = (typeID, payload) => () => {
  return axios
    .post(
      `${config.TSE_API}/my-org/types/${typeID}/bases/content/ids`,
      payload,
      {
        headers: defaultHeaders()
      }
    )
    .then(({ data }) => data)
    .catch(err => err);
};

export const fetchBaseParam = (baseId, token) => () => {
  return axios
    .get(`${config.TSE_API}/bases/${baseId}/params`, {
      headers: defaultHeaders(),
      cancelToken: token
    })
    .then(response => response.data)
    .catch(err => {
      throw err;
    });
};

export const fetchBaseParamsWithoutStore = ({ baseID }) => () => {
  return axios
    .get(`${config.TSE_API}/bases/${baseID}/params`, {
      headers: defaultHeaders()
    })
    .then(({ data }) => {
      return data;
    })
    .catch(err => err);
};

export const updateBaseParamsWithoutStore = ({ baseID, payload }) => () => {
  return axios
    .put(`${config.TSE_API}/bases/${baseID}/params`, payload, {
      headers: defaultHeaders()
    })
    .then(({ data }) => data)
    .catch(err => err);
};

export const updateSingleBaseParamWithoutStore = ({
  baseID,
  paramID,
  payload
}) => () => {
  return axios
    .put(`${config.TSE_API}/bases/${baseID}/params/${paramID}`, payload, {
      headers: defaultHeaders()
    })
    .then(({ data }) => data)
    .catch(err => err);
};

export const removeSingleBaseParamWithoutStore = ({
  baseID,
  paramID
}) => () => {
  return axios
    .delete(`${config.TSE_API}/bases/${baseID}/params/${paramID}`, {
      headers: defaultHeaders()
    })
    .then(({ data }) => {
      return data;
    })
    .catch(err => err);
};

export const createSingleBaseParamWithoutStore = ({
  baseID,
  payload
}) => () => {
  return axios
    .post(`${config.TSE_API}/bases/${baseID}/params`, payload, {
      headers: defaultHeaders()
    })
    .then(({ data }) => data)
    .catch(err => err);
};
