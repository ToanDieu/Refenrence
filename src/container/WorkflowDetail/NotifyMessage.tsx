import React from "react";
import styled from "@emotion/styled";

import { ActionMedia } from "@/resources/actions";
import ItemType from "@/components/presents/NodeDetail/ItemType";

const Strong = styled.span`
  font-weight: bold;
`;

interface Props {
  action?: ActionMedia;
  triggerType?: string;
}

export function NotifyMessage({ action, triggerType }: Props) {
  if (triggerType) {
    return (
      <div style={{ textAlign: "left" }}>
        {`Trigger `}
        <Strong>
          <ItemType triggerType={triggerType} />
        </Strong>
        {` deleted`}
      </div>
    );
  }

  if (action) {
    return (
      <div style={{ textAlign: "left" }}>
        {`Action `}
        <Strong>
          {`#${action.id} `}
          <ItemType actionType={action.actionType} />
        </Strong>
        {` deleted`}
      </div>
    );
  }

  return null;
}

export default NotifyMessage;
