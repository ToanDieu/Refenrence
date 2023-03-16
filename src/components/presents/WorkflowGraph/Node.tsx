/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";
import { TriggerType, ActionType } from "@/resources/actions";
import { FieldMedia } from "@/resources/bases";
import { Theme, default as configuredTheme } from "@/components/theme";
import Icon from "@/components/units/Icon";
import WorkflowNode from "./WorkflowNode";

/**
 * BranchLabelNode internal component
 */
// Styles
const branchLabel = (yes: boolean) => (theme: Theme) => css`
  margin: 0 auto;
  width: fit-content;

  border-radius: 4px;
  padding: 5px 10px;
  text-transform: uppercase;
  background-color: ${yes
    ? theme.red919 || "#E81919"
    : theme.green022 || "#26C022"};
  font-family: ${theme.fontFamily};
  color: ${theme.textColor};
`;

// Types
interface BranchLabelNodePrps {
  type: "yes" | "no";
}

// Component
const BranchLabelNode: FunctionComponent<BranchLabelNodePrps> = ({ type }) => (
  <div css={branchLabel(type === "no")}>{type}</div>
);
/**
 * End BranchLabelNode
 */

/**
 * AddNode internal component
 */
// Styles
const endWrapper = css`
  margin: 0 auto;
  padding: 0px 24px;
`;

// Types
interface AddNodePrps {
  onAdd: () => void;
}

// Component
const AddNode: FunctionComponent<AddNodePrps> = ({ onAdd }) => (
  <div role="presentation" css={endWrapper} onClick={onAdd}>
    <Icon
      css={css`
        margin-top: -2px;
        cursor: pointer;
      `}
      iconName="add"
      size={50}
      color={configuredTheme.orange}
    />
  </div>
);
/**
 * End AddNode
 */

/**
 * EndNode internal component
 */
const end = (theme: Theme) => css`
  margin: 0 auto;
  padding: 16px 0px;

  width: 120px;

  border-radius: 4px;
  background-color: ${theme.gray};
  font-family: ${theme.fontFamily};
  text-align: center;
  color: #7f7f7f;
`;

const EndNode: FunctionComponent<any> = () => (
  <div css={endWrapper}>
    <div css={end}>End</div>
  </div>
);
/**
 * End EndNode
 */

/**
 * Node component
 */
// Types
interface NodePrps {
  editing?: boolean;
  parentId?: number;
  branchDirIdx?: number;
  nodeType?: string;
  fields: FieldMedia[];
  data: { triggers?: TriggerType[]; action?: ActionType; index: number };
  onAddNode?: (parentId: number, branch: "yes" | "no") => void;
  onAddTrigger?: (actionId: number) => void;
  onEditTrigger?: (actionId: number, triggerIdx: number) => void;
  onDeleteTrigger?: (actionId: number, triggerIdx: number) => void;
  onEditAction?: (actionId: number) => void;
  onDeleteAction?: (actionId: number) => void;
  onEditQuantifier?: (actionId: number, qual: "All" | "Any") => void;
}

// Component
const Node: FunctionComponent<NodePrps> = ({
  editing = false,
  parentId,
  branchDirIdx,
  nodeType,
  data,
  onAddNode = (pId, branch) =>
    console.log(`adding node after id ${pId} branch ${branch}`),
  onEditTrigger,
  onDeleteTrigger,
  onAddTrigger,
  onEditQuantifier,
  onEditAction,
  fields = [],
  onDeleteAction
}) => {
  switch (nodeType) {
    case "branchLabel":
      return <BranchLabelNode type={data.index ? "no" : "yes"} />;
    case "end":
      return editing ? (
        <AddNode
          onAdd={() => {
            console.log("branching id node", branchDirIdx);
            onAddNode(parentId as number, branchDirIdx ? "no" : "yes");
          }}
        />
      ) : (
        <EndNode />
      );
    default:
      break;
  }

  if (data.action) {
    return (
      <WorkflowNode
        editing={editing}
        action={data.action}
        triggers={data.triggers || []}
        onAddTrigger={onAddTrigger}
        onEditTrigger={onEditTrigger}
        onDeleteTrigger={onDeleteTrigger}
        onEditQuantifier={onEditQuantifier}
        onEditAction={onEditAction}
        fields={fields}
        onDeleteAction={onDeleteAction}
      />
    );
  }

  return null;
};
/**
 * End Node component
 */

export default Node;
