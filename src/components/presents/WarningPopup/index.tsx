import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { Theme } from "@/components/theme";
import { NextIcon } from "@/components/units/Icon";
import ConfirmModal from "@/components/blocks/ConfirmModal";

const Icon = styled(NextIcon)``; // https://www.styled-components.com/docs/advanced#caveat

const Content = styled.div`
  display: flex;

  ${Icon} {
    font-size: 40px;
    margin-right: 20px;
    color: ${props => props.theme.danger};
  }
`;

const Paragraph = styled.div`
  font-size: 15px;
  padding-top: 6px;
`;

const buttonStyle = (theme: Theme) => css`
  background-color: ${theme.danger};
  border-color: ${theme.danger};
`;

interface Props {
  visible: boolean;
  type?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

function WarningPopup({
  visible,
  type,
  onOk = () => {},
  onCancel = () => {}
}: Props) {
  let content = null;
  const okText = "Delete";
  const okButtonProps = {
    type: "danger",
    css: buttonStyle
  };
  switch (type) {
    case "deleteAction": {
      content = (
        <Paragraph>
          Are you sure you want to delete this action? This is irreversible.
        </Paragraph>
      );
      break;
    }

    case "deleteTrigger": {
      content = (
        <Paragraph>
          Are you sure you want to delete this trigger? This is irreversible.
        </Paragraph>
      );
      break;
    }
    default: {
      break;
    }
  }

  const customContent = (
    <Content>
      <Icon name="warning" />
      {content}
    </Content>
  );

  return (
    <ConfirmModal
      visible={visible}
      title="Warning"
      content={customContent}
      okText={okText}
      okButtonProps={okButtonProps}
      onOk={onOk}
      onCancel={onCancel}
    />
  );
}

export default WarningPopup;
