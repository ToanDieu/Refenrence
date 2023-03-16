import React from "react";
import PropTypes from "prop-types";
import { Form, Field } from "react-final-form";
import { pathOr } from "ramda";
import ss from "classnames";
import {
  BasicInputField,
  PasswordWithGenerator,
  DropdownField
} from "../../fields";
import c from "./card.comp.scss";

class FormContent extends React.Component {
  static propTypes = {
    showForm: PropTypes.bool,
    submitHandle: PropTypes.func,
    cancelHandle: PropTypes.func,
    pwLabel: PropTypes.string,
    errorMessage: PropTypes.string,
    loading: PropTypes.bool,
    cancelLable: PropTypes.string,
    primaryButtonLable: PropTypes.string,
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        required: PropTypes.objectOf(
          PropTypes.shape({
            error: PropTypes.string,
            validateFunc: PropTypes.func
          })
        ),
        name: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.string,
        disabled: PropTypes.bool,
        options: PropTypes.array,
        type: PropTypes.string
      })
    )
  };

  defaultForm = fields => {
    if (fields) {
      const defaultValue = {};
      fields.map(field => {
        defaultValue[field.name] = field.value;
      });
      return defaultValue;
    }
    return null;
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

  render() {
    const {
      showForm,
      submitHandle,
      pwLabel,
      errorMessage,
      loading,
      fields,
      cancelLable,
      cancelHandle,
      primaryButtonLable
    } = this.props;

    const FormModal = (
      <Form
        onSubmit={submitHandle}
        validate={values => {
          const errors = {};

          fields.map(field => {
            if (pathOr(false, ["required"], field)) {
              if (!pathOr(false, [field.name], values)) {
                // required field is empty throw error
                errors[field.name] = pathOr(
                  "This field is required ",
                  ["required", "error"],
                  field
                );
              } else {
                // if required field data exist validate func
                if (pathOr(false, ["required", "validateFunc"], field)) {
                  errors[field.name] = field.required.validateFunc(values);
                }
              }
            }
          });

          // special field
          if (pwLabel) {
            if (!values.password) {
              errors.password = translate("fillOutThisField");
            } else if (values.password.trim().replace(" ", "").length === 0) {
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

          return errors;
        }}
        initialValues={this.defaultForm(fields)}
        render={({ handleSubmit, pristine, form, invalid }) => (
          <form onSubmit={handleSubmit}>
            <div className={ss(c.body)}>
              <div className={ss(c["body-col"])}>
                {errorMessage ? (
                  <p className="u-color--vin-orange u-margin-bottom--6">
                    {errorMessage}
                  </p>
                ) : null}
                {fields.map(field => {
                  switch (field.type) {
                    case "pwgenerator":
                      return (
                        <div className={ss(c.field)} key={field.name}>
                          <Field name={field.name}>
                            {({ input, meta }) => (
                              <PasswordWithGenerator
                                label={field.label}
                                password={input}
                                disabled={field.disabled}
                                error={meta.touched ? meta.error : null}
                                handleGeneratePass={this.handleGeneratePass(
                                  form
                                )}
                              />
                            )}
                          </Field>
                        </div>
                      );
                    case "options":
                      return (
                        <div className={ss(c.field)} key={field.name}>
                          <Field name={field.name}>
                            {({ meta }) => (
                              <DropdownField
                                input={field.value}
                                label={field.label}
                                onChange={value => {
                                  form.change(field.name, value);
                                }}
                                options={field.options}
                                disabled={field.disabled}
                                error={meta.error}
                              />
                            )}
                          </Field>
                        </div>
                      );
                    default:
                      return (
                        <div className={ss(c.field)} key={field.name}>
                          <Field name={field.name}>
                            {({ input, meta }) => (
                              <BasicInputField
                                label={field.label}
                                input={input}
                                disabled={field.disabled}
                                type={field.type}
                                error={meta.touched ? meta.error : null}
                              />
                            )}
                          </Field>
                        </div>
                      );
                  }
                })}

                <div className={ss(c.footer, c["footer--form"])}>
                  {loading ? (
                    <div
                      className={ss(c["loader-spinner"], "u-margin-right--12")}
                    />
                  ) : null}
                  <div className={ss(c["footer--create-user"])}>
                    {cancelLable ? (
                      <button
                        className="button--secondary--library"
                        type="button"
                        onClick={() => {
                          cancelHandle();
                        }}
                      >
                        {cancelLable}
                      </button>
                    ) : (
                      ""
                    )}
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
    );
    return showForm ? FormModal : "";
  }
}

export default FormContent;
