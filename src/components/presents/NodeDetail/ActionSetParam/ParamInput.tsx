import React, { FunctionComponent, useState, useEffect } from "react";
import { css } from "@emotion/core";
import DatetimePicker from "@/components/blocks/DatetimePicker";
import { Theme } from "@/components/theme";
import Input from "@/components/units/Input";
import InputDuration from "@/components/presents/NodeDetail/ActionDelay/Input";
import DropDown from "@/components/units/Dropdown";

const lab = (theme: Theme) => css`
  font-family: ${theme.fontFamily};
  font-size: 11px;
  color: ${theme.primary};
  text-transform: uppercase;
  display: inline-flex;
`;

// Types
interface ParamInputPrps {
  type?:
    | "text"
    | "date"
    | "email"
    | "mobileNumber"
    | "number"
    | "duration"
    | "boolean";
  value?: string | Date;
  className?: string;
  isValid?: boolean;
  disabled?: boolean;
  onChange: (e: string | Date) => string | Date;
  label?: string;
  format?: string;
  placeholder?: string;
}

// Component
const ParamInput: FunctionComponent<ParamInputPrps> = ({
  type = "text",
  className,
  label = "value",
  isValid = true,
  disabled = false,
  onChange = e => e,
  value = "",
  format = "",
  placeholder = ""
}) => {
  const [val, setVal] = useState(value);
  const valueOnchange = (e: string | Date) => {
    onChange(e);
  };

  useEffect(() => {
    setVal("");
  }, [type]);
  useEffect(() => {
    setVal(value);
  }, [value]);

  const InputVariable = (
    <Input
      lable={label}
      className={className}
      disabled={disabled}
      type="text"
      onChange={e => valueOnchange(e)}
      // height={40}
      placeholder={placeholder}
      value={val as string}
      isValid={isValid}
    />
  );

  switch (type) {
    case "text":
      return InputVariable;
    case "email":
      return InputVariable;
    case "mobileNumber":
      return InputVariable;
    case "number":
      return InputVariable;
    case "date":
      return (
        <DatetimePicker
          className={className}
          onChange={e => valueOnchange(e)}
          initial={val}
          format={format}
          label={label}
          disabled={disabled}
        />
      );
    case "duration":
      return (
        <InputDuration
          className={className}
          label={label}
          value={val as string}
          disabled={disabled}
          onChange={e => valueOnchange(e)}
          isValid={isValid}
        />
      );
    case "boolean": {
      const items = [
        {
          id: "true",
          name: "True"
        },
        {
          id: "false",
          name: "False"
        }
      ];
      return (
        <React.Fragment>
          <div css={lab}>{label}</div>
          <DropDown
            css={css`
              && span {
                height: 50px;
                line-height: 50px;
              }
            `}
            className={className}
            items={items}
            initial={val}
            onChange={e => valueOnchange(e.id)}
          />
        </React.Fragment>
      );
    }
    default:
      break;
  }

  return null;
};

export default ParamInput;
