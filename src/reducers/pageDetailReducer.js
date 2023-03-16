import { CHANGE_PAGE } from "../constants/actionTypes";

const initState = {
  current: {
    pageType: "",
    detail: {
      id: ""
    }
  }
};

export default function pageDetailReducer(state = initState, action) {
  switch (action.type) {
    case CHANGE_PAGE:
      return { ...state, current: action.payload };
    default:
      return state;
  }
}
