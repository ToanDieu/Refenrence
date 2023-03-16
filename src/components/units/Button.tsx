import React from "react";
import { Button } from "element-react";
import { css } from "@emotion/core";
import { dissoc } from "ramda";
import Icon from "./Icon";

interface ButtonProps {
  size?: "small" | "large" | "mini";
  type?:
    | "text"
    | "danger"
    | "primary"
    | "success"
    | "warning"
    | "info"
    | undefined;
  disabled?: boolean;
  plain?: boolean;
  loading?: boolean;
  iconName?: string;
  iconColor?: string;
  iconSize?: number;
  label?: string | React.ReactNode;
  padding?: string;
  border?: string;
  onClick: () => void;
  style?: {};
  className?: string;
}

const styles = ({
  paddingDefault,
  type,
  borderDefault
}: {
  paddingDefault: string;
  type:
    | undefined
    | "danger"
    | "primary"
    | "text"
    | "success"
    | "warning"
    | "info";
  borderDefault: string;
}) => {
  let background = "";
  let border = "";
  if (type === "primary") {
    background = "#1E5A6E";
    border = "#1E5A6E";
  } else if (type === "danger") {
    background = "#ff4949";
    border = "#ff4949";
  } else if (type === "warning") {
    background = "#e6a23c";
    border = "#e6a23c";
  } else {
    background = "#fff";
    border = "#1E5A6E";
  }

  let borderWidth = "1px";
  if (borderDefault === "none") {
    borderWidth = "0px";
  } else if (borderDefault !== undefined && borderDefault !== "") {
    borderWidth = borderDefault;
  }

  return css`
    display: flex;
    & {
      .el-button {
        padding: ${paddingDefault};
        font-family: Gotham;
        border-radius: 2px;
        font-size: 16px;
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
        border: ${borderWidth} solid #1e5a6e;
        color: #1e5a6e;
      }
      .el-button--primary {
        background: ${background};
        border: ${borderWidth} solid #1e5a6e;
        color: #ffffff;
      }
      .el-button--danger {
        background: ${background};
        border: ${borderWidth} solid #ff4949;
        color: #ffffff;
      }
      .el-button--warning {
        background: ${background};
        border: ${borderWidth} solid ${border};
        color: #ffffff;
      }
      .is-disabled {
        opacity: 0.5;
        background-color: ${background};
        border-color: ${border};
      }
      .is-disabled:hover {
        opacity: 0.5;
        background-color: ${background};
        border-color: ${border};
      }
    }
  `;
};

const iconWrapper = css`
  display: flex;
  align-items: flex-end;
  margin-top: -3px !important;
`;

function ButtonElement(props: ButtonProps): JSX.Element {
  const {
    size = "small",
    type = undefined,
    disabled = false,
    plain = false,
    loading = false,
    iconName,
    iconColor,
    iconSize = 22,
    label,
    padding = "",
    border,
    className
  } = props;
  let paddingDefault = "5px 24px"; // small padding;
  if (padding) {
    paddingDefault = padding;
  } else if (!padding && size === "large") {
    paddingDefault = "13px 42px";
  } else if (!padding && size === "mini") {
    paddingDefault = "5px 24px";
  }

  return (
    <span
      className={className}
      css={styles({ paddingDefault, type, borderDefault: border || "" })}
    >
      <Button
        size={size}
        type={type}
        disabled={disabled}
        plain={plain}
        loading={loading}
        {...dissoc("className", props)}
      >
        {iconName ? (
          <span css={iconWrapper}>
            <Icon
              label={label as string}
              iconName={iconName}
              color={iconColor}
              size={iconSize}
            />
          </span>
        ) : (
          label
        )}
      </Button>
    </span>
  );
}

export default ButtonElement;
