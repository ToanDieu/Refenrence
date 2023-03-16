import React, { FunctionComponent, ReactNode } from "react";
import { css } from "@emotion/core";
import { Theme } from "@/components/theme";

const iconImage = ({ size, color }: { size?: number; color?: string }) => (
  theme: Theme
) => css`
  ::before {
    color: ${color || theme.iconColor || "inherit"};
    font-size: ${size || 16}px;
  }
`;

const wrapper = css`
  display: flex;
  flex-flow: row;

  align-items: center;
`;

const labelText = css`
  margin-top: 2px;
`;

interface ActionTitlePrps {
  className?: string;
  iconName: string;
  label?: string | (() => ReactNode);
  color?: string;
  size?: number;
}

const Icon: FunctionComponent<ActionTitlePrps> = ({
  className,
  iconName,
  label,
  color,
  size
}) => {
  return (
    <div className={className} css={wrapper}>
      <span css={iconImage({ size, color })} className={`icon-${iconName}`} />
      {label && (
        <span css={labelText}>
          &nbsp;
          {typeof label === "string" ? label : label()}
        </span>
      )}
    </div>
  );
};

export default Icon;

export const NextIcon = ({
  name,
  size = 16,
  className = ""
}: {
  name: string;
  size?: number;
  className?: string;
}) => (
  <i
    css={css`
      display: inline-block;
      font-size: ${size}px;
    `}
    className={`${className} tseicon tseicon-${name}`}
  />
);
