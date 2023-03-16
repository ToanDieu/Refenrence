import React, { FunctionComponent, Fragment } from "react";
import { Loading } from "element-react";
import { css } from "@emotion/core";

import Button from "@/components/units/Button";
import { Theme } from "@/components/theme";

const dialogStyle = () => (theme: Theme) => css`
  font-family: Gotham;
  color: ${theme.blue};
`;

const titleStyle = (boderWidthTitle: string) => (theme: Theme) => css`
  white-space: nowrap;
  font-size: 18px;
  margin-bottom: 10px;
  border: solid;
  border-color: ${theme.gray};
  border-width: ${boderWidthTitle};
`;

const itemStyle = css`
  padding: 15px 20px 10px 20px;
  display: inline-block;
`;

const closeButtonStyle = css`
  float: right;
  margin-top: -5px;
`;

const contentStyle = css``;

const loadingStyle = css`
  min-height: 30px;
  padding-top: 20px;
`;

interface DialogPrps {
  loading?: boolean;
  title?: string;
  boderWidthTitle?: string;
  offForm: () => any;
}

const Dialog: FunctionComponent<DialogPrps> = ({
  title,
  boderWidthTitle,
  loading,
  offForm,
  children
}) => {
  return (
    <div className="Dialog" css={dialogStyle()}>
      <div css={titleStyle(boderWidthTitle || "")}>
        <span css={itemStyle}>{title}</span>
        <div css={[itemStyle, closeButtonStyle]}>
          <Button
            iconName="close"
            iconColor="iherit"
            border="none"
            padding="0px 0px"
            iconSize={25}
            onClick={offForm}
          />
        </div>
        <div style={{ clear: "both" }} />
      </div>
      <div css={contentStyle}>
        {loading ? (
          <div css={loadingStyle}>
            <Loading />
          </div>
        ) : (
          <Fragment>{children}</Fragment>
        )}
      </div>
    </div>
  );
};

export default Dialog;
