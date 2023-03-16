import { memo } from "react";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";

import TagPanel from "@/components/presents/TagPanel";
import { TagMedia } from "@/resources/tags";
import { makeSelectTags } from "@/resources/tags/selectors";
import * as thunks from "./thunks";

const mapStateToProps = createStructuredSelector<{}, {}>({
  availableTags: makeSelectTags()
});

export function mapDispatchToProps(dispatch: any, { baseID }: any) {
  return {
    onSelectTag: (tag: TagMedia) => dispatch(thunks.addBaseTag(baseID, tag.id)),
    onRemoveTag: (id: number) => dispatch(thunks.removeBaseTag(baseID, id)),
    onAddTag: (tagName: string) =>
      dispatch(thunks.createTagAndAddToBase(baseID, tagName))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withConnect,
  memo
)(TagPanel) as any;
