import React from "react";

import { actionTypes, triggerTypes } from "./index";

interface Props {
  actionType?: string;
  triggerType?: string;
}

export function ItemType({ actionType, triggerType }: Props) {
  if (actionType) {
    const type = actionTypes.find(({ itemName }) => itemName === actionType);
    return <span>{type ? type.label : ""}</span>;
  }

  if (triggerType) {
    const type = triggerTypes.find(({ itemName }) => itemName === triggerType);
    return <span>{type ? type.label : ""}</span>;
  }

  return null;
}

export default ItemType;
