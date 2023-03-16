import {
  NOTIFY_BUTTON_CLICK,
  NOTIFY_EVENT,
  NOTIFICATION_LIST,
  CHANGE_PAGE
} from "../constants/actionTypes";

const initialState = {
  events: [],
  isPreloaded: false,
  isChanged: false
};

export default function notifyReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE:
      return { ...initialState };
    case NOTIFY_EVENT:
      return {
        ...state,
        isChanged: true,
        events: [action.event, ...state.events]
      };
    case NOTIFY_BUTTON_CLICK:
      return { ...state, isChanged: false };
    case NOTIFICATION_LIST.SUCCESS:
      return !state.isPreloaded
        ? {
            ...state,
            isPreloaded: true,
            events: [...action.payload, ...state.events]
          }
        : state;
    default:
      return state;
  }
}
