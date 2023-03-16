import { ThunkDispatch } from "redux-thunk";
import { normalize } from "normalizr";

import config from "@/appConfig";
import request from "@/utils/request";
import * as baseSchema from "@/resources/bases/schema";
import * as tagSchema from "@/resources/tags/schema";
import { loadAllPending, loadAllError, loadAllSuccess } from "./actions";
import { loadBasesSuccess } from "@/resources/bases/actions";
import { loadTagsSuccess } from "@/resources/tags/actions";
import { makeSelectAllIds } from "@/resources/bases/selectors";
import { BasesState } from "@/resources/bases/types";
import { fetchBaseTags } from "../TagPanel/thunks";

export const fetchTags = () => (dispatch: ThunkDispatch<{}, {}, any>) => {
  const url = `${config.TSE_API}/tags`;
  return request(url).then(({ data }) => {
    const { entities, result } = normalize(data, tagSchema.tagList);
    const { tags = {} } = entities;
    dispatch(loadTagsSuccess(tags, result));
  });
};

export const fetchBases = (typeID: number) => (
  dispatch: ThunkDispatch<{}, {}, any>
) => {
  const url = `${config.TSE_API}/my-org/types/${typeID}/bases`;
  return request(url).then(({ data }) => {
    const { entities, result } = normalize(data, baseSchema.baseList);
    const { bases = {} } = entities;
    dispatch(loadBasesSuccess(bases, result));
  });
};

export const fetchAll = (typeID: number) => (
  dispatch: any,
  getState: () => { bases: BasesState }
) => {
  dispatch(loadAllPending());
  return dispatch(fetchTags())
    .then(() => dispatch(fetchBases(typeID)))
    .then(() => {
      const selector = makeSelectAllIds();
      const baseIDs = selector(getState());
      return dispatch(fetchBaseTags(baseIDs));
    })
    .then(() => {
      dispatch(loadAllSuccess());
    })
    .catch((error: Error) => {
      dispatch(loadAllError(error));
    });
};
