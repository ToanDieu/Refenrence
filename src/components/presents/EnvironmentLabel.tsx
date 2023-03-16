import React, { FunctionComponent, useState, useEffect } from "react";
import { css } from "@emotion/core";

import { Theme } from "@/components/theme";

interface EnvironmentLabelPrps {
  env: string;
}

const wrapper = ({ envString }: { envString: string }) => (theme: Theme) => css`
  height: 18px;
  line-height: 18px;
  width: 100%;
  text-align: center;
  background: ${envString === "development" ? "#1B8289" : "#913B60"};
  & span {
    font-size: 12px;
    font-weight: 500;
    color: ${theme.textColor};
    font-family: ${theme.fontFamily};
    text-transform: uppercase;
  }
`;

const EnvironmentLabel: FunctionComponent<EnvironmentLabelPrps> = ({
  env = ""
}) => {
  const [envString, setEnv] = useState(env);

  useEffect(() => {
    setEnv(env);
  }, [env]);
  if (envString === "development" || envString === "staging") {
    return (
      <div css={wrapper({ envString })}>
        <span>{envString}</span>
      </div>
    );
  }
  return null;
};

export default EnvironmentLabel;
