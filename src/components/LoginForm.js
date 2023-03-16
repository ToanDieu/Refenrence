import React from "react";
import { Field, Form } from "react-final-form";
import PropTypes from "prop-types";

let LoginForm = props => {
  const { onSubmit } = props;
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <div className="field__label field__label--default">
              <label htmlFor="username">ACCOUNT</label>
            </div>
            <Field
              className="field__input field__input--default"
              name="username"
              component="input"
              type="text"
            />
          </div>
          <div className="field">
            <div className="field__label field__label--default">
              <label htmlFor="password">PASSWORD</label>
            </div>
            <Field
              className="field__input field__input--default"
              name="password"
              component="input"
              type="password"
            />
          </div>
          <div className="u-text-align--right u-margin-bottom--40 u-font-size--15 u-color--vin-blue">
            Forgot password?
          </div>
          <div className="u-text-align--center">
            <button
              className="button button--primary button--centered u-margin-bottom--40"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    />
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func
};

export default LoginForm;
