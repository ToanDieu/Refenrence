import { memo } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { assocPath } from "ramda";

import WorkflowGraph from "@/components/presents/WorkflowGraph";
import { updateWorkflowAction } from "./thunks";
import { updateAction } from "./actions";
import { ActionMedia } from "@/resources/actions";
import { makeSelectPassFieldsByLanguage } from "@/container/WorkflowDetail/selectors";

const mapStateToProps = createStructuredSelector<{}, {}>({
  fields: makeSelectPassFieldsByLanguage()
});

export function mapDispatchToProps(
  dispatch: any,
  { baseID, workflow, actions, setSelected, popUp, setDeleteData }: any
) {
  return {
    onEditQuantifier: (actionId: number, qual: string) => {
      const actionData = actions.find((act: ActionMedia) =>
        act.id ? act.id === actionId : false
      );
      if (actionData) {
        const newActionData = assocPath(
          ["triggerQuantifier"],
          qual,
          actionData
        );

        if (actionId === -1) {
          dispatch(updateAction({ ...newActionData, workflowID: workflow.id }));
        } else {
          dispatch(updateWorkflowAction(baseID, newActionData));
        }
      }
    },
    onAddTrigger: (actionId: number) => {
      setSelected({
        actionId,
        triggerIdx: -1
      });
      if (popUp) popUp.turn(true);
    },
    onEditTrigger: (actionId: number, triggerIdx: number) => {
      setSelected({
        actionId,
        triggerIdx
      });
      if (popUp) popUp.turn(true);
    },
    onAddNode: (parentId: number, branch: string) => {
      setSelected({
        parentId,
        branching: branch === "yes" ? "accept" : "reject"
      });
      if (popUp) popUp.turn(true);
    },
    onEditAction: (actionId: number) => {
      setSelected({
        actionId
      });
      if (popUp) popUp.turn(true);
    },
    onDeleteAction: (actionId: number) => {
      setDeleteData({
        type: "deleteAction",
        data: {
          actionId
        }
      });
    },
    onDeleteTrigger: (actionId: number, triggerIdx: number) => {
      setDeleteData({
        type: "deleteTrigger",
        data: {
          actionId,
          triggerIdx
        }
      });
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withConnect,
  memo
)(WorkflowGraph) as any;
