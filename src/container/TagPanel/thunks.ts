import { normalize } from "normalizr";
import { isArray, set } from "lodash/fp";

import config from "@/appConfig";
import request from "@/utils/request";
import * as baseSchema from "@/resources/bases/schema";
import * as tagSchema from "@/resources/tags/schema";
import { makeSelectById } from "@/resources/bases/selectors";
import { BasesState } from "@/resources/bases/types";
import { createTagSuccess } from "@/resources/tags/actions";
import { loadBasesSuccess, updateBaseSuccess } from "@/resources/bases/actions";

export const fetchBaseTags = (baseIDs: number[]) => (
  dispatch: any,
  getState: () => { bases: BasesState }
) => {
  return request(`${config.TSE_API}/bases/tags/ids`, {
    method: "post",
    data: { baseIDs }
  }).then(({ data }) => {
    if (isArray(data)) {
      // Set tagIDs property for specified bases
      const selector = makeSelectById();
      const bases = selector(getState());
      const newBases = data.map(({ baseID, tagIDs }) => ({
        ...bases[baseID],
        tagIDs
      }));
      const { entities, result } = normalize(newBases, baseSchema.baseList);
      const { bases: normalizedBases = {} } = entities;
      dispatch(loadBasesSuccess(normalizedBases, result));
    }
  });
};

export const addBaseTag = (baseID: number, tagID: number) => (
  dispatch: any,
  getState: () => { bases: BasesState }
) => {
  return request(`${config.TSE_API}/bases/${baseID}/tags/${tagID}`, {
    method: "patch"
  })
    .then(() => {
      const selector = makeSelectById();
      const bases = selector(getState());
      const base = bases[baseID];
      const newBase = set(
        "tagIDs",
        base.tagIDs ? base.tagIDs.concat(tagID) : [tagID]
      )(base);
      const { entities } = normalize(newBase, baseSchema.base);
      const { bases: normalizedBases = {} } = entities;
      dispatch(updateBaseSuccess(normalizedBases));
    })
    .catch(error => {
      console.log("add Base tags error", error.message);
    });
};

export const removeBaseTag = (baseID: number, tagID: number) => (
  dispatch: any,
  getState: () => { bases: BasesState }
) => {
  return request(`${config.TSE_API}/bases/${baseID}/tags/${tagID}`, {
    method: "delete"
  })
    .then(() => {
      const selector = makeSelectById();
      const bases = selector(getState());
      const base = bases[baseID];
      const newBase = set("tagIDs", base.tagIDs.filter(id => id !== tagID))(
        base
      );
      const { entities } = normalize(newBase, baseSchema.base);
      const { bases: normalizedBases = {} } = entities;
      dispatch(updateBaseSuccess(normalizedBases));
    })
    .catch(error => {
      console.log("remove Base tags error", error.message);
    });
};

export const createTag = (name: string) => (dispatch: any) => {
  return request(`${config.TSE_API}/tags`, {
    method: "post",
    data: { name }
  })
    .then(({ data }) => {
      const { entities, result } = normalize(data, tagSchema.tag);
      const { tags = {} } = entities;
      dispatch(createTagSuccess(tags, result));
      return result;
    })
    .catch(error => {
      console.log("create tags error", error.message);
    });
};

export const createTagAndAddToBase = (baseID: number, tagName: string) => (
  dispatch: any
) => {
  return dispatch(createTag(tagName)).then((id: number) => {
    if (id) {
      dispatch(addBaseTag(baseID, id));
    }
  });
};
