import { css } from "@emotion/core";
import styled from "@emotion/styled";

export interface WrapperProps {
  edgeLength?: number;
  edgeThick?: number;
  edgeColor?: string;
}

const mixin = ({
  edgeLength = 15,
  edgeThick = 1,
  edgeColor = "#000"
}: WrapperProps) => css`
  & ul {
    margin: 0;
    padding: 0;

    list-style: none;
    display: flex;
    justify-content: center;
    position: relative;

    li {
      position: relative;
    }

    ul {
      padding-top: ${edgeLength}px;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: calc(50% - ${edgeThick / 2}px);
        border-left: ${edgeThick}px solid ${edgeColor};
        height: ${edgeLength}px;
      }

      li {
        padding-top: ${edgeLength}px;

        &::before,
        &::after {
          content: "";
          position: absolute;
          top: 0;
          right: calc(50% - ${edgeThick / 2}px);
          border-top: ${edgeThick}px solid ${edgeColor};
          width: calc(50% + ${edgeThick / 2}px);
          height: ${edgeLength}px;
        }

        &::after {
          right: auto;
          left: calc(50% - ${edgeThick / 2}px);
          border-left: ${edgeThick}px solid ${edgeColor};
        }

        &:first-of-type::before,
        &:last-of-type::after {
          display: none;
        }

        &:last-of-type::before {
          border-right: ${edgeThick}px solid ${edgeColor};
        }

        &:only-of-type::before {
          display: block;
          border: none;
          left: calc(50% - ${edgeThick / 2}px);
          border-left: ${edgeThick}px solid ${edgeColor};
        }
      }
    }
  }
`;

export default styled.div<WrapperProps>`
  ${mixin}
`;
