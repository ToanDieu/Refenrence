import { schema } from "normalizr";

export const param = new schema.Entity("params", {}, {idAttribute: "ID"});
export const paramList = [param];
