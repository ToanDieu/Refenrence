import React from "react";
import PropTypes from "prop-types";

import { Card } from "element-react";
import Filters from "@/components/analytic/general-analytic/analytic-filters";

export default class FilterSiderBar extends React.Component {
  static propTypes = {
    onBaseChange: PropTypes.func,
    onTagChange: PropTypes.func,
    onBaseAllEnable: PropTypes.func,
    onTagAllEnable: PropTypes.func
  };

  render() {
    const {
      onBaseChange,
      onTagChange,
      onBaseAllEnable,
      onTagAllEnable
    } = this.props;

    return (
      <Card
        className="box-card"
        header={
          <div className="clearfix">
            <span className="el-card__title" style={{ lineHeight: "36px" }}>
              filter
            </span>
          </div>
        }
      >
        <Filters
          onBaseChange={baseIds => onBaseChange(baseIds)}
          onTagChange={tagIds => onTagChange(tagIds)}
          onBaseAllEnable={onBaseAllEnable}
          onTagAllEnable={onTagAllEnable}
        />
      </Card>
    );
  }
}
