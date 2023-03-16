/* eslint-disable react/no-multi-comp */
import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { getTranslate, getActiveLanguage } from "react-localize-redux";

import ShowMore from "react-show-more";
import format from "date-fns/format";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import deLocale from "date-fns/locale/de";
import enLocale from "date-fns/locale/en";
import Path from "ramda/src/path";
import { pathOr } from "ramda";
import { Button } from "element-react";

import Loading from "components/Loading";
import { componentName as UpdateCaseName } from "./update-case";
import UpdateCase from "./update-case/container";
import CaseStep from "./case-step/container";
import ResetSteps from "./reset-steps/container";
import { componentName as ResetStepsName } from "./reset-steps";
import { componentName as ArchiveCaseName } from "./archive-case";
import ArchiveCase from "./archive-case/container";

// import { CASE_HOLD } from "constants/actionTypes";
import { fetchCaseDetail, fetchCaseParam } from "@/actions/case";
import { fetchBaseParam } from "@/actions/base";
import { holdCase, resetStepTimers } from "@/ducks/cases";
import { showForm, offForm } from "@/ducks/forms";
// import { isContainScope } from "actions/utils";

import ss from "classnames";
import c from "./case-detail.comp.scss";

import successIcon from "assets/icons/ic-circle-success.svg";
// import holdingIcon from "assets/icons/ic-pending.svg";
import timeIcon from "assets/icons/ic-circle-time.svg";
import closeIcon from "assets/icons/ic-close.svg";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const showcomment = activity => {
  const checkReson = Path(["meta", "detail", "reason"]);
  if (checkReson(activity)) {
    return (
      <div className="u-text-align--left u-margin-bottom--6">
        <ShowMore
          lines={2}
          more={<div className={`memo__content`}>Show more</div>}
          less={<div className={`memo__content`}>Show less</div>}
          anchorClass=""
        >
          {"Reason: "} {activity.meta.detail.reason}
        </ShowMore>
      </div>
    );
  }
  return "";
};

class CaseDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    modalIsOpen: false,
    showFeedback: false,
    commentEmpty: false,
    didUpdate: false,
    currentFeedback: [],
    extraParams: []
  };

  componentDidMount() {
    const caseID = this.props.match.params.id;
    this.props.fetchCaseDetail({ caseID });
    this.getExtraPram();
  }

  componentDidUpdate(oldProps) {
    const oldPath = pathOr("", ["location", "pathname"], oldProps);
    const currentPath = pathOr("", ["location", "pathname"], this.props);

    if (oldPath !== currentPath || this.state.didUpdate) {
      const caseID = this.props.match.params.id;
      this.props.fetchCaseDetail({ caseID });
      this.getExtraPram();
      this.setState({
        didUpdate: false
      });
    }
  }

  getExtraPram = () => {
    const baseID = this.props.baseID;
    const caseID = this.props.match.params.id;

    this.props.fetchBaseParam(baseID).then(baseParams => {
      this.props.fetchCaseParam(caseID).then(caseParams => {
        baseParams.map((baseParam, index) => {
          baseParams[index]["value"] = pathOr("", [baseParam.name], caseParams);
        });

        baseParams = baseParams.sort(
          (before, after) => before.orderNum - after.orderNum
        );
        this.setState({
          extraParams: baseParams
        });
      });
    });
  };

  openModal = isHolding => {
    if (isHolding) {
      this.turnHold({ status: !isHolding });
    } else {
      console.log("openModal", isHolding);
      this.setState({ modalIsOpen: true });
    }
  };

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#f00";
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  updateInputValue = evt => {
    this.setState({
      inputComment: evt.target.value
    });
  };

  turnHold = ({ status }) => {
    if (status && !this.state.inputComment) {
      this.setState({
        commentEmpty: true
      });
      return;
    }

    const casePathId = this.props.match.params.id;
    const inputComment = this.state.inputComment;

    this.props
      .holdCase({
        caseId: casePathId,
        mention: inputComment,
        enable: status
      })
      .then(() => {
        this.props.fetchCaseDetail({ caseID: casePathId });
        this.setState({
          modalIsOpen: false,
          inputComment: ""
        });
      });
  };

  componentWillUpdate() {
    // restart flow
    this.resetSteps = this.resetStepsFlow();
  }
  // initial flow
  resetSteps = this.resetStepsFlow();

  *resetStepsFlow() {
    const stepNum = yield "required_step_number";
    const casePathId = this.props.match.params.id;

    this.props.showForm(ResetStepsName);
    const isOk = yield "required_confirm";

    if (isOk) {
      this.props
        .resetStepTimers({
          caseId: casePathId,
          stepNum
        })
        .then(() => this.props.fetchCaseDetail({ caseID: casePathId }));
    }
    // restart flow
    this.resetSteps = this.resetStepsFlow();
  }

  beginResetStepsFlow = ({ stepNum }) => {
    this.resetSteps.next();
    this.resetSteps.next(stepNum);
  };

  confirmResetStepsFlow = isOk => () => {
    this.resetSteps.next(isOk);
    this.props.offForm();
  };

  setCurrentFeedback(reports) {
    this.setState({
      currentFeedback: reports
    });
  }

  toggleFeedbackModel() {
    this.setState({
      showFeedback: !this.state.showFeedback
    });
  }

  didUpdateCase = () => {
    this.setState({
      didUpdate: true
    });
  };

  render() {
    const { caseDetail, translate, showForm, activeLanguage } = this.props;
    const { currentFeedback, extraParams } = this.state;
    const {
      // id,
      alternativeId,
      createdAt,
      updatedAt,
      currentStep,
      steps = [],
      activities = [],
      isHolding,
      heldAt,
      reports = []
    } = caseDetail.data || {};

    if (
      activities.length > 0 &&
      activities[0].actiType != undefined &&
      activities[0].actiType == "onUnregisteringPass"
    ) {
      // isdelete = true;
    }

    const FeedBack = (
      <div
        onClick={() => {
          this.toggleFeedbackModel();
        }}
        className="Modal Modal--full"
      >
        <div className="card card--modal">
          <div className="card__title card__title--form">
            <div>FEEDBACK</div>
            <div
              className="card__title__close"
              onClick={() => {
                this.toggleFeedbackModel();
              }}
            >
              <img src={closeIcon} />
            </div>
          </div>
          <div className="card__body card__body--feedback">
            <ul>
              {currentFeedback.map((f, i) => (
                <li key={i} className="u-margin-bottom--20">
                  <div className="feedback-text">
                    {f.display.split("\n").map((item, key) => (
                      <span key={key}>
                        {item}
                        <br />
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );

    const caseId = pathOr(0, ["data", "id"], caseDetail);

    return (
      <div className="container-lg">
        {this.state.showFeedback ? FeedBack : null}
        <div className="home">
          <UpdateCase
            ref="updateCase"
            caseId={caseId}
            baseID={this.props.baseID}
            alternativeId={alternativeId}
            didUpdate={this.didUpdateCase}
          />
          <ResetSteps
            onSubmit={this.confirmResetStepsFlow(true)}
            onCancel={this.confirmResetStepsFlow(false)}
          />
          <ArchiveCase caseId={caseId} />
          {caseDetail.loading ? (
            <Loading />
          ) : caseDetail.error ? (
            <p>{JSON.stringify(caseDetail.error)}</p>
          ) : caseDetail.data && caseDetail.data.id ? (
            <div className="home__content">
              <div className={ss("u-margin-bottom--14", c["header"])}>
                <div className={ss(c["title-wrapper"])}>
                  <div className="page-title">
                    <span>
                      {translate("caseno")}
                      {alternativeId}
                    </span>
                  </div>

                  <div className="page-title-info">
                    <span className="capitalizes__first-letter">
                      {translate("updated")}
                    </span>{" "}
                    {distanceInWordsToNow(updatedAt, {
                      addSuffix: true,
                      locale: activeLanguage.code == "de" ? deLocale : enLocale
                    })}
                  </div>
                </div>
                <div className={ss(c["action-panel"])}>
                  <Button
                    type="text"
                    icon="edit"
                    onClick={() => {
                      this.refs.updateCase
                        .fetchData(parseInt(this.props.baseID), caseId);
                      showForm(UpdateCaseName);
                    }}
                  >
                    {translate("updateCase")}
                  </Button>
                  <Button
                    type="text"
                    icon="delete"
                    onClick={() => showForm(ArchiveCaseName)}
                  >
                    {translate("archiveCase")}
                  </Button>
                </div>
              </div>
              <div className="case-detail">
                <div className="case-detail__info">
                  <div className="card-time u-margin-bottom--20">
                    <img className="card-time__icon" src={timeIcon} />
                    <div className="card-time__time">
                      <div className="card-time__time__hour">
                        {format(createdAt, "HH:mm:ss")}
                      </div>
                      <div className="card-time__time__day">
                        {format(createdAt, "dddd, MMM DD, YYYY", {
                          locale:
                            activeLanguage.code == "de" ? deLocale : enLocale
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="u-margin-bottom--20">
                    {extraParams.map(extraParam => {
                      if (!pathOr(false, ["visible"], extraParam)) {
                        return false;
                      }

                      return (
                        <div
                          key={extraParam.name}
                          className="list__item list__item--default"
                        >
                          <div className="sub-title u-margin-bottom--6">
                            {extraParam.label
                              ? extraParam.label
                              : extraParam.name}
                          </div>
                          <div className="u-color--dark-blue">
                            {pathOr("", ["value"], extraParam)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="case-detail__activity">
                  <table className="table table--large-row">
                    <thead className="table__head">
                      <tr>
                        <th>{translate("stepandreport")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <CaseStep
                        steps={steps}
                        reports={reports}
                        current={currentStep}
                        isHolding={isHolding}
                        heldAt={heldAt}
                        onPause={() => this.openModal(isHolding)}
                        onStart={() => this.openModal(isHolding)}
                        onRestart={this.beginResetStepsFlow}
                        showReport={report => {
                          this.setCurrentFeedback(report);
                          this.toggleFeedbackModel();
                        }}
                        translate={translate}
                      />
                    </tbody>
                    <Modal
                      isOpen={this.state.modalIsOpen}
                      onAfterOpen={this.afterOpenModal}
                      onRequestClose={this.closeModal}
                      style={customStyles}
                      contentLabel="Example Modal"
                    >
                      <h2 ref={subtitle => (this.subtitle = subtitle)}>
                        {translate("comment")}
                      </h2>
                      <div
                        style={{
                          marginBottom: "18px",
                          marginTop: "18px"
                        }}
                      >
                        {translate("pauseComment")}
                      </div>
                      <form className="field__item">
                        <textarea
                          value={this.state.inputComment}
                          onChange={this.updateInputValue}
                          name="message"
                          rows="3"
                          cols="70"
                        />
                      </form>
                      {this.state.commentEmpty ? (
                        <div
                          style={{
                            marginBottom: "18px",
                            marginTop: "0px",
                            marginLeft: "10px",
                            color: "red"
                          }}
                        >
                          This field is required
                        </div>
                      ) : null}

                      <button
                        className="table-row__button"
                        onClick={() => this.turnHold({ status: !isHolding })}
                      >
                        OK
                      </button>
                      <button
                        className="table-row__big-button"
                        onClick={this.closeModal}
                      >
                        {translate("cancel")}
                      </button>
                    </Modal>
                  </table>

                  <br />
                  <table className="table table--large-row">
                    <thead className="table__head">
                      <tr>
                        <th>{translate("activities")}</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((s, index) => {
                        return (
                          <tr key={index} className="table__row">
                            <td>
                              <img
                                className="table-row__icon"
                                src={successIcon}
                              />
                              <div className="memo">
                                <div
                                  className={`memo__content u-margin-bottom--6`}
                                >
                                  {s.detail} {s.snapshot}
                                </div>
                                {showcomment(s)}
                                <div className="u-text-transform--uppercase">
                                  {format(
                                    s.createdAt,
                                    "MMM DD, YYYY, HH:mm:ss",
                                    {
                                      locale:
                                        activeLanguage.code == "de"
                                          ? deLocale
                                          : enLocale
                                    }
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="u-text-align--right" />
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            "no data"
          )}
        </div>
      </div>
    );
  }
}

CaseDetail.propTypes = {
  baseID: PropTypes.number,
  fetchCaseDetail: PropTypes.func,
  fetchCaseParam: PropTypes.func,
  fetchBaseParam: PropTypes.func,
  turnHold: PropTypes.func,
  holdCase: PropTypes.func,
  resetStepTimers: PropTypes.func,
  showForm: PropTypes.func,
  offForm: PropTypes.func,
  caseDetail: PropTypes.shape({
    error: PropTypes.bool,
    loading: PropTypes.bool,
    data: PropTypes.shape({
      id: PropTypes.number
    })
  }),
  computedMatch: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  }),
  translate: PropTypes.func,
  getLanguage: PropTypes.func,
  user: PropTypes.object,
  location: PropTypes.object,
  activeLanguage: PropTypes.object
};

const mapState = state => {
  return {
    caseDetail: state.caseDetail || {},
    user: state.user.data || { orgName: "" },
    translate: getTranslate(state.locale),
    activeLanguage: getActiveLanguage(state.locale),
    baseID: parseInt(
      pathOr("0", ["pageDetail", "current", "detail", "id"], state)
    )
  };
};

const mapDispatch = dispatch =>
  bindActionCreators(
    {
      fetchCaseDetail,
      fetchCaseParam,
      fetchBaseParam,
      showForm,
      offForm,
      holdCase,
      resetStepTimers
    },
    dispatch
  );

export default connect(
  mapState,
  mapDispatch
)(CaseDetail);
