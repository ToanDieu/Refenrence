import React, { FunctionComponent, useEffect, useState } from "react";
import { css } from "@emotion/core";
import { Form as ElementForm, Loading } from "element-react";
import { FormItemPrps } from "./FormItem";

const buttonStyle = css`
  white-space: nowrap;
  float: right;
`;

interface ruleType {
  required: boolean;
  message: string;
  validator?: any;
}

interface errorType {
  [key: string]: string;
}

interface injectMethodType {
  [key: string]: () => any;
}

interface FormPrps {
  loading: boolean;
  onInjectMethod: (methodName: string, handleFunc: () => {}) => void;
  buttons: [];
  form: {
    [key: string]: string;
  };
  rules: {
    [key: string]: ruleType;
  };
  Item: Node;
}

type FormType = FunctionComponent<FormPrps> & {
  Item?: FunctionComponent<FormItemPrps>;
};

const Form: FormType = ({
  onInjectMethod,
  loading,
  buttons,
  form,
  rules,
  children
}) => {
  const [loadingST, setLoadingST] = useState(loading);
  const [buttonsST, setButtonsST] = useState(buttons || []);
  const [formST, setFormST] = useState(form);
  const [contents, setContents] = useState();
  const [refMethods, setMethods] = useState<injectMethodType[]>();

  const injectMethod = (
    index: number,
    methodName: string,
    handleFunc: () => any
  ) => {
    setMethods(state => {
      const newState = state || [];
      newState[index] = { ...newState[index], [methodName]: handleFunc };
      return newState;
    });
  };

  const renderChildren = (errors: errorType) => {
    const contentsChild = React.Children.map(children, (child, index) => {
      if (child != null) {
        let prop = "";
        if (refMethods !== undefined) {
          prop = refMethods[index].getProp();
        }
        const childError = errors[prop];

        let required = false;
        if (rules[prop] !== undefined || rules[prop] != null) {
          const { required: temp } = rules[prop];
          required = temp;
        }

        return React.cloneElement(child as any, {
          required,
          index,
          error: childError,
          onInjectMethod: injectMethod
        });
      }

      return null;
    });
    setContents(contentsChild);
  };

  const validator = (input: string, rule: ruleType) => {
    if (rule.validator !== undefined) {
      const mess = rule.validator(input);
      return mess;
    }

    // required value
    if (rule.required !== undefined) {
      if (input === undefined || input == null || input === "") {
        const mess = rule.message || "Please input the field";
        return mess;
      }
    }

    return null;
  };

  const validate = () => {
    let res = true;
    const errors: errorType = {};
    Object.keys(rules).forEach(key => {
      const error = validator(form[key], rules[key]);
      if (error !== undefined && error !== null) {
        res = false;
      }
      errors[key] = error;
    });

    renderChildren(errors);

    return res;
  };

  const handleValidate = () => {
    React.Children.map(children, (child, index) => {
      if (child != null) {
        if (refMethods !== undefined) {
          refMethods[index].showError();
        }
      }
    });

    return validate();
  };

  useEffect(() => {
    onInjectMethod("validate", handleValidate);
    validate();
    setFormST(form);
  }, [form]);

  // start from 2nd in life cycle
  useEffect(() => {
    onInjectMethod("validate", handleValidate);
    validate();
  }, [refMethods]);

  useEffect(() => {
    setLoadingST(loading);
  }, [loading]);

  useEffect(() => {
    setButtonsST(buttons);
  }, [buttons]);

  return (
    <ElementForm labelPosition="top" labelWidth="100" model={formST}>
      {loadingST ? <Loading>{contents}</Loading> : contents}
      <div css={buttonStyle}>{buttonsST ? buttonsST.map(btn => btn) : ""}</div>
      <div style={{ clear: "both" }} />
    </ElementForm>
  );
};

export default Form;
