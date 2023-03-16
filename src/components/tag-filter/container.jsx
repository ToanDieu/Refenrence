import React, { Component } from "react";
import { func } from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { pathOr } from "ramda";
import { getTranslate } from "react-localize-redux";

import { getAvailableTagsStore } from "@/actions/tag";

import TagFilter from "./index";

class TagFilterContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.getAvailableTagsStore();
  }

  render = () => {
    const tags = pathOr([], ["tagList", "data"], this.props);
    return (
      <TagFilter
        {...this.props}
        tags={tags}
        label={this.props.translate("filterByTag")}
      />
    );
  };
}

TagFilterContainer.propTypes = {
  getAvailableTagsStore: func,
  translate: func
};

const mapState = ({ tagList, locale }) => ({
  tagList,
  translate: getTranslate(locale)
});
const mapDispatch = dispatch =>
  bindActionCreators(
    {
      getAvailableTagsStore
    },
    dispatch
  );

export default connect(
  mapState,
  mapDispatch
)(TagFilterContainer);
