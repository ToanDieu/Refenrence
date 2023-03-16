import React, { useEffect, memo, useState, useContext } from "react";
import { connect } from "react-redux";
import { TranslateFunction } from "react-localize-redux";
import { compose } from "redux";
import styled from "@emotion/styled";
import { Notification, Button } from "element-react";
import { dissocPath, path } from "ramda";

import { makeSelectTranslate } from "@/i18n/selectors";
import { PopupHelperCtx } from "@/helpers/PopupHelper";
import { useInjectReducer } from "@/utils/injectReducer";

import { WorkflowMedia } from "@/resources/workflows";
import { ActionMedia, TriggerType } from "@/resources/actions";
import { removeWorkflowTempAction } from "@/resources/actions/actions";
import { ParamMedia } from "@/resources/params";

import Loading from "@/components/Loading";
import { ProtectedScopedComponent } from "@/components/HocComponent";
import WarningPopup from "@/components/presents/WarningPopup";

import ActionForm from "@/container/ActionForm";
import WorkflowForm from "@/container/WorkflowForm";

import PageHeader from "./PageHeader";
import WorkflowGraph from "./WorkflowGraph";
import NotifyMessage from "./NotifyMessage";

import * as thunks from "./thunks";
import * as actionCreators from "./actions";
import reducer from "./reducer";
import { updateAction } from "./actions";

import {
  makeSelectQueryBaseID,
  makeSelectLoading,
  makeSelectError,
  makeSelectIsEditMode,
  makeSelectCurrentWorkflow,
  makeSelectActionsByWorkflow,
  makeSelectParamsByBase
} from "./selectors";
import Snackbar from "@/components/blocks/Snackbar";

const Article = styled.article`
  padding: 30px 30px 100px;
  min-height: calc(100vh - 156px);
`;

const Block = styled.div`
  text-align: center;
`;
interface Props {
  baseID: number;
  creatingTempAction: boolean;
  id: number;
  loading: boolean;
  error: Error;
  isEditMode: boolean;
  workflow: WorkflowMedia;
  actions: ActionMedia[];
  params: ParamMedia[];
  translate: TranslateFunction;
  setBaseID: (baseID: number) => void;
  fetchData: (baseID: number) => void;
  removeTempAction: () => void;
  updateWorkflowAction: (baseID: number, action: ActionMedia) => Promise<any>;
  updateTempAct: (action: ActionMedia) => void;
  createWorkflowAction: (baseID: number, action: any) => void;
  deleteWorkflowAction: (baseID: number, actionId: number) => Promise<any>;
}

interface Selected {
  parentId?: number;
  branching?: "accept" | "reject";
  actionId?: number;
  triggerIdx?: number;
}

interface DeleteData {
  type?: string;
  data: any;
}

export function WorkflowDetail({
  baseID,
  creatingTempAction,
  loading,
  error,
  isEditMode,
  workflow,
  actions,
  params,
  translate,
  setBaseID,
  fetchData,
  removeTempAction,
  createWorkflowAction,
  updateTempAct,
  updateWorkflowAction,
  deleteWorkflowAction
}: Props) {
  const key = "workflowDetail";
  useInjectReducer({ key, reducer });

  const [selected, setSelected] = useState<Selected>({
    branching: "accept",
    actionId: undefined,
    triggerIdx: undefined
  });

  const initialData = { type: undefined, data: {} };
  const [deleteData, setDeleteData] = useState<DeleteData>(initialData);

  const popUp = useContext(PopupHelperCtx);

  useEffect(() => {
    if (baseID) {
      setBaseID(baseID);
      fetchData(baseID);
    }
  }, []);

  useEffect(() => {
    if (error) {
      Notification.error({
        title: "Error",
        message: error.message
      });
    }
  }, [error]);

  useEffect(() => {
    if (popUp)
      popUp.setContent({
        render: onClose => (
          <ActionForm
            visible
            activated={workflow.active}
            onClose={onClose}
            baseID={baseID}
            workflowID={workflow.id}
            parentId={selected.parentId}
            branching={selected.branching}
            actionId={selected.actionId}
            triggerIdx={selected.triggerIdx}
            params={params}
          />
        ),
        on: false
      });
  }, [selected, workflow]);

  let component;
  if (loading) {
    component = <Loading />;
  } else if (workflow === undefined) {
    component = <WorkflowForm baseID={baseID} />;
  } else if (actions.length === 0) {
    component = (
      <React.Fragment>
        <PageHeader baseID={baseID} workflow={workflow} actions={actions} />
        <Block>
          <ProtectedScopedComponent
            scopes={["post:my-org-type-base-workflow:action"]}
          >
            <Button
              type="primary"
              onClick={() => {
                setSelected({});
                if (popUp) popUp.turn(true);
              }}
            >
              {translate("addAction")}
            </Button>
          </ProtectedScopedComponent>
        </Block>
      </React.Fragment>
    );
  } else {
    const handleOnOk = () => {
      const { type, data } = deleteData;
      const { actionId, triggerIdx } = data;
      const action = actions.find(item => item.id === actionId);
      if (!action) return;

      if (type === "deleteTrigger") {
        const newAction = dissocPath(
          ["triggers", triggerIdx as string | number],
          action
        );
        if (actionId === -1) {
          updateTempAct({
            ...(newAction as ActionMedia),
            workflowID: workflow.id
          });
          setDeleteData(initialData);
        } else {
          updateWorkflowAction(baseID, newAction as ActionMedia).then(
            success => {
              if (!success) return;
              const trigger = path(
                ["triggers", triggerIdx],
                action
              ) as TriggerType;

              if (!trigger) return;
              setDeleteData(initialData);
              Notification.info({
                title: "Trigger deleted",
                message: <NotifyMessage triggerType={trigger.triggerType} />
              });
            }
          );
        }
      }
      if (type === "deleteAction") {
        deleteWorkflowAction(baseID, actionId).then(success => {
          if (success) {
            setDeleteData(initialData);
            Notification.info({
              title: "Action deleted",
              message: <NotifyMessage action={action} />
            });
          }
        });
      }
    };

    component = (
      <React.Fragment>
        <PageHeader baseID={baseID} workflow={workflow} actions={actions} />
        <WorkflowGraph
          baseID={baseID}
          editing={isEditMode && !creatingTempAction}
          rootId={workflow.initialActionID || 0}
          workflow={workflow}
          actions={actions}
          setSelected={setSelected}
          popUp={popUp}
          translate={translate}
          setDeleteData={setDeleteData}
        />
        <WarningPopup
          visible={deleteData.type !== undefined}
          type={
            deleteData.type as "deleteAction" | "deleteTrigger" | "activate"
          }
          onOk={handleOnOk}
          onCancel={() => {
            setDeleteData(initialData);
          }}
        />
      </React.Fragment>
    );
  }

  return (
    <Article>
      {component}
      {creatingTempAction && (
        <Snackbar
          text="You can only edit actions and triggers before submitting."
          primarySubmit={() => {
            const tempActionData = actions.find(act => act.id === -1);

            createWorkflowAction(baseID, {
              ...tempActionData,
              workflowID: workflow.id
            });
          }}
          secondarySubmit={removeTempAction}
        />
      )}
    </Article>
  );
}

const mapStateToProps = () => {
  return (state: any, props: any) => {
    const baseID = makeSelectQueryBaseID()(state, props);
    const actions = makeSelectActionsByWorkflow(baseID)(state);
    const tempIdx = actions.findIndex(act => act.id === -1); // action with id -1 is temp action
    const creatingTempAction = tempIdx !== -1; // found

    return {
      baseID,
      creatingTempAction,
      loading: makeSelectLoading()(state),
      error: makeSelectError()(state),
      isEditMode: makeSelectIsEditMode()(state),
      workflow: makeSelectCurrentWorkflow(baseID)(state),
      actions: makeSelectActionsByWorkflow(baseID)(state),
      params: makeSelectParamsByBase(baseID)(state),
      translate: makeSelectTranslate()(state)
    };
  };
};

export function mapDispatchToProps(dispatch: any) {
  return {
    setBaseID: (baseID: number) => {
      dispatch(actionCreators.setBaseID(baseID));
    },
    fetchData: (baseID: number) => {
      dispatch(thunks.fetchWorkflows(baseID));
      dispatch(thunks.fetchBaseData(baseID));
    },
    createWorkflowAction: (baseID: number, action: ActionMedia) => {
      dispatch(thunks.createWorkflowAction(baseID, action));
    },
    removeTempAction: () => {
      dispatch(removeWorkflowTempAction());
    },
    updateTempAct: (action: ActionMedia) => {
      dispatch(updateAction(action));
    },
    updateWorkflowAction: (baseID: number, action: ActionMedia) => {
      return dispatch(thunks.updateWorkflowAction(baseID, action));
    },
    deleteWorkflowAction: (baseID: number, actionId: number) => {
      return dispatch(thunks.deleteWorkflowAction(baseID, actionId));
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
)(WorkflowDetail);
