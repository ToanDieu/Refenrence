import React, { memo, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { TranslateFunction } from "react-localize-redux";

import { makeSelectTranslate } from "@/i18n/selectors";
import Loading from "@/components/Loading";
import BaseList from "@/components/presents/BaseList";
import { BaseMedia } from "@/resources/bases";
import * as thunks from "./thunks";
import TagFilter from "./TagFilter";
import {
  makeSelectError,
  makeSelectLoading,
  makeSelectBasesByCondition,
  makeSelectCurrentBaseId
} from "./selectors";
import { Article, TopBar, PageTitle } from "./styles";

interface Props {
  typeID: number;
  loading: boolean;
  error: Error;
  bases: BaseMedia[];
  currentBaseId: number;
  fetchAll: (typeID: number) => void;
  translate: TranslateFunction;
}

export function BaseListPage({
  typeID,
  loading,
  bases,
  currentBaseId,
  fetchAll,
  translate
}: Props) {
  useEffect(() => {
    if (typeID) {
      fetchAll(typeID);
    }
  }, [typeID]);

  return (
    <Article>
      <TopBar>
        <PageTitle>Bases</PageTitle>
        <TagFilter translate={translate} label={translate("filterByTag") as string} />
      </TopBar>
      {loading && <Loading />}
      {!loading && (
        <BaseList
          bases={bases}
          currentBaseId={currentBaseId}
          translate={translate}
        />
      )}
    </Article>
  );
}

const mapStateToProps = createStructuredSelector<{}, {}>({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  bases: makeSelectBasesByCondition(),
  translate: makeSelectTranslate(),
  currentBaseId: makeSelectCurrentBaseId()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    fetchAll: (typeID: number) => dispatch(thunks.fetchAll(typeID))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withConnect,
  memo
)(BaseListPage);
