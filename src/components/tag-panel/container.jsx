import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getTranslate } from "react-localize-redux";
import { pathOr } from "ramda";

import { getAvailableTagsStore as getAvailableTags } from "@/actions/tag";
import {
  removeTag,
  addBaseTag,
  createNewTag,
  getSelectedTags
} from "@/actions/tags";

import TagPanel from "./index";

class TagPanelContainer extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    selectedTags: []
  };

  refreshTags = () => {
    this.props.getSelectedTags({ baseId: this.props.identifier }).then(tags => {
      this.setState({ selectedTags: tags });
    });
  };

  selectTag = tag => {
    switch (this.props.type) {
      case "base":
        this.props
          .addBaseTag({
            tagId: tag.id,
            baseId: this.props.identifier
          })
          .then(this.refreshTags);
        break;
      default:
        break;
    }
  };

  addTag = inputVal => {
    switch (this.props.type) {
      case "base":
        this.props.createNewTag({ name: inputVal }).then(createdTag => {
          this.props
            .addBaseTag({
              tagId: createdTag.id,
              baseId: this.props.identifier
            })
            .then(() => {
              this.refreshTags();
              this.props.getAvailableTags();
            });
        });
        break;
      default:
        break;
    }
  };

  removeTag = id => {
    this.props
      .removeTag({ baseId: this.props.identifier, tagId: id })
      .then(this.refreshTags());
  };

  render = () => {
    const { availableTags, selectedTagIDs = [], translate } = this.props;
    const initialSelectedTags = availableTags.filter(tag =>
      selectedTagIDs.includes(tag.id)
    );

    const { selectedTags } = this.state;

    return (
      <TagPanel
        {...this.props}
        onSelectTag={this.selectTag}
        onAddTag={this.addTag}
        onRemoveTag={this.removeTag}
        selectedTags={
          selectedTags.length === 0 ? initialSelectedTags : selectedTags
        }
        availableTags={availableTags}
        placeHolder={translate("searchTags")}
      />
    );
  };
}

TagPanelContainer.propTypes = {
  type: PropTypes.string,
  identifier: PropTypes.int,
  selectedTags: PropTypes.array,
  selectedTagIDs: PropTypes.array,
  availableTags: PropTypes.array,
  getAvailableTags: PropTypes.func,
  createNewTag: PropTypes.func,
  addBaseTag: PropTypes.func,
  getSelectedTags: PropTypes.func,
  removeTag: PropTypes.func,
  translate: PropTypes.func
};

export default connect(
  store => ({
    availableTags: pathOr([], ["tagList", "data"], store),
    translate: getTranslate(store.locale)
  }),
  dispatch =>
    bindActionCreators(
      {
        getAvailableTags,
        createNewTag,
        addBaseTag,
        getSelectedTags,
        removeTag
      },
      dispatch
    )
)(TagPanelContainer);
