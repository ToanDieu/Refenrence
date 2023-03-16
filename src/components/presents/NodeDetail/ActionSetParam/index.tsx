import React, { FunctionComponent, useState, useEffect } from "react";
import { css, ClassNames } from "@emotion/core";
import { Form } from "element-react";

import { Theme } from "@/components/theme";
import {
  emailPattern,
  phonePatternStandard,
  phonePatternWithDomainCode,
  phonePatternWithVnDomain,
  timeRegex
} from "@/constants";
import Dropdown from "@/components/units/Dropdown";
import Button from "@/components/units/Button";
import { isNumber } from "@/utils/checkNumber";
import { dissoc } from "ramda";
import ParamInput from "./ParamInput";

const formWrapper = css`
  box-sizing: border-box;
  width: 100%;
  & {
    & {
      .el-form-item {
        margin-bottom: 0px;
      }
      .el-form-item__content {
        line-height: 20px;
        [class*="-DropdownSelected"] {
          color: #333333;
          font-size: 15px;
        }
        [class*="-Dropdown"] {
          width: 100%;
        }
      }
    }
  }
`;

const lab = (theme: Theme) => css`
  font-family: ${theme.fontFamily};
  font-size: 11px;
  color: ${theme.primary};
  text-transform: uppercase;
  display: inline-flex;
  span {
    color: #ee5151;
    font-family: ${theme.fontFamily};
    font-size: 11px;
    font-weight: 750;
    padding-left: 6px;
  }
`;

interface paramType {
  id?: string;
  name: string;
  type?:
    | "number"
    | "text"
    | "date"
    | "email"
    | "mobileNumber"
    | "duration"
    | "boolean"
    | undefined;
}

interface ActionSetParamProps {
  disabled?: boolean;
  required?: boolean;
  params?: paramType[];
  values?: { [key: string]: string | undefined };
  format?: string;
  onChange?: (values: { [key: string]: string | undefined }) => void;
  onValidate?: (valid: boolean) => void;
}

export const ActionSetParam: FunctionComponent<ActionSetParamProps> = ({
  disabled = false,
  required = false,
  params = [],
  values = {},
  format = "",
  onChange = () => {},
  onValidate = () => {}
}) => {
  const [form, setForm] = useState<{ [key: string]: string | undefined }>(
    Object.keys(values).length > 0 ? values : { "temp-0": undefined }
  );

  const formRef = React.createRef<Form>();

  useEffect(() => {
    onChange(form);
    if (formRef.current !== null) {
      formRef.current.validate((isValid: boolean) => {
        onValidate(isValid);
      });
    }
  }, [params, values, form]);

  const setValue = (key: string, valChange: string) => {
    setForm(currentForm => {
      return { ...currentForm, [key]: valChange };
    });

    // onChange(form);
    return valChange;
  };

  const changeParam = (p: paramType, fromId: string) => {
    onValidate(false);
    setForm(currentForm => {
      const removedForm = {
        ...dissoc(fromId, currentForm),
        [p.name]: undefined
      };
      return removedForm;
    });
  };

  const getPlaceholer = (type?: string) => {
    if (type === "text") {
      return "Enter text...";
    }
    if (type === "email") {
      return "Enter email...";
    }
    if (type === "mobileNumber") {
      return "+491631234567 or 01721234567";
    }
    if (type === "number") {
      return "Enter number...";
    }
    return "";
  };

  // VALIDATE
  const getRule = (type?: string) => {
    let inputRule;
    switch (type) {
      case "text":
        inputRule = [
          {
            validator: (
              rule: object,
              changeValue: string,
              callback: (e: Error | undefined) => {}
            ) => {
              if (changeValue.length === 0) {
                callback(new Error("required"));
              } else {
                callback(undefined);
              }
            }
          }
        ];
        break;
      case "email":
        inputRule = [
          {
            validator: (
              rule: object,
              changeValue: string,
              callback: (e: Error | undefined) => {}
            ) => {
              if (changeValue.trim().replace(" ", "").length === 0) {
                callback(new Error("required"));
              } else if (!emailPattern.test(changeValue)) {
                callback(new Error("Invalid email"));
              } else {
                callback(undefined);
              }
            }
          }
        ];
        break;
      case "duration":
        inputRule = [
          {
            validator: (
              rule: object,
              changeValue: string,
              callback: (e: Error | undefined) => {}
            ) => {
              if (changeValue.trim().replace(" ", "").length === 0) {
                callback(new Error("required"));
              } else if (!timeRegex.test(changeValue)) {
                callback(
                  new Error("Please use format 00h00m00s (Where 00 are digits)")
                );
              } else {
                callback(undefined);
              }
            }
          }
        ];
        break;
      case "mobileNumber":
        inputRule = [
          {
            validator: (
              rule: object,
              changeValue: string,
              callback: (e: Error | undefined) => {}
            ) => {
              if (changeValue.trim().replace(" ", "").length === 0) {
                callback(new Error("required"));
              } else if (changeValue.includes(" ")) {
                callback(new Error("White space is unaccepted"));
              } else if (
                !phonePatternStandard.test(changeValue) &&
                !phonePatternWithDomainCode.test(changeValue) &&
                !phonePatternWithVnDomain.test(changeValue)
              ) {
                callback(
                  new Error(
                    "Invalid phone number. Please use format +49xxxxxxxxxx or 0xxxxxxxxxx (where x are digits, total min. 9 digits, max. 15 digits)"
                  )
                );
              } else {
                callback(undefined);
              }
            }
          }
        ];
        break;
      case "number":
        inputRule = [
          {
            validator: (
              rule: object,
              changeValue: string,
              callback: (e: Error | undefined) => {}
            ) => {
              if (changeValue.trim().replace(" ", "").length === 0) {
                callback(new Error("required"));
              } else if (!isNumber(changeValue)) {
                callback(new Error("Only digits"));
              } else {
                callback(undefined);
              }
            }
          }
        ];
        break;
      case "date":
        inputRule = [
          {
            validator: (
              rule: object,
              changeValue: string,
              callback: (e: Error | undefined) => {}
            ) => {
              if (changeValue.trim().replace(" ", "").length === 0) {
                callback(new Error("required"));
              } else {
                callback(undefined);
              }
            }
          }
        ];
        break;
      case "boolean":
        inputRule = [
          {
            validator: (
              rule: object,
              changeValue: string,
              callback: (e: Error | undefined) => {}
            ) => {
              if (!changeValue) {
                callback(new Error("required"));
              } else {
                callback(undefined);
              }
            }
          }
        ];
        break;
      default:
        break;
    }

    return inputRule;
  };

  return (
    <div css={formWrapper}>
      <Form ref={formRef} model={form}>
        {Object.keys(form).map(prName => {
          const prVal = form[prName];
          const prSchema = params.find(p => p.name === prName);
          const availPrs = params.filter(
            p =>
              !Object.keys(form).includes(p.name) || form[p.name] === undefined
          );

          return (
            <div
              key={prName}
              css={css`
                display: flex;
                flex-flow: row nowrap;
                margin-bottom: 15px;
              `}
            >
              <Form.Item>
                <div css={lab}>
                  {"parameter"}
                  {required && <span>*</span>}
                </div>
                <ClassNames>
                  {({ css: cssc }) => (
                    <Dropdown
                      initial={prName}
                      selectedClassName={cssc`
                        height: 50px;
                      `}
                      css={css`
                        height: 50px;
                      `}
                      onChange={item => {
                        if (item) {
                          changeParam(item as paramType, prName);
                        }
                      }}
                      items={
                        prVal !== undefined && prSchema
                          ? [
                              {
                                id: prName,
                                name: prName,
                                type: prSchema.type
                              }
                            ]
                          : availPrs.map(pr => ({
                              id: pr.name,
                              type: pr.type,
                              name: pr.name
                            }))
                      }
                      iconName="chevron-down"
                      disable={prVal !== undefined}
                    />
                  )}
                </ClassNames>
              </Form.Item>
              <Form.Item
                css={css`
                  margin-left: 10px;
                  width: 100%;
                `}
                rules={getRule(prSchema ? prSchema.type : "text")}
                prop={prName}
              >
                <ParamInput
                  css={css`
                    height: 50px;
                    .el-form-item.is-error & {
                      border-color: #ff4949;
                    }
                  `}
                  disabled={disabled || !prSchema}
                  label={`${prSchema ? `${prSchema.type} ` : ""}VALUE`}
                  format={format}
                  type={prSchema ? prSchema.type : "text"}
                  value={prVal}
                  placeholder={getPlaceholer(prSchema ? prSchema.type : "")}
                  onChange={text => setValue(prName, text as string)}
                />
              </Form.Item>
              {Object.keys(form).length > 1 && (
                <Button
                  css={css`
                    margin-top: 20px;
                    margin-left: 10px;
                  `}
                  iconName="close"
                  iconColor="iherit"
                  border="none"
                  padding="0px 0px"
                  iconSize={30}
                  onClick={() => {
                    setForm(currentForm => {
                      return dissoc(prName, currentForm);
                    });
                  }}
                />
              )}
            </div>
          );
        })}
        {Object.keys(form).length !== params.length && (
          <Button
            css={css`
              margin-top: 20px;
            `}
            label="Add parameter"
            iconName="add"
            iconColor="inherit"
            border="none"
            padding="0px 0px"
            iconSize={24}
            onClick={() => {
              const tempId = `temp-${Object.keys(form).length}`;
              setForm(currentForm => ({
                ...currentForm,
                [tempId]: undefined
              }));
            }}
          />
        )}
      </Form>
    </div>
  );
};

export default ActionSetParam;
