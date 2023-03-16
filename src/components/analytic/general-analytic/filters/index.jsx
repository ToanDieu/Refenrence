import React, { Component } from "react";
import PropTypes from "prop-types";

import FilterGroup from "../filter-group/container";

export default class Filters extends Component {
  static propTypes = {
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        headerLabel: PropTypes.string.isRequired,
        adderLabel: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        onFetch: PropTypes.func.isRequired,
        onAllEnable: PropTypes.func.isRequired
      })
    )
  };

  render = () =>
    this.props.filters.map((filter, index) => (
      <FilterGroup
        key={index}
        headerLabel={filter.headerLabel}
        adderLabel={filter.adderLabel}
        onChange={filter.onChange}
        onFetch={filter.onFetch}
        onAllEnable={filter.onAllEnable}
      />
    ));
}
