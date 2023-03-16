import { TagMedia } from "./tags";

type Lang = {
  label: string;
  link: string;
  value: string;
};

type Field = {
  id: string;
  langs: {
    [key: string]: Lang;
  };
};

export type FieldMedia = {
  id: string;
  label: string;
  link: string;
  value: string;
};

export interface BaseMedia {
  id: number;
  memo: string;
  name: string;
  shortcode: string;
  style: string;
  timeZone: string;
  transitType: string;
  updatedAt?: string;
  tagIDs: number[];
  tags: TagMedia[];
  fields?: {
    back: Field[];
  };
}
