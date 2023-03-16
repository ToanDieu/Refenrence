import React, { useState, useEffect } from "react";
import { css } from "@emotion/core";
import { Theme } from "@/components/theme";
import Icon from "@/components/units/Icon";

interface InputTimeProps {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (e: string) => {};
  value?: string;
  className?: string;
  isValid?: boolean;
}

const wrapper = (theme: Theme) => css`
  display: block;
  font-family: ${theme.fontFamily};
`;
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
const inputOuter = ({ valid }: { valid: boolean }) => (theme: Theme) => css`
  box-sizing: border-box;
  height: 40px;
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid ${valid ? theme.gray : "#DE350B"};
  padding-right: 10px;
  [class*="-wrapper"] {
    display: flex;
  }
`;

const input = (theme: Theme) => css`
  color: #333333;
  padding: 0 2px 0 10px;
  background: rgba(0, 0, 0, 0);
  width: calc(100% - 30px);
  border: none;
  outline: none;
  font-size: 15px;
  font-family: ${theme.fontFamily};
  :disabled {
    background-color: rgba(0, 0, 0, 0);
  }
`;

function InputTime(props: InputTimeProps): JSX.Element {
  const {
    label,
    required,
    onChange,
    value,
    disabled = false,
    className,
    isValid = true
  } = props;
  const [val, setVal] = useState(value);

  useEffect(() => {
    if (val) {
      setVal(val);
    }
  }, [val]);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const valueChange = (valMutate: string) => {
    setVal(valMutate);
    onChange(valMutate);
  };

  return (
    <div css={wrapper} className={className}>
      {label ? (
        <div css={lab}>
          {label}
          {required ? <span>*</span> : null}
        </div>
      ) : null}
      <div css={inputOuter({ valid: isValid })}>
        <input
          css={input}
          value={val}
          onChange={e => valueChange(e.target.value)}
          disabled={disabled}
          placeholder="xxhxxmxxs"
        />
        <Icon color="#789CA8" iconName="time" label="" size={30} />
      </div>
    </div>
  );
}
export default InputTime;
