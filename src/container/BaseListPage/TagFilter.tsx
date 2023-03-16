import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import TagFilter from "@/components/presents/TagFilter";
import { makeSelectTags } from "@/resources/tags/selectors";
import { changeTagFilter } from "./actions";

const mapStateToProps = createStructuredSelector<{}, {}>({
  tags: makeSelectTags()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    onSelectTag: (tagID: string) => dispatch(changeTagFilter(+tagID)) // Parse to number
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagFilter) as any;
