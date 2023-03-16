import React, { Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Form, Field } from "react-final-form";
import { wrap } from "co";
import { assocPath } from "ramda";

import SingleField from "./SingleField";
import DateTimePickerField from "./DateTimePickerField";
import { createBaseStepsWithoutStore } from "../actions/base";
import SelectedIcon from "../assets/icons/ic-box-check.svg";
import UnSelectedIcon from "../assets/icons/ic-box-empty.svg";
import ErrorSelectIcon from "../assets/icons/ic-box-error.svg";
import Loading from "../components/Loading";

const CreatePushForm = ({ createBaseSteps, checkedBases, translate }) => (
  <Fragment>
    <Form
      initialValues={{ bases: [] }}
      onSubmit={(values, { reset }) => {
        const createStepsBatch = wrap(function*() {
          const requests = values.bases.map(
            ({ meta, secondaryFrontFieldIndex, detail }) => {
              let targetField = {
                ...detail.fields.front[secondaryFrontFieldIndex]
              };

              targetField = assocPath(
                ["langs", "en", "value"],
                values.pushMessage.en,
                targetField
              );

              targetField = assocPath(
                ["langs", "de", "value"],
                values.pushMessage.de,
                targetField
              );

              targetField = assocPath(
                ["langs", "fr", "value"],
                values.pushMessage.fr,
                targetField
              );

              targetField = assocPath(
                ["langs", "nl", "value"],
                values.pushMessage.nl,
                targetField
              );

              targetField.notifyChange = true;
              console.log("targetField: ", targetField);
              return createBaseSteps({
                baseID: meta.id,
                payload: {
                  applyFor: "all",
                  memo: "created by CreatePushForm",
                  pushAt: values.pushAt,
                  triggerAfter: values.pushAfter,
                  patches: [
                    {
                      op: "replace",
                      path: `/fields/front/${secondaryFrontFieldIndex}`,
                      value: targetField
                    }
                  ]
                }
              });
            }
          );
          yield requests;
        });

        createStepsBatch().then(r => {
          console.log(r);
          reset();
        });
      }}
      render={({ pristine, submitting, handleSubmit, values, form }) => (
        <form onSubmit={handleSubmit}>
          <div className="card__body card__body--form">
            <div className="card__body-col card__body-col--4">
              <ul className="field__selection">
                {/* <li className="selection__item">Select All</li> */}
                {!(checkedBases.length > 0) ? (
                  <Loading />
                ) : (
                  checkedBases.map(base => {
                    // console.log(base);
                    return (
                      <li className="selection__item" key={base.meta.id}>
                        <a
                          onClick={
                            base.isPushable
                              ? () => {
                                  let currentBases = [...values.bases];
                                  const isSelectedIndex = currentBases.findIndex(
                                    b => b.meta.id === base.meta.id
                                  );
                                  if (isSelectedIndex === -1) {
                                    form.change("bases", [
                                      ...currentBases,
                                      base
                                    ]);
                                  } else {
                                    currentBases.splice(isSelectedIndex, 1);
                                    form.change("bases", currentBases);
                                  }
                                }
                              : () => {}
                          }
                        >
                          {values.bases.findIndex(
                            b => b.meta.id === base.meta.id
                          ) !== -1 ? (
                            <img
                              className="selection__item__box"
                              src={SelectedIcon}
                            />
                          ) : (
                            <img
                              className="selection__item__box"
                              src={
                                base.isPushable
                                  ? UnSelectedIcon
                                  : ErrorSelectIcon
                              }
                            />
                          )}
                          <span>{base.meta.name}</span>
                        </a>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
            <div className="card__body-col card__body-col--5">
              <Field
                name="pushAt"
                render={({ input }) => (
                  <DateTimePickerField
                    label={translate("timeToPush")}
                    placeholder="RFC3339 value"
                    onChange={input.onChange}
                    value={input.value}
                    type="text"
                  />
                )}
              />
              <Field
                name={"pushAfter"}
                render={({ input }) => (
                  <SingleField
                    label={translate("pushAfterPreviousPush")}
                    placeholder="1h25m20s"
                    onChange={input.onChange}
                    value={input.value}
                    type="text"
                  />
                )}
              />
              <Field
                name={`pushMessage.en`}
                render={({ input }) => (
                  <SingleField
                    label={`${translate("pushMessageIn")} en`}
                    placeholder={translate("enterTextForYourPushMessage")}
                    onChange={input.onChange}
                    value={input.value}
                    type="text"
                  />
                )}
              />
              <Field
                name={`pushMessage.de`}
                render={({ input }) => (
                  <SingleField
                    label={`${translate("pushMessageIn")} de`}
                    placeholder={translate("enterTextForYourPushMessage")}
                    onChange={input.onChange}
                    value={input.value}
                    type="text"
                  />
                )}
              />
              <Field
                name={`pushMessage.fr`}
                render={({ input }) => (
                  <SingleField
                    label={`${translate("pushMessageIn")} fr`}
                    placeholder={translate("enterTextForYourPushMessage")}
                    onChange={input.onChange}
                    value={input.value}
                    type="text"
                  />
                )}
              />
              <Field
                name={`pushMessage.nl`}
                render={({ input }) => (
                  <SingleField
                    label={`${translate("pushMessageIn")} nl`}
                    placeholder={translate("enterTextForYourPushMessage")}
                    onChange={input.onChange}
                    value={input.value}
                    type="text"
                  />
                )}
              />
            </div>
          </div>

          <div className="card__footer card__footer--form">
            {submitting ? (
              <div className="loader-spinner u-margin-right--12" />
            ) : null}
            <button
              className="button button--primary"
              type="submit"
              disabled={submitting || pristine}
            >
              <span className="capitalizes__all-letter">
                {translate("create")}
              </span>
            </button>
          </div>
        </form>
      )}
    />
    {/* {error ? <div>Error {error}</div> : ""} */}
  </Fragment>
);

CreatePushForm.propTypes = {
  createBaseSteps: PropTypes.func,
  lang: PropTypes.string,
  baseDetail: PropTypes.object,
  baseID: PropTypes.string,
  checkedBases: PropTypes.array,
  translate: PropTypes.func
};

const mapState = state => ({
  baseDetail: state.baseDetail.data
});

const mapDispatch = dispatch => {
  return {
    createBaseSteps: bindActionCreators(createBaseStepsWithoutStore, dispatch)
  };
};

export default connect(
  mapState,
  mapDispatch
)(CreatePushForm);
