import React, { useEffect, memo } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { TranslateFunction } from "react-localize-redux";
import { Button, Dialog, Notification } from "element-react";
import styled from "@emotion/styled";

import { useInjectReducer } from "@/utils/injectReducer";
import { makeSelectTranslate } from "@/i18n/selectors";
import { NextIcon } from "@/components/units/Icon";
import { WorkflowMedia } from "@/resources/workflows";
import * as actions from "./actions";
import { activateWorkflow } from "./thunks";
import reducer from "./reducer";
import {
  makeSelectVisible,
  makeSelectSubmitting,
  makeSelectError,
  makeSelectActivated
} from "./selectors";

const ButtonWithIcon = styled(Button)`
  vertical-align: top;
  margin-right: 12px;
  height: 40px;
  padding-left: 15px;
  padding-right: 15px;

  .tseicon {
    font-size: 24px;
    vertical-align: middle;
    line-height: 14px;
    margin-right: 7px;
    color: ${props => props.theme.success};
    opacity: 0.5;
  }
`;

const Content = styled.div`
  display: flex;

  .tseicon {
    font-size: 40px;
    margin-right: 20px;
    color: ${props => props.theme.danger};
  }

  ul {
    list-style: initial;
    padding-left: 20px;

    li {
      margin-bottom: 20px;
    }
  }

  p {
    padding-left: 20px;
  }
`;

const FooterButton = styled(Button)`
  text-transform: uppercase;
`;

interface Props {
  translate: TranslateFunction;
  baseID: number;
  workflow: WorkflowMedia;
  visible: boolean;
  submitting: boolean;
  activated: boolean;
  error: Error;
  cleanupNotifications: () => void;
  setDialogVisible: (visible: boolean) => void;
  activateWorkflow: (baseID: number, workflow: WorkflowMedia) => void;
}

export function ActivateForm({
  translate,
  baseID,
  workflow,
  visible,
  submitting,
  activated,
  error,
  cleanupNotifications,
  setDialogVisible,
  activateWorkflow: activateWorkflowAction
}: Props) {
  const key = "activateForm";
  useInjectReducer({ key, reducer });

  useEffect(() => {
    if (error) {
      Notification.error({
        title: "Error",
        message: error.message
      });
    }

    if (activated) {
      Notification.success({
        title: "Automation is active",
        message: `The automation ${workflow.name} is active`
      });
    }

    return () => {
      if (cleanupNotifications) cleanupNotifications();
    };
  }, [error, activated]);

  return (
    <React.Fragment>
      <Dialog
        title={translate("warning") as string}
        visible={visible}
        onCancel={() => setDialogVisible(false)}
      >
        <Dialog.Body>
          <Content>
            <NextIcon name="warning" />
            <div>
              <ul>
                <li>
                  You won’t be able to add triggers or actions when the
                  automation is active.
                </li>
                <li>You won’t be able to deactivate the workflow</li>
              </ul>
              <p>Do you want to activate the automation?</p>
            </div>
          </Content>
        </Dialog.Body>
        <Dialog.Footer className="dialog-footer">
          <FooterButton
            onClick={() => {
              setDialogVisible(false);
            }}
          >
            {translate("cancel")}
          </FooterButton>
          <FooterButton
            loading={submitting}
            nativeType="submit"
            type="primary"
            onClick={() => {
              activateWorkflowAction(baseID, workflow);
            }}
          >
            {translate("activate")}
          </FooterButton>
        </Dialog.Footer>
      </Dialog>
      <ButtonWithIcon
        type="primary"
        disabled={workflow.active}
        onClick={() => {
          setDialogVisible(true);
        }}
      >
        {workflow.active && <NextIcon name="dot" />}
        {translate("activate")}
      </ButtonWithIcon>
    </React.Fragment>
  );
}

const mapStateToProps = createStructuredSelector<{}, {}>({
  translate: makeSelectTranslate(),
  visible: makeSelectVisible(),
  submitting: makeSelectSubmitting(),
  activated: makeSelectActivated(),
  error: makeSelectError()
});

const withConnect = connect(
  mapStateToProps,
  { ...actions, activateWorkflow }
);

export default compose(
  withConnect,
  memo
)(ActivateForm) as any;
