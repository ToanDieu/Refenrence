import React from "react";
import { css } from "@emotion/core";
import { Theme } from "@/components/theme";
import Icon from "@/components/units/Icon";

export interface CardProps {
  iconName: string;
  label: string;
  detail: string;
  backgroundColor?: "blue" | "green";
  hover?: () => {};
  onClick?: () => void;
  onFocus?: () => {};
}

const styles = ({ backgroundColor }: { backgroundColor?: string }) => (
  theme: Theme
) => {
  let background = theme.blue;
  if (backgroundColor === "green") {
    //  green100
    background = "#16837C";
  }
  return css`
    display: flex;
    align-items: center;
    font-family: ${theme.fontFamily};
    background: ${background};
    border-radius: 4px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 12px 0;
    cursor: pointer;
    & {
      span {
        margin: 0 10px;
      }
    }
  `;
};

const content = css`
  display: block;
  width: calc(100% - 42px);
`;

const contentLabel = css`
  color: #ffffff;
  font-size: 15px;
  line-height: 18px;
  margin-bottom: 6px;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 500;
`;

const contentDetail = css`
  font-size: 12px;
  color: #ffffff;
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 13px;
`;

function Card(props: CardProps): JSX.Element {
  const {
    iconName,
    label,
    detail,
    backgroundColor,
    onClick = () => {},
    hover = () => {},
    onFocus = () => {}
  } = props;
  return (
    <div
      role="presentation"
      css={styles({ backgroundColor })}
      onClick={() => onClick()}
      onMouseOver={() => hover()}
      onFocus={() => onFocus()}
    >
      <Icon iconName={iconName} size={33} color="white" />
      <div css={content}>
        <div css={contentLabel}>{label}</div>
        <div css={contentDetail}>{detail}</div>
      </div>
    </div>
  );
}

export default Card;
