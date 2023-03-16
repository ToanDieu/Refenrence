import React, { FunctionComponent, useState, useEffect } from "react";
import { css, ClassNames } from "@emotion/core";
import { Form } from "element-react";
import { dissoc, assocPath, pathOr, findLast } from "ramda";

import { Theme } from "@/components/theme";
import Dropdown, { ListItem } from "@/components/units/Dropdown";
import Button from "@/components/units/Button";
import Icon from "@/components/units/Icon";

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

const formItem = css`
  margin-left: 10px;
  font-family: inherit;
  font-size: 15px;
`;

const fieldSelected = (theme: Theme) => {
  return css`
    font-family: ${theme.fontFamily};
    display: flex;
    height: 50px;
    align-items: center;
    padding: 0 10px;
  `;
};

const errorMess = (theme: Theme) => css`
  color: #ff4949;
  font-size: 12px;
  font-family: ${theme.fontFamily};
  margin-bottom: 15px;
  margin-top: -15px;
  display: block;
`;

const drDown = (theme: Theme) => css`
  font-family: ${theme.fontFamily};
  height: 50px;
  width: 100%;
  font-size: 15px;
  color: black;
  min-width: 157px;
`;

interface paramType {
  id?: string | number;
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

interface Field {
  id: string;
  label?: string;
}

export interface ValueContent {
  content?: "isHidden" | "isNotHidden" | "isAssignedFrom" | undefined;
  extention?: string | undefined;
  error?: boolean | undefined;
}

interface ActionShowHideFieldProps {
  params?: paramType[];
  fields?: Field[];
  values?: { [key: string]: ValueContent | undefined };
  onChange?: (values: { [key: string]: ValueContent | undefined }) => void;
  onValidate?: (valid: boolean) => void;
}

export const ActionShowHideField: FunctionComponent<
  ActionShowHideFieldProps
> = ({
  params = [],
  fields = [],
  values = {},
  onChange = () => {},
  onValidate = () => {}
}) => {
  const [form, setForm] = useState<{ [key: string]: ValueContent | undefined }>(
    Object.keys(values).length > 0 ? values : { "temp-0": undefined }
  );

  useEffect(() => {
    onChange(form);

    // initial values had change
    if (values !== form) {
      onValidate(checkValid());
    }
  }, [form]);

  const checkValid = () => {
    let isValid = true;
    Object.keys(form).forEach(fieldId => {
      const field = pathOr(undefined, [fieldId], form);
      if (field) {
        if (field.content === "isAssignedFrom") {
          const extention = pathOr(undefined, ["extention"], field);
          if (!extention) {
            isValid = false;
          }
        }
        if (field.error) {
          isValid = false;
        }
      } else {
        isValid = false;
      }
    });

    return isValid;
  };

  const setValue = ({
    fieldId,
    identify,
    value
  }: {
    fieldId: string | number;
    identify: string;
    value: string;
  }) => {
    setForm(currentForm => {
      return assocPath([fieldId, identify], value, currentForm);
    });

    return null;
  };

  const changeField = (f: Field, fromId: string) => {
    const newForm: { [key: string]: ValueContent | undefined } = {};
    Object.keys(form).forEach(id => {
      if (id === fromId) {
        newForm[f.id] = undefined;
      } else {
        newForm[id] = form[id];
      }
    });
    setForm(newForm);
  };

  return (
    <div css={formWrapper} id="formWrapper">
      <Form>
        {Object.keys(form).map(fieldId => {
          // ValueContent
          const fieldVal = form[fieldId];
          // Field
          const fSchema = fields.find(f => f.id === fieldId);
          const availFields = fields.filter(
            f => !Object.keys(form).includes(f.id)
          );

          return (
            <React.Fragment>
              <div
                key={fieldId}
                css={css`
                  display: flex;
                  flex-flow: row nowrap;
                  margin-bottom: 15px;
                `}
              >
                <Form.Item
                  css={css`
                    flex: auto;
                    background: ${fieldVal ? "#e8e6e2" : "white"};
                    border: 1px solid #e8e6e2;
                    cursor: ${fieldVal ? "not-allowed" : "pointer"};
                    &:hover {
                      background: #e8e6e2;
                    }
                  `}
                >
                  <ClassNames>
                    {({ css: cssc }) => (
                      <Dropdown
                        initial={fieldId}
                        selectedClassName={cssc`
                        height: 50px;
                      `}
                        css={drDown}
                        onChange={item => {
                          if (item) {
                            changeField(item as Field, fieldId);
                          }
                        }}
                        renderSelected={() => {
                          return (
                            <div css={fieldSelected}>
                              {fSchema && (
                                <p
                                  css={css`
                                    color: #7f7f7f;
                                    margin-right: 5px;
                                  `}
                                >
                                  {`(${fSchema && fSchema.id})`}
                                </p>
                              )}
                              {fSchema && (
                                <p
                                  css={css`
                                    color: black;
                                    overflow: hidden;
                                    height: 20px;
                                    margin-right: 20px;
                                  `}
                                >
                                  {fSchema && fSchema.label
                                    ? fSchema.label
                                    : "empty"}
                                </p>
                              )}
                              {fSchema === undefined
                                ? "Select pass field..."
                                : null}
                              <Icon
                                css={css`
                                  position: absolute;
                                  right: 10px;
                                `}
                                iconName="chevron-down"
                                size={20}
                              />
                            </div>
                          );
                        }}
                        items={
                          fieldVal !== undefined && fSchema
                            ? [
                                {
                                  id: fSchema.id,
                                  name: fSchema.label,
                                  render: (item, selectItem) => (
                                    <ListItem
                                      key={item.id}
                                      onSelectItem={selectItem}
                                      item={item}
                                    >
                                      <div
                                        css={css`
                                          display: flex;
                                          align-items: center;
                                        `}
                                      >
                                        <p
                                          css={css`
                                            color: #7f7f7f;
                                            margin-right: 5px;
                                          `}
                                        >
                                          {`(${item.id})`}
                                        </p>
                                        <p
                                          css={css`
                                            color: black;
                                          `}
                                        >
                                          {item.name ? item.name : "empty"}
                                        </p>
                                      </div>
                                    </ListItem>
                                  )
                                }
                              ]
                            : availFields.map(field => ({
                                id: field.id,
                                name: field.label,
                                render: (item, selectItem) => (
                                  <ListItem
                                    key={item.id}
                                    onSelectItem={selectItem}
                                    item={item}
                                  >
                                    <div
                                      css={css`
                                        display: flex;
                                        align-items: center;
                                      `}
                                    >
                                      <p
                                        css={css`
                                          color: #7f7f7f;
                                          margin-right: 5px;
                                        `}
                                      >
                                        {`(${item.id})`}
                                      </p>
                                      <p
                                        css={css`
                                          color: black;
                                        `}
                                      >
                                        {item.name ? item.name : "empty"}
                                      </p>
                                    </div>
                                  </ListItem>
                                )
                              }))
                        }
                        iconName="chevron-down"
                        disable={fieldVal !== undefined}
                      />
                    )}
                  </ClassNames>
                </Form.Item>
                <Form.Item css={formItem}>
                  <ClassNames>
                    {({ css: cssc }) => (
                      <Dropdown
                        css={drDown}
                        selectedClassName={cssc`
                        height: 50px;
                        min-width: 157px;
                    `}
                        initial={fieldVal && fieldVal.content}
                        onChange={item => {
                          if (item) {
                            setValue({
                              fieldId,
                              identify: "content",
                              value: item.id as string
                            });
                          }
                        }}
                        items={[
                          {
                            id: "isHidden",
                            name: "is hidden"
                          },
                          {
                            id: "isNotHidden",
                            name: "is visible"
                          },
                          {
                            id: "isAssignedFrom",
                            name: "is visible if"
                          }
                        ]}
                        iconName="chevron-down"
                        disable={fSchema === undefined}
                      />
                    )}
                  </ClassNames>
                </Form.Item>
                {fieldVal && fieldVal.content === "isAssignedFrom" ? (
                  <Form.Item css={formItem}>
                    <ClassNames>
                      {({ css: cssc }) => (
                        <div
                          css={css`
                            display: flex;
                          `}
                        >
                          <Dropdown
                            selectedClassName={cssc`
                            height: 50px;
                          `}
                            initial={fieldVal && fieldVal.extention}
                            css={drDown}
                            onChange={item => {
                              if (item) {
                                setValue({
                                  fieldId,
                                  identify: "extention",
                                  value: item.id as string
                                });
                              }
                            }}
                            items={params}
                            iconName="chevron-down"
                            disable={fieldVal === undefined}
                          />
                          <p
                            css={css`
                              margin-left: 10px;
                              white-space: nowrap;
                              display: flex;
                              align-items: center;
                              color: black;
                              font-size: 15px;
                              font-family: inherit;
                            `}
                          >
                            is true
                          </p>
                        </div>
                      )}
                    </ClassNames>
                  </Form.Item>
                ) : null}
                {Object.keys(form).length > 1 && (
                  <Button
                    css={css`
                      margin-left: 10px;
                    `}
                    iconName="close"
                    iconColor="inherit"
                    border="none"
                    padding="0px 0px"
                    iconSize={30}
                    onClick={() => {
                      setForm(currentForm => {
                        return dissoc(fieldId, currentForm);
                      });
                    }}
                  />
                )}
              </div>
              {fieldVal && fieldVal.error ? (
                <span css={errorMess}>
                  The pass field does not exist, please remove the field.
                </span>
              ) : null}
            </React.Fragment>
          );
        })}
        {Object.keys(form).length !== fields.length && (
          <Button
            css={css`
              margin-top: 20px;
            `}
            label="Add pass field(s)"
            iconName="add"
            iconColor="inherit"
            border="none"
            padding="0px 0px"
            iconSize={24}
            onClick={() => {
              setForm(currentForm => {
                const lastTemp = findLast(
                  formKey => formKey.includes("temp-"),
                  Object.keys(form)
                );

                const nextIdx = lastTemp
                  ? +lastTemp.replace("temp-", "") + 1
                  : 0;
                const tempId = `temp-${nextIdx}`;

                return {
                  ...currentForm,
                  [tempId]: undefined
                };
              });
            }}
          />
        )}
      </Form>
    </div>
  );
};

export default ActionShowHideField;
