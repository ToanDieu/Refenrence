import React, { FunctionComponent } from "react";
import { uniqueId } from "lodash/fp";

import { ActionMedia } from "@/resources/actions";
import { FieldMedia } from "@/resources/bases";
import TreeList from "@/components/blocks/TreeList";
import Node from "./Node";

/**
 * Tranformation helpers
 */

// Types
type GraphNodes = {
  nodeType?: string;
  parentId?: number;
  branchDirIdx?: number;
  children: (Nodes | null)[];
};

type WorkflowNodes = ActionMedia & {
  nodeType?: string;
  parentId?: number;
  branchDirIdx?: number;
  children: (Nodes | null)[];
};

type Nodes = WorkflowNodes | GraphNodes;

type HashNodes = { [key: string]: ActionMedia };

// Func chainNodes do core tranforms task
function chainNodes({
  nodes,
  id,
  branchDirIdx,
  defaultPath,
  branching = {}
}: {
  nodes: HashNodes;
  id: number | undefined;
  defaultPath: string;
  branchDirIdx?: number;
  branching?: {
    [actionType: string]: {
      total: number;
      branchs: { [branchId: string]: string };
    };
  };
}): Nodes | null {
  const node = nodes[`${id}`];

  if (!node) {
    return null;
  }

  const actionType = node.actionType ? node.actionType : "";
  if (Object.keys(branching).indexOf(actionType) !== -1) {
    const { total: totalLink, branchs } = branching[actionType];

    const appendedBranchNodes = [...Array(totalLink)].map((_, index) => {
      const nodePath = branchs[`${index}`];

      if (nodePath && (node as any)[nodePath]) {
        return {
          id: uniqueId("branch_"),
          nodeType: "branchLabel",
          children: [
            chainNodes({
              branching,
              // pollution direction id for branching
              branchDirIdx: 0,
              nodes,
              defaultPath,
              id: (node as any)[nodePath]
            })
          ]
        };
      }

      return {
        id: uniqueId("branch_"),
        nodeType: "branchLabel",
        children: [
          {
            // pollution parent id for end node
            parentId: node.id,
            // pollution direction id for branching
            branchDirIdx: index,
            nodeType: "end",
            children: [],
            id: uniqueId("end_")
          }
        ]
      };
    });

    return { ...node, children: appendedBranchNodes };
  }

  const nextNodeId = (node as any)[defaultPath];
  if (nextNodeId) {
    return {
      ...node,
      children: [
        chainNodes({
          // reset direction id
          branchDirIdx: 0,
          branching,
          nodes,
          defaultPath,
          id: nextNodeId
        })
      ]
    };
  }

  return {
    ...node,
    children: [
      {
        // pollution parent id for end node
        parentId: node.id,
        // pollution direction id for branching
        branchDirIdx,
        nodeType: "end",
        children: [],
        id: uniqueId("end_")
      }
    ]
  };
}

// Func nestNodes setup config for chainNodes transformer
function nestNodes(actions: ActionMedia[], rootId: number): Nodes | null {
  const childs: HashNodes = {};

  actions.forEach(action => {
    if (action.id) childs[action.id] = action;
  });

  return chainNodes({
    branching: {
      Branch: {
        total: 2,
        branchs: {
          "0": "acceptActionID",
          "1": "rejectActionID"
        }
      }
    },
    nodes: childs,
    defaultPath: "acceptActionID",
    id: rootId
  });
}
/**
 * End hTranformation helpers
 */

/**
 * WorkflowGraph component
 */
// Types
interface WorkflowGraphPrps {
  editing: boolean;
  actions: ActionMedia[];
  rootId: number;
  fields: FieldMedia[];
  onAddNode?: (parentId: number, branch: "yes" | "no") => void;
  onAddTrigger?: (actionId: number) => void;
  onEditTrigger?: (actionId: number, triggerIdx: number) => void;
  onDeleteTrigger?: (actionId: number, triggerIdx: number) => void;
  onEditAction?: (actionId: number) => void;
  onDeleteAction?: (actionId: number) => void;
  onEditQuantifier?: (actionId: number, qual: "All" | "Any") => void;
  translate?: () => void;
}

// Component
const WorkflowGraph: FunctionComponent<WorkflowGraphPrps> = ({
  editing = false,
  actions,
  rootId,
  onAddNode,
  onAddTrigger,
  onEditTrigger,
  onDeleteTrigger,
  onEditAction,
  onDeleteAction,
  onEditQuantifier,
  fields = []
}) => {
  const data = nestNodes(actions, rootId);

  return (
    <TreeList
      data={data ? [data] : []}
      edgeLength={30}
      edgeThick={2}
      edgeColor="#1E5A6E"
      renderFunc={(item, index) =>
        item && (
          <Node
            editing={editing || ((item as WorkflowNodes).id as number) === -1}
            parentId={item.parentId}
            branchDirIdx={item.branchDirIdx}
            nodeType={item.nodeType}
            data={{
              index,
              action: item as WorkflowNodes,
              triggers: (item as WorkflowNodes).triggers
            }}
            onAddNode={onAddNode}
            onEditAction={onEditAction}
            onDeleteAction={onDeleteAction}
            onAddTrigger={onAddTrigger}
            onEditTrigger={onEditTrigger}
            onDeleteTrigger={onDeleteTrigger}
            onEditQuantifier={onEditQuantifier}
            fields={fields}
          />
        )
      }
    />
  );
};
/**
 * End WorkflowGraph
 */

export default WorkflowGraph;
