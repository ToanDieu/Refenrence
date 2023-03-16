import React, { Component } from "react";
import PropTypes from "prop-types";

import moreIcon from "../assets/icons/more.svg";
export default class ScheduledListItem extends Component {
  render() {
    const props = this.props;
    return (
      <div className="panel-item">
        <div className="col-7">
          <span className="panel-item__title">MESSAGE</span>
          <div className="panel-item__value">{props.message.de}</div>
        </div>
        <div className="col-2">
          <span className="panel-item__title">SCHEDULE</span>
          <div
          // className={`panel-item__value${
          //   nowUnix < startAtUnix
          //     ? " panel-item__value--positive"
          //     : " panel-item__value--negative"
          // }`}
          >
            {/* {formatedStartAt} */}
          </div>
        </div>
        <div className="col-1 col-1--icon">
          <img src={moreIcon} />
        </div>
      </div>
    );
  }
}

ScheduledListItem.propTypes = {
  ID: PropTypes.number.isRequired
};
