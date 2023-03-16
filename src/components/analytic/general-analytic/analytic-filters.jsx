import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import Filters from "./filters/index";

import { getAvailableTags } from "@/actions/tags";

import { pathOr } from "ramda";

@connect(
  store => ({
    bases: pathOr([], ["baseList", "data"], store)
  }),
  dispatch =>
    bindActionCreators(
      {
        getAvailableTags
      },
      dispatch
    )
)
export default class AnalyticFilters extends Component {
  static propTypes = {
    onBaseChange: PropTypes.func,
    onTagChange: PropTypes.func,
    onBaseAllEnable: PropTypes.func,
    onTagAllEnable: PropTypes.func,
    bases: PropTypes.array,
    getAvailableTags: PropTypes.func
  };

  onFetchBases = baseSetter => {
    const bases = this.props.bases;
    const items = bases.map(({ name, id }) => ({ name, key: id }));

    baseSetter(items);
  };

  onFetchTags = tagSetter => {
    const getTags = this.props.getAvailableTags;
    getTags()
      .then(tags => {
        const items = tags.map(({ id, name }) => ({ name, key: id }));

        tagSetter(items);
      })
      .catch(err => console.log(err));
  };

  render = () => {
    const filters = [
      {
        headerLabel: "BASES",
        adderLabel: "More Bases",
        onChange: this.props.onBaseChange,
        onAllEnable: this.props.onBaseAllEnable,
        onFetch: this.onFetchBases
      },
      {
        headerLabel: "TAGS",
        adderLabel: "More Tags",
        onChange: this.props.onTagChange,
        onAllEnable: this.props.onTagAllEnable,
        onFetch: this.onFetchTags
      }
    ];

    return <Filters filters={filters} />;
  };
}
