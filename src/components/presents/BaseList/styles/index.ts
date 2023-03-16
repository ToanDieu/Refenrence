import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export const MemoLink = styled(Link)`
  h4 {
    color: ${props => props.theme.primary};
    font-size: 18px;
    font-weight: 500;
    line-height: normal;

    &.current {
      color: ${props => props.theme.orange};
    }
  }

  span {
    color: ${props => props.theme.gumbo};
    padding-bottom: 6px;
    display: inline-block;
  }
`;

export const ActionLink = styled(Link)`
  color: ${props => props.theme.gumbo};
`;

export const Table = styled.table`
  background-color: #fff;
  border-radius: 2px;
  text-align: left;
  color: ${props => props.theme.gumbo};
  font-size: 15px;
  width: 100%;

  thead th {
    border-bottom: 1px solid #e8e6e2;
    padding: 26px 14px 19px;
    font-weight: 500;
    text-transform: uppercase;
    color: ${props => props.theme.primary};
    line-height: 1.2;
  }

  tbody tr:nth-child(odd) {
    background-color: #fafaf9;
  }

  td {
    padding: 18px;
    vertical-align: middle;
  }

  td:nth-child(1) {
    width: 250px;
  }

  td:nth-child(2) {
    width: 100px;
  }

  td:nth-child(3) {
    width: 220px;
  }

  td:nth-child(5),
  td:nth-child(6) {
    padding-left: 0;
    width: 24px;
  }
`;
