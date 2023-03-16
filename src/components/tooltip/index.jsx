import React from "react";
import PropTypes from "prop-types";

import { Tooltip as ETooltip } from "element-react";

import ss from "classnames";
import c from "./tooltip.comp.scss";
import infoIcon from "../../assets/icons/ic-circle-info-active.svg";
import infoIconBr from "@/assets/icons/ic-circle-info-bg.svg";

const Tooltip = props => (
  <ETooltip className={ss(c["container"], c["overide"])} {...props}>
    {props.children}
    <img
      className={props.background ? "tooltip__icon-bg" : "tooltip__icon"}
      src={props.background ? infoIconBr : infoIcon}
    />
  </ETooltip>
);

Tooltip.propTypes = {
  children: PropTypes.node,
  background: PropTypes.bool
};

export default Tooltip;
