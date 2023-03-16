import React, { useState, useEffect } from "react";
import { css } from "@emotion/core";
import { DatePicker } from "element-react";
import moment from "moment";

import { Theme } from "@/components/theme";
import Icon from "../units/Icon";
import Input from "../units/Input";

interface DateTimeProps {
  className?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  initial?: string | Date;
  format?: string;
  onChange: (e: string) => void;
}

const wrapper = (theme: Theme) => css`
  display: block;
  font-family: ${theme.fontFamily};
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
const datePickerStyles = (theme: Theme) => css`
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid ${theme.gray};
  padding-right: 9px;
  position: relative;
  & {
    .el-date-editor {
      width: 100%;
      opacity: 0;
      .el-input__icon {
        width: 0;
      }
      .el-input__inner {
        padding-right: 0px;
      }
    }
  }
`;

const input = (theme: Theme) => css`
  position: absolute;
  width: calc(100% - 60px);
  border: none;
  outline: none;
  font-size: 15px;
  font-family: ${theme.fontFamily};
  padding-left: 15px;
  :disabled {
    background-color: rgba(0, 0, 0, 0);
  }
`;

function DatetimePicker(props: DateTimeProps): JSX.Element {
  const {
    label,
    required,
    onChange,
    initial,
    format = "dddd, MMMM DD, YYYY, h:mm a",
    disabled = false,
    className
  } = props;
  const [val, setVal] = useState(moment(initial));

  useEffect(() => {
    if (!initial) {
      const now = moment();
      setVal(now);
      onChange(now.toISOString(true));
    }

    if (initial) {
      const valFormated = moment(initial);
      setVal(currentVal => {
        if (currentVal.isSame(valFormated)) {
          return valFormated;
        }
        return currentVal;
      });
    }
  }, [initial]);

  const valueFormatter = (date: Date) => {
    const valueFormatted = moment(date);
    setVal(valueFormatted);
    onChange(valueFormatted.toISOString(true));
  };

  return (
    <div className={className} css={wrapper}>
      {label ? (
        <div css={lab}>
          {label}
          {required ? <span>*</span> : null}
        </div>
      ) : null}
      <div className={className} css={datePickerStyles}>
        <div css={input}>
          <Input
            value={val.format(format)}
            css={css`
              border: none;
              padding: 0;
              background: rgba(0, 0, 0, 0);
            `}
            disabled
          />
        </div>
        <DatePicker
          isShowTime
          value={val.toDate()}
          onChange={date => {
            if (date) {
              valueFormatter(date);
            }
          }}
          isDisabled={disabled}
        />
        <Icon color="#789CA8" iconName="calendar" label="" size={30} />
      </div>
    </div>
  );
}
export default DatetimePicker;
