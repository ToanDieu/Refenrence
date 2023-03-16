import React from "react";
import { Button, Dialog } from "element-react";
import styled from "@emotion/styled";

const FooterButton = styled(Button)`
  text-transform: uppercase;
`;

interface Modal {
  size?: "large" | "small" | "tiny" | "full";
}

interface Props extends Modal {
  visible: boolean;
  title: string;
  content: string | React.ReactNode;
  okText?: string;
  cancelText?: string;
  okButtonProps?: any;
  onOk?: () => void;
  onCancel?: () => void;
}

function ConfirmModal({
  visible,
  title,
  content,
  okText = "Confirm",
  cancelText = "Cancel",
  okButtonProps = {},
  onOk = () => {},
  onCancel = () => {},
  ...rest
}: Props) {
  return (
    <Dialog title={title} visible={visible} onCancel={onCancel} {...rest}>
      <Dialog.Body>{content}</Dialog.Body>
      <Dialog.Footer className="dialog-footer">
        <FooterButton onClick={onCancel}>{cancelText}</FooterButton>
        <FooterButton {...okButtonProps} onClick={onOk}>
          {okText}
        </FooterButton>
      </Dialog.Footer>
    </Dialog>
  );
}

export default ConfirmModal;
