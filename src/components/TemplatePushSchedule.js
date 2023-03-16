import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTranslate } from "react-localize-redux";
import { bindActionCreators } from "redux";

import { pathOr } from "ramda";
import format from "date-fns/format";
import compareAsc from "date-fns/compare_asc";

import { cancelPush } from "../actions/base";
import { Button } from "tse-storybook";
import { isContainScope } from "../actions/utils";

class TemplatePushSchedule extends Component {
  state = {
    errCancelPush: -1
  };
  componentDidMount() {
    this.props.turnLangSwitch(false);
    this.props.turnPassReviewSwitch(false);
  }

  componentWillUnmount() {
    this.props.turnLangSwitch(true);
    this.props.turnPassReviewSwitch(true);
  }

  cancelPush = id => {
    this.props
      .cancelPush({ baseID: this.props.currentBaseID, stepID: id })
      .then(res => {
        console.log("cancelPush", res);
        if (!res || res.status != 200) {
          this.setState({
            errCancelPush: id
          });
          return;
        }
        window.location.reload();
        return;
      });
  };
  render() {
    // let { lang } = this.props;
    const { translate } = this.props;
    return (
      <div className="Row u-margin-top--30">
        <div className="scheduled-list">
          <table className="table table--default">
            <thead>
              <tr className="table__head">
                {[
                  translate("pushOrder"),
                  translate("message"),
                  translate("time")
                ].map((field, index) => (
                  <th
                    className={field === "update" ? "update" : ""}
                    key={index}
                  >
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.props.baseStepList.data
                ? this.props.baseStepList.data.map((item, index) =>
                    pathOr([], ["patches"], item)
                      .filter(({ op, value }) => {
                        if (op === "replace") {
                          if (value.id === "secondary") {
                            return true;
                          }
                        }
                        return false;
                      })
                      .map(patch => (
                        <tr className="table__row" key={index}>
                          <td>{item.orderNum}</td>
                          <td>
                            <p>EN: {patch.value.langs.en.value}</p>
                            <br />
                            <p>DE: {patch.value.langs.de.value}</p>
                          </td>
                          <td>
                            {item.pushAt === "0001-01-01T00:00:00Z"
                              ? item.triggerAfter
                              : format(item.pushAt, "MMM DD, YYYY, HH:mm:ss")}
                          </td>
                          <td>
                            <Button
                              label={translate("cancel")}
                              disable={
                                !isContainScope(
                                  "delete:my-org-type-base:steps"
                                ) ||
                                item.cancelled ||
                                item.triggerAfter != "0s" ||
                                compareAsc(item.pushAt, Date.now()) <= 0 ||
                                false
                              }
                              onClick={() => this.cancelPush(item.id || -1)}
                            />
                            <br />
                            <br />
                            {this.state.errCancelPush == item.id ? (
                              <text
                                style={{
                                  color: "red",
                                  marginLeft: "2px"
                                }}
                              >
                                Can't cancel this push
                              </text>
                            ) : (
                              ""
                            )}
                          </td>
                        </tr>
                      ))
                  )
                : null}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

TemplatePushSchedule.propTypes = {
  isFetchingScheduledList: PropTypes.object,
  pushData: PropTypes.object,
  lang: PropTypes.string,
  turnLangSwitch: PropTypes.func,
  turnPassReviewSwitch: PropTypes.func,
  match: PropTypes.object,
  baseStepList: PropTypes.object,
  isUpdatingTemplateDetail: PropTypes.object,
  cancelPush: PropTypes.func,
  currentBaseID: PropTypes.number,
  translate: PropTypes.func
};

const mapState = state => ({
  baseStepList: state.baseStepList || { data: [] },
  currentBaseID: state.pageDetail.current.detail.id
    ? state.pageDetail.current.detail.id
    : state.baseList.data[0].id,
  translate: getTranslate(state.locale)
});

const mapDispatch = dispatch => {
  return {
    cancelPush: bindActionCreators(cancelPush, dispatch)
  };
};

export default connect(
  mapState,
  mapDispatch
)(TemplatePushSchedule);
