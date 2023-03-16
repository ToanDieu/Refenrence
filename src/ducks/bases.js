import { apiCaller } from "./init";

export const publishBase = ({ baseId }) => () =>
  apiCaller().post(`/bases/${baseId}/publish`);
