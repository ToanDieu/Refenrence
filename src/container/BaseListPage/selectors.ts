import { createSelector } from "reselect";
import { RouteComponentProps } from "react-router-dom";

import { initialState, FILTER_ALL } from "./reducer";
import { State, BaseListPageState } from "./types";
import { makeSelectBases } from "@/resources/bases/selectors";
import { BaseMedia } from "@/resources/bases";
import { makeSelectTags } from "@/resources/tags/selectors";

interface Params {
  searchTerm: string;
}

export const selectMatchParams = (
  _: State,
  props: RouteComponentProps<Params>
) => props.match.params;

export const makeSelectSearchTerm = () =>
  createSelector(
    selectMatchParams,
    (params: Params) => params.searchTerm
  );

export const selectBaseListPage = (state: State) =>
  state.baseListPage || initialState;

export const makeSelectLoading = () =>
  createSelector(
    selectBaseListPage,
    (state: BaseListPageState) => state.loading
  );

export const makeSelectError = () =>
  createSelector(
    selectBaseListPage,
    (state: BaseListPageState) => state.error
  );

export const makeSelectTagFilter = () =>
  createSelector(
    selectBaseListPage,
    (state: BaseListPageState) => state.tagFilter
  );

export const makeSelectBasesAndTags = () =>
  createSelector(
    makeSelectBases(),
    makeSelectTags(),
    (bases: BaseMedia[], tags) =>
      bases.map(base => ({
        ...base,
        tags: base.tagIDs
          ? tags.filter(tag => base.tagIDs.includes(tag.id))
          : []
      }))
  );

export const makeSelectBasesByCondition = () =>
  createSelector(
    makeSelectBasesAndTags(),
    makeSelectTagFilter(),
    makeSelectSearchTerm(),
    (bases: BaseMedia[], tagFilter, searchTerm: string) => {
      return bases
        .filter(base => {
          if (!searchTerm) return true;
          const lowerSearchTerm = searchTerm.toLowerCase();
          return (
            base.memo.toLowerCase().includes(lowerSearchTerm) ||
            base.shortcode.toLowerCase().includes(lowerSearchTerm)
          );
        })
        .filter(
          base =>
            tagFilter === FILTER_ALL ||
            (base.tagIDs && base.tagIDs.includes(tagFilter))
        )
        .sort((a, b) =>
          a.memo.toLowerCase().localeCompare(b.memo.toLowerCase())
        );
    }
  );

// TODO: Re-implement
export const selectPageDetail = (state: any) =>
  state.pageDetail || initialState;

export const makeSelectCurrentBaseId = () =>
  createSelector(
    selectPageDetail,
    (state: any) => +state.current.detail.id // Parse to number
  );
