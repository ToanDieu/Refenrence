import { USER_LOGIN, USER_LOGOUT } from "../constants/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: ""
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN.REQUEST:
      return { ...state, loading: true, error: "" };
    case USER_LOGIN.SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case USER_LOGIN.FAILURE:
      return { ...state, loading: false, error: action.payload };
    case USER_LOGOUT:
      return { ...state, data: null, error: action.payload };
    default:
      return state;
  }
}
