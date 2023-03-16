import React, { useState, useEffect } from "react";
import { css, Global } from "@emotion/core";
import { TimePicker } from "element-react";

import { Theme } from "@/components/theme";
import Icon from "../units/Icon";

interface TimeProps {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (e: object) => {};
  hours: number;
  minutes: number;
  seconds: number;
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
  & {
    .el-date-editor {
      width: 100%;
    }
    .el-input__icon {
      width: 0;
      display: none;
    }
    .el-input__inner {
      border: none;
      outline: none;
      font-family: ${theme.fontFamily};
      width: 100%;
      padding-right: 0;
    }
  }
`;

function TimePickerCustom(props: TimeProps): JSX.Element {
  const {
    label,
    required,
    onChange,
    hours = 6,
    minutes = 2,
    seconds = 2,
    disabled = false
  } = props;
  const [val, setVal] = useState(new Date(1970, 1, 1, hours, minutes, seconds));

  useEffect(() => {
    if (val) {
      setVal(val);
    }
  }, [val]);

  useEffect(() => {
    setVal(new Date(1970, 1, 1, hours, minutes, seconds));
  }, [hours, minutes, seconds]);

  const parseTime = (time: Date) => {
    const getHours = time.getHours();
    const getMinutes = time.getMinutes();
    const getSeconds = time.getSeconds();
    setVal(time);
    onChange({ hours: getHours, minutes: getMinutes, seconds: getSeconds });
  };
  return (
    <div>
      <Global
        styles={css`
          .el-time-panel__content:after,
          .el-time-panel__content:before {
            top: calc(50% - 5px);
          }
        `}
      />
      <div css={wrapper}>
        {label ? (
          <div css={lab}>
            {label}
            {required ? <span>*</span> : null}
          </div>
        ) : null}
        <div css={datePickerStyles}>
          <TimePicker
            isDisabled={disabled}
            value={val}
            selectableRange="00:00:00 - 23:59:59"
            onChange={time => parseTime(time)}
          />
          <Icon color="#789CA8" iconName="time" label="" size={30} />
        </div>
      </div>
    </div>
  );
}

export default TimePickerCustom;
