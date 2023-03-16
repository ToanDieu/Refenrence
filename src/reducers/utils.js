const initState = {
  loading: false,
  data: null,
  error: null
};

export const loadStateReducer = (asyncStates, additionalCase) => {
  return (state = initState, action) => {
    switch (action.type) {
      case asyncStates.REQUEST:
        return {
          ...state,
          data: null,
          loading: true
        };
      case asyncStates.FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      case asyncStates.SUCCESS:
        return {
          ...state,
          loading: false,
          data: action.payload,
          error: null
        };
      default:
        if (additionalCase) {
          return additionalCase(state, action);
        }
        return state;
    }
  };
};
