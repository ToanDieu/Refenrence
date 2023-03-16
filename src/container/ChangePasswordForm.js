import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import closeIcon from "../assets/icons/ic-close.svg";
import { getTranslate } from "react-localize-redux";
import { Form, Field } from "react-final-form";
import { changePassword } from "../actions/user";

class ChangePasswordForm extends React.Component {
  changePassword = values => {
    const newpassword = values.newpassword || "";
    this.props.changePassword({ newpassword }).then(res => {
      if (res.type === "USER_CHANGE_PASSWORD_SUCCESS") {
        this.props.toggleChangePasswordForm();
        this.props.toggleSuccessNoti();
      }
    });
  };

  render() {
    const {
      showChangePasswordForm,
      toggleChangePasswordForm,
      translate,
      error,
      loading
    } = this.props;

    const FormModal = (
      <div className="Modal Modal--full">
        <div className="card card--modal">
          <div className="card__title card__title--form">
            <div>{translate("changepassword")}</div>
            <div
              className="card__title__close"
              onClick={() => {
                toggleChangePasswordForm();
              }}
            >
              <img src={closeIcon} />
            </div>
          </div>

          <Form
            onSubmit={this.changePassword}
            validate={values => {
              const errors = {};
              if (!values.newpassword) {
                errors.newpassword = translate("fillOutThisField");
              } else if (
                values.newpassword.trim().replace(" ", "").length === 0
              ) {
                errors.newpassword = translate("fillOutThisField");
              } else if (!values.confirmpassword) {
                errors.confirmpassword = translate("fillOutThisField");
              } else if (
                values.confirmpassword.trim().replace(" ", "").length === 0
              ) {
                errors.confirmpassword = translate("fillOutThisField");
              } else if (values.newpassword !== values.confirmpassword) {
                errors.confirmpassword = "(*) Confirm password mismatch";
              }

              return errors;
            }}
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit}>
                <div className="card__body card__body--form">
                  <div className="card__body-col">
                    {error ? (
                      <p className="u-color--vin-orange u-margin-bottom--6">
                        *{error}
                      </p>
                    ) : null}
                    <div className="field">
                      <Field name="newpassword">
                        {({ input, meta }) => (
                          <div>
                            <div className="field__label field__label--default">
                              {translate("newpassword")}
                            </div>
                            <input
                              className="field__input field__input--default"
                              {...input}
                              type="password"
                              placeholder="Enter new password..."
                            />
                            {meta.error && meta.touched && (
                              <p style={{ color: "#f08262" }}>{meta.error}</p>
                            )}
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="field">
                      <Field name="confirmpassword">
                        {({ input, meta }) => (
                          <div>
                            <div className="field__label field__label--default">
                              {translate("confirmpassword")}
                            </div>
                            <input
                              className="field__input field__input--default"
                              {...input}
                              type="password"
                              placeholder="Reenter..."
                            />
                            {meta.error && meta.touched && (
                              <p style={{ color: "#f08262" }}>{meta.error}</p>
                            )}
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="card__footer card__footer--form">
                      {loading ? (
                        <div className="loader-spinner u-margin-right--12" />
                      ) : null}
                      <button
                        className="button button--secondary u-margin-right--20"
                        type="button"
                        onClick={() => {
                          toggleChangePasswordForm();
                        }}
                      >
                        {translate("cancel")}
                      </button>
                      <button
                        className="button button--primary"
                        type="submit"
                        disabled={submitting || pristine}
                      >
                        {translate("change")}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    );
    return showChangePasswordForm ? FormModal : "";
  }
}

ChangePasswordForm.defaultProps = {
  loading: false,
  error: ""
};

ChangePasswordForm.propTypes = {
  showChangePasswordForm: PropTypes.bool,
  toggleChangePasswordForm: PropTypes.func,
  changePassword: PropTypes.func,
  toggleSuccessNoti: PropTypes.func,
  error: PropTypes.oneOfType(PropTypes.number, PropTypes.string),
  loading: PropTypes.bool,
  translate: PropTypes.func
};

const mapState = state => {
  return {
    loading: state.changePassword.loading,
    error: state.changePassword.error,
    translate: getTranslate(state.locale)
  };
};

const mapDispatch = dispatch => {
  return {
    changePassword: bindActionCreators(changePassword, dispatch)
  };
};

export default connect(
  mapState,
  mapDispatch
)(ChangePasswordForm);
