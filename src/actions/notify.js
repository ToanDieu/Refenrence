import axios from "axios";
import Pusher from "pusher-js";
import { push } from "connected-react-router";

import config from "../appConfig";
import * as types from "../constants/actionTypes";
import { getLanguage, asyncActionCreator, defaultHeaders } from "./utils";

export const showNotifications = () => dispatch => {
  dispatch({
    type: types.NOTIFY_BUTTON_CLICK
  });
  dispatch(push("/notifications"));
};

export const addNewEvent = event => dispatch => {
  dispatch({
    type: types.NOTIFY_EVENT,
    event
  });
};

//! [DUMMY] GLOBAL USE OBJ TO PRESISTENT pusher socket
let socket = undefined;

export const setBaseChannel = ({ baseID }) => dispatch => {
  if (socket === undefined) {
    socket = new Pusher(config.PUSHER_KEY, {
      cluster: "ap1",
      authEndpoint: `${config.TSE_API}/base/pusher-credentials`,
      auth: {
        headers: defaultHeaders()
      },
      encrypted: true
    });
  }

  socket.unsubscribe(`private-base-${baseID}`);
  let dashBoardChannel = socket.subscribe(`private-base-${baseID}`);
  console.log("subcribed ", baseID);
  dashBoardChannel.bind("main", data => {
    console.log("channel data: ", data);
    dispatch({
      type: types.NOTIFY_EVENT,
      event: data
    });
  });
};

export const fetchOldNotifications = asyncActionCreator(
  types.NOTIFICATION_LIST,
  params => () => {
    const lang = getLanguage();
    return axios.get(
      `${config.TSE_API}/my-org-type/bases/${
        params.baseID
      }/notifications?lang=${lang}`,
      {
        headers: defaultHeaders()
        // params
      }
    );
  }
);
