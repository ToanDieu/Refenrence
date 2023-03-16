import React from "react";
import { Button } from "element-react";
import { css } from "@emotion/core";

const SnackbarStyle = css`
  position: fixed;
  z-index: 400;
  left: 25%;
  bottom: 30px;
  padding: 20px;
  text-align: center;
  background: #ffffff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
`;

const FadeinAnimation = css`
  -webkit-animation: fadein 0.5s;
  animation: fadein 0.5s;

  @-webkit-keyframes fadein {
    from {
      bottom: 0;
      opacity: 0;
    }
    to {
      bottom: 30px;
      opacity: 1;
    }
  }
  @keyframes fadein {
    from {
      bottom: 0;
      opacity: 0;
    }
    to {
      bottom: 30px;
      opacity: 1;
    }
  }
`;

// const FadeoutAnimation = css`
//   -webkit-animation: fadeout 0.5s;
//   animation: fadeout 0.5s;

//   @-webkit-keyframes fadeout {
//     from {
//       bottom: 30px;
//       opacity: 1;
//     }
//     to {
//       bottom: 0;
//       opacity: 0;
//     }
//   }

//   @keyframes fadeout {
//     from {
//       bottom: 30px;
//       opacity: 1;
//     }
//     to {
//       bottom: 0;
//       opacity: 0;
//     }
//   }
// `;

const TextStyle = css`
  padding: 23px 20px 23px 0px;
`;

interface Props {
  primaryLabel?: string;
  secondaryLabel?: string;
  text?: string;
  primarySubmit?: () => any;
  secondarySubmit?: () => any;
}

function Snackbar({
  primaryLabel = "Submit",
  secondaryLabel = "Cancel",
  text = "",
  primarySubmit,
  secondarySubmit
}: Props): JSX.Element {
  return (
    <div className="Popup" css={[SnackbarStyle, FadeinAnimation]}>
      <span css={TextStyle}>{text}</span>
      <Button onClick={secondarySubmit}>
        <span style={{ color: "#1E5A6E" }}>{secondaryLabel}</span>
      </Button>
      <Button type="primary" onClick={primarySubmit}>
        <span style={{ color: "#F2F2F2" }}>{primaryLabel}</span>
      </Button>
    </div>
  );
}

export default Snackbar;
