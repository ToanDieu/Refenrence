import React from "react";
import PropTypes from "prop-types";
import { Form, Field } from "react-final-form";
import { connect } from "react-redux";
import { pathOr } from "ramda";
import { Dropdown } from "tse-storybook";
import { getTranslate } from "react-localize-redux";

import configs from "../constants/orgConfigs";
import Tooltip from "@/components/tooltip";
import { makeSelectBases } from "@/resources/bases/selectors";

const CreateBaseForm = props => (
  <Form
    onSubmit={props.onSubmit}
    initialValues={{}}
    validate={values => {
      const errors = {};
      if (values.name === undefined) {
        errors.name = props.translate("required");
      }
      if (values.name) {
        if (values.name.replace(" ", "").trim().length === 0) {
          errors.name = props.translate("required");
        }
      }
      if (values.memo === undefined) {
        errors.memo = props.translate("required");
      }
      if (values.memo) {
        if (values.memo.replace(" ", "").trim().length === 0) {
          errors.memo = props.translate("required");
        }
      }
      return errors;
    }}
    render={({ handleSubmit, pristine, form, errors, invalid }) => (
      <form onSubmit={handleSubmit}>
        <div className="card__body card__body--form">
          <div className="card__body-col">
            {props.error ? (
              <p className="u-color--vin-orange u-margin-bottom--6">
                *{props.error}
              </p>
            ) : null}
            <div className="field">
              <div
                className="field__label field__label--default"
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <span>{props.translate("name")}</span>
                <Tooltip
                  content={
                    props.activeLang === "de" ? (
                      <div>
                        Eine eindeutige Bezeichung für diese Base. Sie sollte
                        gut lesbar und URL-freundlich sein.
                      </div>
                    ) : (
                      <div>
                        A unique identifier for the base. It should be easy to
                        read and URL-friendly.
                      </div>
                    )
                  }
                />
              </div>
              <Field
                className="field__input field__input--default"
                name="name"
                component="input"
                type="text"
              />
              <span className="u-color--vin-red u-font-size--12 label__under-field u-margin-top--5">
                {errors.name ? errors.name : null}
              </span>
            </div>
            <div className="field">
              <div
                className="field__label field__label--default"
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <span>{props.translate("memo")}</span>
                <Tooltip
                  content={
                    props.activeLang === "de" ? (
                      <div>
                        Eine kurze Erklärung zur Verwendung dieser Base.
                      </div>
                    ) : (
                      <div>A short explaination on how to use this base.</div>
                    )
                  }
                />
              </div>
              <Field
                className="field__input field__input--default"
                name="memo"
                component="input"
                type="text"
              />
              <span className="u-color--vin-red u-font-size--12 label__under-field u-margin-top--5">
                {errors.memo ? errors.memo : null}
              </span>
            </div>
            <div className="field">
              <div
                className="field__label field__label--default"
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <span>{props.translate("style")}</span>
                <Tooltip
                  content={
                    props.activeLang === "en" ? (
                      <dl>
                        <dt className="tooltip__dt">Boarding passes</dt>
                        <dd>
                          This pass style is appropriate for passes used with
                          transit systems such as train tickets, airline
                          boarding passes, and other types of transit.
                          Typically, each pass corresponds to a single trip with
                          a specific starting and ending point.
                        </dd>
                        <hr className="tooltip__hr" />
                        <dt className="tooltip__dt">Coupons</dt>
                        <dd>
                          This pass style is appropriate for coupons, special
                          offers, and other discounts.
                        </dd>
                        <hr className="tooltip__hr" />
                        <dt className="tooltip__dt">Event tickets</dt>
                        <dd>
                          This pass style is appropriate for passes used to gain
                          entry to an event like a concert, a movie, a play, or
                          a sporting event. Typically, each pass corresponds to
                          a specific event, but you can also use a single pass
                          for several events as in a season ticket.
                        </dd>
                        <hr className="tooltip__hr" />
                        <dt className="tooltip__dt">Store cards</dt>
                        <dd>
                          This pass style is appropriate for store loyalty
                          cards, discount cards, points cards, and gift cards.
                          Typically, a store identifies an account the user has
                          with your company that can be used to make payments or
                          receive discounts. When the account carries a balance,
                          show the current balance on the pass.
                        </dd>
                        <hr className="tooltip__hr" />
                        <dt className="tooltip__dt">Generic passes</dt>
                        <dd>
                          This pass style is appropriate for any pass that
                          doesn’t fit into one of the other more specific
                          styles—for example, gym membership cards, coat-check
                          claim tickets, and metro passes that carry a balance.
                        </dd>
                      </dl>
                    ) : (
                      <dl>
                        <dt className="tooltip__dt">Boarding Pässe</dt>
                        <dd>
                          Dieser Pass Style eignet sich als Ticket für Bahn,
                          Flugzeug, Bus oder andere Verkehrsmittel. In der Regel
                          gilt jeder Pass für eine einzelne Fahrt mit Start und
                          Zielort.
                        </dd>
                        <hr className="tooltip__hr" />
                        <dt className="tooltip__dt">Coupons</dt>
                        <dd>
                          Dieser Pass Style eignet sich als Coupon, für
                          Sonderangebote oder andere Verkaufsaktionen.
                        </dd>
                        <hr className="tooltip__hr" />
                        <dt className="tooltip__dt">Event Tickets</dt>
                        <dd>
                          Dieser Pass Style eignet sich als Eintrittskarte für
                          Konzert, Kino, Theater oder Sport Veranstaltungen. In
                          der Regel gilt jeder Pass für eine einzelne
                          Veranstaltung, kann aber auch für mehrere
                          Veranstaltungen, z.B. als eine Saisonkarte verwendet
                          werden.
                        </dd>
                        <hr className="tooltip__hr" />
                        <dt className="tooltip__dt">Store Cards</dt>
                        <dd>
                          Dieser Pass Style eignet sich als Kundenkarte für
                          Treuepunkte, Rabattkarte und Geschenkgutschein. In der
                          Regel ist die Kundin registriert und kann mit der
                          Karte zahlen oder Punkte sammeln. Wenn es für diese
                          Kundin ein Punktekonto gibt, sollte der Kontostand auf
                          der Karte angezeigt werden.
                        </dd>
                        <hr className="tooltip__hr" />
                        <dt className="tooltip__dt">Generische Pässe</dt>
                        <dd>
                          Dieser Pass Style eignet sich für alle weiteren
                          Anwendungsfälle, wie z.B. Mitgliedskarten,
                          Garderoben-Ticket oder Fahrausweise, die einen
                          Kontostand anzeigen.
                        </dd>
                      </dl>
                    )
                  }
                />
              </div>
              <Field
                name="style"
                label="style"
                type="text"
                render={({ input }) => (
                  <Dropdown
                    name="style"
                    className="pagination_text_dropdown preview__dropdown__passtype"
                    fullwidth
                    border
                    hinter={
                      input.value ||
                      pathOr(
                        "",
                        [
                          props.getOrgName,
                          "display",
                          "passCreator",
                          "passTypes",
                          0
                        ],
                        configs
                      )
                    }
                    options={pathOr(
                      [],
                      [props.getOrgName, "display", "passCreator", "passTypes"],
                      configs
                    ).map(passType => {
                      return {
                        lable: passType,
                        onClick: () => {
                          form.change("style", passType);
                        }
                      };
                    })}
                  />
                )}
              />
            </div>
            <div className="field">
              <div
                className="field__label field__label--default"
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <span>{props.translate("copyBase")}</span>
                <Tooltip
                  content={
                    props.activeLang === "de" ? (
                      <div>
                        Eine bestehende Base deren Inhalte dupliziert werden
                        soll.
                      </div>
                    ) : (
                      <div>An existing base that should be duplicated.</div>
                    )
                  }
                />
              </div>
              <Field
                className="field__input field__input--default"
                name="sourceID"
                component="select"
              >
                <option value="">
                  {props.translate("selectFromThisList")}
                </option>
                {props.baseList.map(base => (
                  <option key={base.id} value={base.id}>
                    {base.memo}
                  </option>
                ))}
              </Field>
            </div>
          </div>
        </div>
        <div className="card__footer card__footer--form">
          {props.loading ? (
            <div className="loader-spinner u-margin-right--12" />
          ) : null}
          <button
            className="button button--primary"
            type="submit"
            disabled={invalid || pristine}
          >
            <span className="capitalizes__all-letter">
              {props.translate("create")}
            </span>
          </button>
        </div>
      </form>
    )}
  />
);

CreateBaseForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType(PropTypes.number, PropTypes.string).isRequired,
  translate: PropTypes.func.isRequired,
  baseList: PropTypes.object.isRequired,
  activeLang: PropTypes.string.isRequired,
  getOrgName: PropTypes.string.isRequired
};

const mapState = state => ({
  baseList: makeSelectBases()(state),
  translate: getTranslate(state.locale),
  activeLang: pathOr(
    "en",
    [0, "code"],
    state.locale.languages.filter(lang => lang.active)
  ),
  getOrgName: state.getOrgName.data
});

export default connect(
  mapState,
  () => ({})
)(CreateBaseForm);
