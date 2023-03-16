import React from "react";
import PropTypes from "prop-types";
import { getTranslate } from "react-localize-redux";
import { connect } from "react-redux";

import { Form, Field } from "react-final-form";
import { pathOr } from "ramda";

import closeIcon from "../assets/icons/ic-close.svg";

@connect(
  state => ({
    translate: getTranslate(state.locale)
  }),
  () => ({})
)
class CreateUserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordshow: false,
      pwGeneratorShow: false
    };
  }

  showPassword = () => {
    this.setState({
      passwordshow: !this.state.passwordshow
    });
  };

  pwGeneratorToggle = () => {
    this.setState({
      pwGeneratorShow: !this.state.pwGeneratorShow
    });
  };

  handleGeneratePass = form => {
    const pwLength = document
      .getElementById("pwLengthToGenerate")
      .value.trim()
      .replace(" ", "");
    let pwLengthInUse;
    if (pwLength.length === 0) {
      pwLengthInUse = 8;
    } else {
      pwLengthInUse = parseInt(pwLength);
    }

    const chars =
      "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    let pass = "";
    for (let x = 0; x < pwLengthInUse; x++) {
      const i = Math.floor(Math.random() * chars.length);
      pass += chars.charAt(i);
    }
    form.change("password", pass);
    this.pwGeneratorToggle();
  };

  defaultForm = user => {
    if (user) {
      return {
        fullname: user.realname,
        role: pathOr(0, ["role", "id"], user),
        email: user.email
      };
    }
    return {};
  };

  render() {
    const {
      showCreateUserForm,
      toggleCreateUserForm,
      error,
      loading,
      handleUser,
      roleArray,
      cancelLable,
      primaryButtonLable,
      roleLable,
      fullnameLable,
      pwLable,
      emailLable,
      modalLable,
      userToEdit,
      translate
    } = this.props;
    let roleError;
    let createError;

    if (error) {
      createError = "Cannot create user";
    } else {
      createError = "";
    }

    const FormModal = (
      <div className="Modal Modal--full">
        <div className="card card--modal">
          <div className="card__title card__title--form">
            <div>{modalLable}</div>
            <div
              className="card__title__close"
              onClick={() => {
                toggleCreateUserForm();
              }}
            >
              <img src={closeIcon} />
            </div>
          </div>

          <Form
            onSubmit={handleUser}
            validate={values => {
              const errors = {};

              if (emailLable) {
                if (!values.email) {
                  errors.email = translate("fillOutThisField");
                } else if (values.email.trim().replace(" ", "").length === 0) {
                  errors.email = translate("fillOutThisField");
                }
              }

              if (pwLable) {
                if (!values.password) {
                  errors.password = translate("fillOutThisField");
                } else if (
                  values.password.trim().replace(" ", "").length === 0
                ) {
                  errors.password = translate("fillOutThisField");
                } else if (values.password.includes(" ")) {
                  errors.password = "(*) Password cannot contain spaces";
                } else if (
                  values.password.length < 8 ||
                  values.password.length > 128
                ) {
                  errors.password = translate("passwordLengthMustBe");
                }
              }

              if (fullnameLable) {
                if (!values.fullname) {
                  errors.fullname = translate("fillOutThisField");
                } else if (
                  values.fullname.trim().replace(" ", "").length === 0
                ) {
                  errors.fullname = translate("fillOutThisField");
                }
              }

              if (roleLable) {
                if (!values.role) {
                  errors.role = `(*) ${translate("selectARole")}`;
                  roleError = errors.role;
                } else {
                  roleError = "";
                }
              }

              return errors;
            }}
            initialValues={this.defaultForm(userToEdit)}
            render={({ handleSubmit, pristine, form, invalid }) => (
              <form onSubmit={handleSubmit}>
                <div className="card__body card__body--form">
                  <div className="card__body-col">
                    {createError ? (
                      <p className="u-color--vin-orange u-margin-bottom--6">
                        {/* *{JSON.stringify(error)} */}*
{createError}
                      </p>
                    ) : null}
                    {emailLable && (
                      <div className="field">
                        <Field name="email">
                          {({ input, meta }) => (
                            <div>
                              <div className="field__label field__label--adjust">
                                {emailLable}
                              </div>
                              <input
                                className="field__input field__input--default field__input--clear-browser-default"
                                disabled={userToEdit}
                                style={{
                                  backgroundColor: userToEdit ? "#f6f5f4" : ""
                                }}
                                {...input}
                                type="email"
                              />
                              {meta.error && meta.touched && (
                                <p style={{ color: "#f08262" }}>{meta.error}</p>
                              )}
                            </div>
                          )}
                        </Field>
                      </div>
                    )}
                    {pwLable && (
                      <div className="field">
                        <Field name="password">
                          {({ input, meta }) => (
                            <div className="field--pw-wrapper">
                              <div className="field__label field__label--adjust">
                                {pwLable}
                                <p onClick={this.pwGeneratorToggle}>
                                  {translate("password generator")}
                                </p>
                              </div>
                              <div
                                style={{
                                  display: this.state.pwGeneratorShow
                                    ? "block"
                                    : "none"
                                }}
                                className="field__pw-generate"
                              >
                                <label>{translate("Length")}
:
</label>
                                <input
                                  id="pwLengthToGenerate"
                                  type="number"
                                  placeholder="8"
                                  min="8"
                                  max="128"
                                />
                                <button
                                  onClick={() => this.handleGeneratePass(form)}
                                >
                                  {translate("generate")}
                                </button>
                              </div>
                              <div className="field__input-button">
                                <input
                                  className="field__input-button--password field__input--clear-browser-default"
                                  {...input}
                                  type={
                                    this.state.passwordshow
                                      ? "text"
                                      : "password"
                                  }
                                />
                                <button onClick={this.showPassword}>
                                  {this.state.passwordshow
                                    ? translate("hide")
                                    : translate("show")}
                                </button>
                              </div>
                              {meta.error && meta.touched && (
                                <p style={{ color: "#f08262" }}>{meta.error}</p>
                              )}
                            </div>
                          )}
                        </Field>
                      </div>
                    )}
                    {fullnameLable && (
                      <div className="field">
                        <Field name="fullname">
                          {({ input, meta }) => (
                            <div>
                              <div className="field__label field__label--adjust">
                                {fullnameLable}
                              </div>
                              <input
                                className="field__input field__input--default field__input--clear-browser-default"
                                {...input}
                                type="text"
                              />
                              {meta.error && meta.touched && (
                                <p style={{ color: "#f08262" }}>{meta.error}</p>
                              )}
                            </div>
                          )}
                        </Field>
                      </div>
                    )}

                    {roleLable && (
                      <div className="field">
                        <div className="field__label field__label--adjust">
                          {roleLable}
                        </div>
                        <Field
                          className="field__input field__input--default field__input--adjust"
                          name="role"
                          component="select"
                        >
                          <option value="">{translate("selectARole")}</option>
                          {roleArray.map((role, index) => {
                            return (
                              <option key={index} value={role.id}>
                                {role.name}
                              </option>
                            );
                          })}
                        </Field>
                        {roleError ? (
                          <p style={{ color: "#f08262" }}>{roleError}</p>
                        ) : null}
                      </div>
                    )}

                    <div className="card__footer card__footer--form">
                      {loading ? (
                        <div className="loader-spinner u-margin-right--12" />
                      ) : null}
                      <div className="card__footer--create-user">
                        <button
                          className="button--secondary--library"
                          type="button"
                          onClick={() => {
                            toggleCreateUserForm();
                          }}
                        >
                          {cancelLable}
                        </button>
                        <button
                          className="button--primary--library u-margin-left--24"
                          type="submit"
                          disabled={pristine || invalid}
                          style={{
                            backgroundColor:
                              pristine || invalid ? "#789ca8" : "#1e5a6e"
                          }}
                        >
                          {primaryButtonLable}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    );
    return showCreateUserForm ? FormModal : "";
  }
}

CreateUserForm.defaultProps = {
  loading: false,
  error: ""
};

CreateUserForm.propTypes = {
  showCreateUserForm: PropTypes.bool,
  toggleCreateUserForm: PropTypes.func,
  handleUser: PropTypes.func,
  error: PropTypes.oneOfType(PropTypes.number, PropTypes.string),
  loading: PropTypes.bool,
  roleArray: PropTypes.array,
  cancelLable: PropTypes.string,
  primaryButtonLable: PropTypes.string,
  roleLable: PropTypes.string,
  fullnameLable: PropTypes.string,
  pwLable: PropTypes.string,
  emailLable: PropTypes.string,
  modalLable: PropTypes.string,
  userToEdit: PropTypes.object,
  translate: PropTypes.func
};

export default CreateUserForm;
