import { connect } from "react-redux";
import { normalize } from "normalizr";
import { set } from "lodash/fp";

import { ActionMedia } from "@/resources/actions";
import {
  createWorkflowTempAction,
  updateWorkflowTempAction
} from "@/resources/actions/actions";
import * as actionSchema from "@/resources/actions/schema";
import { makeSelectById } from "@/resources/actions/selectors";
import {
  updateWorkflowAction,
  createWorkflowAction
} from "@/container/WorkflowDetail/thunks";
import NodeDetail from "@/components/presents/NodeDetail";
import { makeSelectPassFieldsByLanguage } from "../WorkflowDetail/selectors";

const mapDispatchToProps = (
  dispatch: any,
  {
    baseID,
    workflowID,
    activated
  }: { baseID: number; workflowID: number; activated: boolean }
) => ({
  onSubmit: (newActionData: ActionMedia, actionId?: number) => {
    // With activated Workflow true
    if (activated) {
      if (!actionId) {
        // Creating fake node
        const tempAction = { ...newActionData, workflowID, id: -1 };
        const { entities, result } = normalize(tempAction, actionSchema.action);
        const { actions = {} } = entities;
        const newActions = set(
          [result, "assignParent"],
          tempAction.assignParent
        )(actions);

        // Directly add to redux store
        dispatch(createWorkflowTempAction(newActions, result));
      } else {
        if (newActionData.id !== -1) {
          // Edit normal node call api
          dispatch(
            updateWorkflowAction(baseID, { ...newActionData, workflowID })
          );
        }

        // Update node data in store
        const { entities } = normalize(
          { ...newActionData, workflowID },
          actionSchema.action
        );
        const { actions = {} } = entities;
        dispatch(updateWorkflowTempAction(actions));
      }

      return;
    }

    // Activated false
    if (!actionId) {
      dispatch(createWorkflowAction(baseID, { ...newActionData, workflowID }));
    } else {
      dispatch(updateWorkflowAction(baseID, { ...newActionData, workflowID }));
    }
  }
});

interface mapPrps {
  visible?: Boolean;
  params?: any;
  onClose?: () => void;
  actionId?: number;
  triggerIdx?: number;
  isCreateForm?: boolean;
  activated: boolean;
  parentId?: number;
  baseID: number;
  workflowID: number;
  branching?: "accept" | "reject";
}

const mapStateToProps = (
  state: any,
  { actionId, triggerIdx, isCreateForm }: mapPrps
) => {
  return {
    action: actionId ? makeSelectById()(state)[actionId] : undefined,
    triggerIdx,
    isCreateForm,
    fields: makeSelectPassFieldsByLanguage()(state)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NodeDetail as any);
