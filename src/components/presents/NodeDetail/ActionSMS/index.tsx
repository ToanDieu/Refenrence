import React, { FunctionComponent, useState, useEffect } from "react";
import { css } from "@emotion/core";
import { Form } from "element-react";

import { Theme } from "@/components/theme";
import Dropdown from "@/components/units/Dropdown";
import FieldEditor from "@/components/blocks/FieldEditor";

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
  margin-top: 12px;
  span {
    color: #ee5151;
    font-family: ${theme.fontFamily};
    font-size: 11px;
    font-weight: 750;
    padding-left: 6px;
  }
`;

const messages = (theme: Theme) => css`
  font-family: ${theme.fontFamily};
  font-size: 12px;
  line-height: 14px;
  color: ${theme.primary};
`;

const splitCounter = (number: number) => (theme: Theme) => css`
  font-family: ${theme.fontFamily};
  font-size: 12px;
  line-height: 14px;
  margin-top: 5px;
  color: ${number > 160 ? "#C32E09" : "#7F7F7F"};
`;

const editor = css`
  min-height: 100px !important;
  align-items: baseline !important;
`;

interface param {
  id?: string;
  name?: string;
  type?: string;
}

interface formFormat {
  paramName: string;
  value: string;
}

interface SuggestFormat {
  name: string;
}

interface ActionSMSPrps {
  params?: param[];
  inital?: formFormat;
  required?: boolean;
  onChange?: (item: formFormat) => void;
  notifyText?: string;
  messLabel?: string;
  dropDownLabel?: string;
  placeHolder?: string;
  onValidate?: (isValid: boolean) => void;
}
export const ActionSMS: FunctionComponent<ActionSMSPrps> = ({
  // inital param
  inital = { paramName: "", value: "" },
  params = [],
  required = false,
  onChange = () => {},
  onValidate = () => {},
  notifyText = "Messages longer than 160 characters will be treated as multiple text messages. Please note that your parameters counts towards character limit.",
  messLabel = "message content",
  dropDownLabel = "phone number parameter",
  placeHolder = "Select param..."
}) => {
  const [form, setForm] = useState(inital);
  const [counter, setCounter] = useState(
    inital && inital.value ? inital.value.length : 0
  );
  let suggests: SuggestFormat = [] as any;
  if (params.length > 0) {
    const opts = params.map(param => ({
      name: `{{ .${param.name} }}`
    }));
    suggests = opts as any;
  }
  const [suggestions, setSuggest] = useState(suggests);

  const changeValue = (item: string) => (category: string) => {
    if (category === "param") {
      setForm(currentForm => ({ ...currentForm, paramName: item }));
    } else {
      setForm(currentForm => {
        return { ...currentForm, value: item };
      });
    }
  };

  useEffect(() => {
    onChange(form as formFormat);
    setCounter(form.value.length);
    if (
      form.paramName &&
      form &&
      form.value &&
      form.value.trim().replace(" ", "").length > 0
    ) {
      onValidate(true);
    } else {
      onValidate(false);
    }
  }, [form]);

  useEffect(() => {
    let options: SuggestFormat = [] as any;
    if (params.length > 0) {
      const opts = params.map(param => ({
        name: `{{ .${param.name} }}`
      }));
      options = opts as any;
    }
    setSuggest(options);
  }, [params]);

  return (
    <div css={formWrapper}>
      <Form model={form}>
        <Form.Item prop="paramName">
          <div css={lab}>
            {dropDownLabel}
            {required && <span>*</span>}
          </div>
          <Dropdown
            initial={form.paramName}
            placeHolder={placeHolder}
            css={css`
              width: 100%;
            `}
            onChange={item => {
              if (item) {
                changeValue(item.name as string)("param");
              }
            }}
            items={params.filter(param => param.type === "mobileNumber")}
            iconName="chevron-down"
          />
        </Form.Item>
        <Form.Item prop="value">
          <div css={lab}>
            <div>{messLabel}</div>
          </div>
          <div css={messages}>{notifyText}</div>
          <FieldEditor
            css={editor}
            data={form.value as string}
            hyperLink={false}
            onChange={value => changeValue(value)("value")}
            suggestions={suggestions}
            mention
          />
          <div css={splitCounter(counter as number)}>{`${counter}/160`}</div>
        </Form.Item>
      </Form>
    </div>
  );
};
