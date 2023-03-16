import * as React from "react";

const { useState, createContext, useEffect } = React;

interface PopupComponentProps {
  onClose: () => void;
  children: (closePopup?: () => void) => React.ReactNode;
}
type PopupComponent = React.FunctionComponent<PopupComponentProps>;

type PopupContentRps = {
  render: (closePopup?: () => void) => React.ReactNode;
  on: Boolean;
};

interface PopupHelperCtxProps {
  setContent: React.Dispatch<React.SetStateAction<PopupContentRps>>;
  turn: (visible: Boolean) => void;
  visible: Boolean;
}

export const PopupHelperCtx = createContext<PopupHelperCtxProps | null>(null);

interface PopupHelperProps {
  use: PopupComponent;
}

const PopupHelper: React.FunctionComponent<PopupHelperProps> = ({
  use: Popup,
  children
}: {
  use: PopupComponent;
  children?: React.ReactNode;
}) => {
  const noContent = () => <div />;

  const [popupContent, setContent] = useState<PopupContentRps>(() => ({
    render: noContent,
    on: false
  }));
  const [visible, setVisible] = useState<Boolean>(false);

  useEffect(() => {
    if (popupContent.on) {
      setVisible(true);
    }
    console.log(popupContent);
  }, [popupContent]);

  const turn = (on: Boolean) => {
    setVisible(on);
    if (!on) {
      setContent({
        render: noContent,
        on: false
      });
    }
  };
  const closePopup = () => turn(false);

  return (
    <PopupHelperCtx.Provider value={{ visible, setContent, turn }}>
      {visible && <Popup onClose={closePopup}>{popupContent.render}</Popup>}
      {children}
    </PopupHelperCtx.Provider>
  );
};

export default PopupHelper;
