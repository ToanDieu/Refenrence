import { matchPath } from "react-router-dom";
import { CHANGE_PAGE, NOTIFY_BUTTON_CLICK } from "../constants/actionTypes";

const changeToBasePage = id => ({
  type: CHANGE_PAGE,
  payload: {
    pageType: "base",
    detail: { id }
  }
});

export const trackPageNavigate = ({
  dispatch
  // getState
}) => next => action => {
  if (action.type === "@@router/LOCATION_CHANGE") {
    console.log("trackViews__action: ", action);
    const pathName = action.payload.location.pathname;

    const isEnteringBaseCases = matchPath(pathName, {
      path: "/bases/:baseID/cases"
    });

    const isEnteringBaseDetail = matchPath(pathName, {
      path: "/bases/:baseID"
    });

    // console.log("isEnteringBaseDetail", isEnteringBaseDetail, action);

    const isEnteringBaseWorkflow = matchPath(pathName, {
      path: "/bases/:baseID/workflows/*/actions"
    });

    const isEnteringNotification = matchPath(pathName, {
      path: "/notifications"
    });

    if (isEnteringNotification) {
      dispatch({
        type: NOTIFY_BUTTON_CLICK
      });
    }

    if (isEnteringBaseCases) {
      // console.log("trackViews__matchPath: ", isEnteringBaseCases.params.baseID);
      dispatch(changeToBasePage(isEnteringBaseCases.params.baseID));
      // console.log(getState().pageDetail.current);
      return next(action);
    }

    if (isEnteringBaseDetail) {
      // console.log("trackViews__matchPath: ", isEnteringBaseCases.params.baseID);
      dispatch(changeToBasePage(isEnteringBaseDetail.params.baseID));
      // console.log(getState().pageDetail.current);
      return next(action);
    }

    if (isEnteringBaseWorkflow) {
      // console.log("trackViews__matchPath: ", isEnteringBaseCases.params.baseID);
      dispatch(changeToBasePage(isEnteringBaseWorkflow.params.baseID));
      // console.log(getState().pageDetail.current);
      return next(action);
    }
  }

  return next(action);
};
