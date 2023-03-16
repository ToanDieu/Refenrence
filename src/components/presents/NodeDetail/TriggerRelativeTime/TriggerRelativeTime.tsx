import React, { FunctionComponent, useState } from "react";
import { css } from "@emotion/core";
import { Button, Form } from "element-react";

import { Theme } from "@/components/theme";
import { timeRegex } from "@/constants";
import Dropdown, { DropdownItem } from "@/components/units/Dropdown";
import InputTime from "./Input";
import Dialog from "@/components/blocks/Dialog";

type paramItem = {
  id: string;
  name: string;
};

type params = paramItem[];

interface TriggerRelativeProps {
  onOffForm: () => {};
  disabled?: boolean;
  durationChange?: (e: string) => {};
  selectedChange?: (obj: DropdownItem | undefined) => {};
  onSubmit: (val: object) => {};
  required?: boolean;
  paramList: params;
  selectedIndex?: number;
  value?: string;
  loading?: boolean;
  translate?: (e: string) => string;
}

const formWrapper = css`
  padding: 5px 20px 18px;
  box-sizing: border-box;
  & {
    & {
      .el-form-item {
        margin-bottom: 32px;
      }
      .el-form-item__content {
        line-height: 20px;
        [class*="-DropdownSelected"] {
          color: #333333;
          font-size: 15px;
        }
        [class*="-Dropdown"] {
          min-width: 206px;
        }
      }
    }
  }
`;

const inputWrapper = css`
  width: 140px;
  margin-right: -10px;
`;

const buttons = (theme: Theme) => {
  return css`
    display: flex;
    justify-content: flex-end;
    & {
      .el-button {
        width: 131px;
        height: 36px;
        justify-content: center;
        font-family: ${theme.fontFamily};
        border-radius: 2px;
        font-size: 16px;
        font-weight: 500;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        text-align: center;
        outline: 0;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
      .el-button--default {
        border: 1px solid ${theme.primary};
        color: ${theme.primary};
      }
      .el-button--primary {
        background: ${theme.primary};
        border: 1px solid ${theme.primary};
        color: #ffffff;
        margin-left: 16px;
      }
      .is-disabled {
        opacity: 0.5;
      }
    }
  `;
};

const lab = (theme: Theme) => css`
  font-family: ${theme.fontFamily};
  font-size: 12px;
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

export const TriggerRelative: FunctionComponent<TriggerRelativeProps> = ({
  value = "",
  paramList = [],
  selectedIndex = 0 | 1,
  onOffForm,
  disabled = false,
  durationChange = () => {},
  selectedChange = () => {},
  onSubmit,
  required = false,
  loading = false,
  translate = () => {}
}) => {
  const [isVal, setValid] = useState(true);
  const [selected, setSelected] = useState(
    paramList.find(item => parseInt(item.id, 10) === selectedIndex)
  );
  const [form, setForm] = useState({
    params: paramList,
    duration: value
  });

  const getTranslation = (code: string, transFunc: (e: string) => string) => {
    return transFunc(code);
  };

  const getDurationValue = (valChange: string) => {
    setForm({ ...form, duration: valChange });
    durationChange(valChange);
    if (formRef.current !== null) {
      formRef.current.validate((isValid: boolean) => {
        setValid(isValid);
      });
    }
  };

  const getSelected = (valChange: DropdownItem | undefined) => {
    setSelected(valChange);
    selectedChange(valChange);
  };

  const formRef = React.createRef<Form>();
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current !== null) {
      formRef.current.validate((validOnSubmit: boolean) => {
        if (validOnSubmit) {
          onSubmit({ param: selected, value: form.duration });
        }
      });
    }
  };

  return (
    <div
      css={css`
        background: #ffffff;
        & [class*="-itemStyle"] {
          text-transform: uppercase;
        }
      `}
    >
      <Dialog
        offForm={onOffForm}
        boderWidthTitle="0px 0px 1px 0px"
        title={getTranslation("triggerRelativeTimeTitle", translate)}
      >
        <div css={formWrapper}>
          <Form
            ref={formRef}
            inline
            model={form}
            rules={{
              duration: [
                {
                  required: true,
                  message: getTranslation("required", translate),
                  trigger: "blur"
                },
                {
                  validator: (rule: object, changeValue: string, callback) => {
                    console.log(rule);
                    const match = timeRegex.exec(changeValue);
                    if (changeValue.trim().replace(" ", "").length === 0) {
                      callback(
                        new Error(getTranslation("required", translate))
                      );
                      setValid(false);
                    } else if (!match) {
                      callback(
                        new Error(
                          getTranslation("actionDelayFormatMess", translate)
                        )
                      );
                      setValid(false);
                    } else {
                      callback();
                      setValid(true);
                    }
                  }
                }
              ]
            }}
          >
            <Form.Item prop="params">
              <div css={lab}>
                {getTranslation("parameter", translate)}
                {required && <span>*</span>}
              </div>
              <Dropdown
                initial={selectedIndex.toString()}
                onChange={item => {
                  getSelected(item);
                }}
                items={form.params}
                iconName="chevron-down"
                disable={disabled}
              />
            </Form.Item>
            <Form.Item prop="duration">
              <div css={inputWrapper}>
                <InputTime
                  onChange={e => getDurationValue(e)}
                  label={getTranslation("durationLabel", translate)}
                  value={form.duration}
                  isValid={isVal}
                  disabled={disabled}
                />
              </div>
            </Form.Item>
          </Form>
          <div css={buttons}>
            <Button onClick={onOffForm}>
              {getTranslation("cancel", translate)}
            </Button>
            <Button
              loading={loading}
              onClick={onFormSubmit}
              disabled={!isVal || disabled}
              type="primary"
            >
              {getTranslation("add", translate)}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default TriggerRelative;
