import React, { Component, createElement } from "react";

import PropTypes from "prop-types";

import format from "date-fns/format";
import distanceWord from "date-fns/distance_in_words_to_now";
import getTime from "date-fns/get_time";

import ss from "classnames";
import c from "./case-step.comp.scss";
import cxs from "cxs/component";

// const ProcessBar = cxs("div")(prop => ({
//   width: `${100 - prop.percent}%`
// }));

const Info = cxs("div")(prop =>
  prop.inprocess === "true"
    ? {}
    : {
        background: "none !important"
      }
);

const formatRFC3339 = timeString =>
  format(timeString, "MMM DD, YYYY, HH:mm:ss");

const timeInWords = timeString =>
  distanceWord(timeString, {
    includeSeconds: true
  });

export default class CaseStep extends Component {

  static propTypes = {
    name: PropTypes.string,
    triggerTime: PropTypes.string,
    next: PropTypes.string,
    heldAt: PropTypes.string,
    inProcess: PropTypes.bool,
    buttons: PropTypes.array,
    translate: PropTypes.func
  };

  static defaultProps = {
    buttons: [],
    heldAt: undefined
  };

  constructor(props) {
    super(props);
  }

  state = {
    percent: 0,
    est: ""
  };

  componentWillMount() {
    const { next, triggerTime, heldAt } = this.props;

    const full = getTime(next) - getTime(triggerTime);

    this.timer = setInterval(() => {
      let now = new Date();
      let est = `${timeInWords(next)} left`;
      if (heldAt) {
        now = getTime(heldAt);
        est = `Paused`;
      }
      const nowProcessed = getTime(now) - getTime(triggerTime);

      const percent = Math.round(nowProcessed / (full / 100));
      if (percent >= 100) {
        this.setState({ percent: 100, est:  "Done"});
        clearInterval(this.timer);
      } else {
        this.setState({ percent: percent < 0 ? 0 : percent, est });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  timer = undefined;

  render = () => {
    const { name, triggerTime, buttons, inProcess } = this.props;

    return (
      <div className={ss(c["container"])}>
        <Info inprocess={inProcess.toString()} className={ss(c["info"])}>
          {/* {inProcess && (
            <ProcessBar
              className={ss(c["process-bar"])}
              percent={this.state.percent}
            />
          )} */}
          <div>
            <div className={ss(c["step-name"])}>{name}</div>
            {/* {inProcess && (
            <div className={ss(c["counter"], c["step-name"])}>
              {this.state.percent} %
            </div>
          )} */}
            <div className={ss(c["clear"])} />
            <div className={ss(c["step-trigger-time"])}>
              {formatRFC3339(triggerTime)}
            </div>
          </div>
          {inProcess && (
            <div className={ss(c["counter"])}>{this.state.est === "Done"?this.props.translate("Done"):this.state.est}</div>
          )}
        </Info>
        <div className={ss(c["embbed-btn"])}>
          {buttons.map(({ ele, label, iconPath, onClick, alwayShow }, idx) =>
            alwayShow || this.state.percent !== 100
              ? createElement(ele, {
                  label,
                  className: c["btn"],
                  key: idx,
                  iconPath: iconPath,
                  onClick: onClick
                })
              : null
          )}
        </div>
      </div>
    );
  };
}
