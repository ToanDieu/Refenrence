import React, { useEffect, memo } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { TranslateFunction } from "react-localize-redux";
import { Button, Dialog, Form, Input, Notification } from "element-react";
import styled from "@emotion/styled";

import { ProtectedScopedComponent } from "@/components/HocComponent";
import { useInjectReducer } from "@/utils/injectReducer";
import { makeSelectTranslate } from "@/i18n/selectors";
import * as actions from "./actions";
import { createWorkflow } from "./thunks";
import { FormModel } from "./types";
import reducer from "./reducer";
import {
  makeSelectVisible,
  makeSelectForm,
  makeSelectSubmitting,
  makeSelectError
} from "./selectors";

const Block = styled.div`
  text-align: center;
  color: ${props => props.theme.primary};
  p {
    margin: 12px;
  }
`;

interface Props {
  translate: TranslateFunction;
  baseID: number;
  visible: boolean;
  form: FormModel;
  submitting: boolean;
  error: Error;
  setDialogVisible: (visible: boolean) => void;
  changeFormData: (key: string, value: any) => void;
  createWorkflow: (baseID: number) => void;
}

export function WorkflowForm({
  translate,
  baseID,
  visible,
  form,
  submitting,
  error,
  setDialogVisible,
  changeFormData,
  createWorkflow: createWorkflowAction
}: Props) {
  const key = "workflowForm";
  useInjectReducer({ key, reducer });

  useEffect(() => {
    if (error) {
      Notification.error({
        title: "Error",
        message: error.message
      });
    }
  }, [error]);

  const formRef = React.createRef<Form>();
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current !== null) {
      formRef.current.validate((valid: boolean) => {
        if (valid) {
          createWorkflowAction(baseID);
        }
      });
    }
  };

  return (
    <div>
      <Block>
        <p>{translate("workflowEmptyText")}</p>
        <ProtectedScopedComponent scopes={["post:my-org-type-base:workflow"]}>
          <Button type="primary" onClick={() => setDialogVisible(true)}>
            {translate("createWorkflow")}
          </Button>
        </ProtectedScopedComponent>
      </Block>
      <Dialog
        title={translate("createWorkflow") as string}
        size="tiny"
        visible={visible}
        onCancel={() => setDialogVisible(false)}
      >
        <Dialog.Body>
          <Form
            ref={formRef}
            model={form}
            labelPosition="top"
            rules={{
              name: [
                {
                  required: true,
                  message: translate("workflowNameRequired"),
                  trigger: "blur"
                }
              ]
            }}
          >
            <Form.Item label={translate("workflowName") as string} prop="name">
              <Input
                value={form.name}
                onChange={value => changeFormData("name", value)}
              />
            </Form.Item>
            <Form.Item
              label={translate("workflowDesc") as string}
              prop="description"
            >
              <Input
                value={form.description}
                onChange={value => changeFormData("description", value)}
              />
            </Form.Item>
          </Form>
        </Dialog.Body>
        <Dialog.Footer className="dialog-footer">
          <Button
            loading={submitting}
            type="primary"
            nativeType="submit"
            onClick={onSubmit}
          >
            {translate("createbutton")}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  );
}

const mapStateToProps = createStructuredSelector<{}, {}>({
  translate: makeSelectTranslate(),
  visible: makeSelectVisible(),
  form: makeSelectForm(),
  submitting: makeSelectSubmitting(),
  error: makeSelectError()
});

const withConnect = connect(
  mapStateToProps,
  { ...actions, createWorkflow }
);

export default compose(
  withConnect,
  memo
)(WorkflowForm) as any;
