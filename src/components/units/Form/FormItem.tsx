import React, { FunctionComponent, useEffect, useState } from "react";
import { css } from "@emotion/core";
import { Form } from "element-react";

const errorSytle = css`
  color: red;
`;

export interface FormItemPrps {
  prop: string;
  index: number;
  label: string;
  required: boolean;
  labelWidth: string;
  error: string | Node;
  onInjectMethod: (
    index: number,
    methodName: string,
    handleFunc: () => any
  ) => void;
}

const FormItem: FunctionComponent<FormItemPrps> = ({
  prop,
  index,
  label,
  labelWidth,
  error,
  required,
  children,
  onInjectMethod
}) => {
  const [errorST, setError] = useState(error);
  const [showErrorST, setShowError] = useState(false);
  const [requiredST, setRequired] = useState();

  const getProp = () => {
    return prop;
  };

  useEffect(() => {
    setRequired(required);
  }, [required]);

  useEffect(() => {
    setError(error);
  }, [error]);

  const showError = () => {
    setShowError(true);
  };

  const hideError = () => {
    setShowError(false);
  };

  onInjectMethod(index, "getProp", getProp);
  onInjectMethod(index, "showError", showError);
  const contentChild = React.Children.map(children, child => {
    if (child != null) {
      return React.cloneElement(child as any, {
        showError,
        hideError
      });
    }

    return null;
  });

  return (
    <Form.Item
      prop={prop}
      required={requiredST}
      label={label}
      label-width={labelWidth}
    >
      {contentChild}
      {showErrorST ? <div css={errorSytle}>{errorST}</div> : ""}
    </Form.Item>
  );
};

export default FormItem;
