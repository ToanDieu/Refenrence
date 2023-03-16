import { BASE_CONTENT_UPDATE } from "../constants/actionTypes";

export default function baseReducer(state, action) {
  switch (action.type) {
    case BASE_CONTENT_UPDATE.SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    default:
      return state;
  }
}
