import axios from "axios/index";
import { defaultHeaders } from "@/actions/utils";
import config from "@/appConfig";

export const getAvailableTags = () => () =>
  axios
    .get(`${config.TSE_API}/tags`, {
      headers: defaultHeaders()
    })
    .then(({ data }) => data)
    .catch(err => err);

export const createNewTag = ({ name }) => () =>
  axios
    .post(
      `${config.TSE_API}/tags`,
      { name },
      {
        headers: defaultHeaders()
      }
    )
    .then(({ data }) => data)
    .catch(err => err);

export const addBaseTag = ({ baseId, tagId }) => () =>
  axios
    .patch(
      `${config.TSE_API}/bases/${baseId}/tags/${tagId}`,
      { name },
      {
        headers: defaultHeaders()
      }
    )
    .then(({ data }) => data)
    .catch(err => err);

export const getSelectedTags = ({ baseId }) => () =>
  axios
    .get(`${config.TSE_API}/bases/${baseId}/tags`, {
      headers: defaultHeaders()
    })
    .then(({ data }) => data)
    .catch(err => err);

export const removeTag = ({ baseId, tagId }) => () =>
  axios
    .delete(`${config.TSE_API}/bases/${baseId}/tags/${tagId}`, {
      headers: defaultHeaders()
    })
    .then(({ data }) => data)
    .catch(err => err);
