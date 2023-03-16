import * as types from "../constants/actionTypes";

const initState = {
  loading: false,
  data: null,
  error: null
};

const caseCreateReducer = (state = initState, action) => {
  switch (action.type) {
    case types.CLEAR_CASE_FORM:
      return {
        ...initState
      };
    case types.CASE_CREATE.REQUEST:
      return {
        ...initState,
        loading: true
      };
    case types.CASE_CREATE.FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case types.CASE_CREATE.SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      };
    default:
      return state;
  }
};

export default caseCreateReducer;
