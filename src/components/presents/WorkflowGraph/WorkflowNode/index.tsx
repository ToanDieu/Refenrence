import React, { FunctionComponent } from "react";
import { css } from "@emotion/core";
import { TriggerType, ActionType } from "@/resources/actions";
import { FieldMedia } from "@/resources/bases";
import Action from "./Action";
import Triggers from "./Triggers";

const wrapper = css`
  margin: 0 auto;

  width: fit-content;
  max-width: 470px;
  min-width: 250px;
`;

const content = (isTemp: boolean) => css`
  ${isTemp &&
    `position: relative;
    z-index: 301;`}
  padding: 0 24px;
`;

const shadow = (isTemp: boolean) => css`
  ${isTemp && `box-shadow: 0 7px 10px 0 rgba(0,0,0,.08);`}
`;

const overlayFull = css`
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  /* overflow: auto; */
  /* outline: none; */
  z-index: 300;
  height: 100%;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.5);
`;

interface WorkflowNodePrps {
  editing?: boolean;
  action: ActionType;
  triggers: TriggerType[];
  fields: FieldMedia[];
  onEditAction?: (actionId: number) => void;
  onDeleteAction?: (actionId: number) => void;
  onAddTrigger?: (actionId: number) => void;
  onEditTrigger?: (actionId: number, triggerIdx: number) => void;
  onDeleteTrigger?: (actionId: number, triggerIdx: number) => void;
  onEditQuantifier?: (actionId: number, qual: "All" | "Any") => void;
}

const WorkflowNode: FunctionComponent<WorkflowNodePrps> = ({
  editing = false,
  triggers,
  action,
  fields = [],
  onAddTrigger = actionId => console.log("add trigger for action", actionId),
  onEditTrigger = (actionId, triggerIdx) =>
    console.log("editing trigger", actionId, triggerIdx),
  onDeleteTrigger = (actionId, triggerIdx) =>
    console.log("deleting trigger", actionId, triggerIdx),
  onEditQuantifier = (actionId, qual) =>
    console.log("editing triggers qual", actionId, qual),
  onEditAction,
  onDeleteAction
}) => {
  const actionHasTriggers = triggers.length > 0 || editing;
  const { triggerQuantifier = "ALL" as any } = action;
  const isTempNode = action.id === -1;
  const isLeafAction = !action.acceptActionID && !action.rejectActionID;

  return (
    <div css={wrapper}>
      {isTempNode && <div css={overlayFull} />}
      <div css={content(isTempNode)}>
        <div css={shadow(isTempNode)}>
          <Triggers
            editing={editing}
            qualifier={triggerQuantifier}
            triggers={triggers}
            onAdd={() => onAddTrigger(action.id as number)}
            onEditTrigger={triggerIdx =>
              onEditTrigger(action.id as number, triggerIdx)
            }
            onDeleteTrigger={triggerIdx =>
              onDeleteTrigger(action.id as number, triggerIdx)
            }
            onEditQuantifier={qual =>
              onEditQuantifier(action.id as number, qual)
            }
          />
          <Action
            css={css`
              border-radius: ${actionHasTriggers ? "0 0" : "4px 4px"} 4px 4px;
            `}
            deletable={isLeafAction && !isTempNode}
            editing={editing}
            action={action}
            onEditAction={onEditAction}
            fields={fields}
            onDeleteAction={onDeleteAction}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowNode;
