import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

// import { assocPath, pathOr } from "ramda";
import CaseStep from "./index";

// import ss from "classnames";
// import c from "./case-step.comp.scss";

import TextButton from "@/components/text-button";
// import { Form, Input, Button } from "element-react";

import circlePauseIcon from "@/assets/icons/ic-circle-pause.svg";
import circlePlayIcon from "@/assets/icons/ic-circle-play.svg";
import circleRestartIcon from "@/assets/icons/ic-circle-restart.svg";
import circleViewIcon from "@/assets/icons/ic-circle-view.svg";

export default class CaseStepContainer extends Component {
  static propTypes = {
    steps: PropTypes.array,
    reports: PropTypes.array,
    current: PropTypes.number,
    isHolding: PropTypes.bool,
    heldAt: PropTypes.string,
    onStart: PropTypes.func,
    onPause: PropTypes.func,
    onRestart: PropTypes.func,
    showReport: PropTypes.func,
    translate: PropTypes.func
  };

  static defaultProps = {
    steps: [],
    reports: []
  };

  constructor(props) {
    super(props);
  }

  state = {};

  componentWillMount() {
    // this.initValues();
  }

  // componentDidUpdate(oldProps) {}

  render = () => {
    const {
      steps,
      reports,
      current,
      isHolding,
      heldAt,
      onPause,
      onStart,
      onRestart,
      showReport
    } = this.props;

    return (
      <Fragment>
        {steps.map((step, idx) => {
          const isLastStep = idx === steps.length - 1;
          const stepNum = idx + 1;
          const isInProcess = stepNum === current && !isLastStep;

          const overProps = {
            name: step.memo,
            triggerTime: step.scheduledAt,
            next: !isLastStep ? steps[idx + 1].scheduledAt : step.scheduledAt,
            inProcess: isInProcess,
            report: reports.filter(({ onStep }) => onStep === stepNum),
          };

          if (isInProcess) {
            overProps.buttons = step.canHold
              ? [
                  ...(isHolding
                    ? [
                        {
                          ele: TextButton,
                          label: "Start",
                          iconPath: circlePlayIcon,
                          onClick: onStart
                        }
                      ]
                    : [
                        {
                          ele: TextButton,
                          label: "Pause",
                          iconPath: circlePauseIcon,
                          onClick: onPause
                        }
                      ]),
                  {
                    ele: TextButton,
                    label: "Restart",
                    iconPath: circleRestartIcon,
                    onClick: () => onRestart({ stepNum })
                  }
                ]
              : [];
          } else {
            console.log("overProps.report", overProps.report);
            overProps.buttons =
              overProps.report.length > 0
                ? [
                    {
                      alwayShow: true,
                      ele: TextButton,
                      label: "View",
                      iconPath: circleViewIcon,
                      onClick: () => showReport(overProps.report)
                    }
                  ]
                : [];
          }

          if (isHolding) {
            overProps.heldAt = heldAt;
          }

          return <CaseStep key={step.id} {...overProps} translate={ this.props.translate} />;
        })}
      </Fragment>
    );
  };
}
