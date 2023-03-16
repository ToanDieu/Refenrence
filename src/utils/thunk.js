export default function asyncActionCreator(asyncTypes, createThunk) {
  return (...args) => {
    const thunk = createThunk(...args);

    return dispatch => {
      dispatch({
        type: asyncTypes.REQUEST
      });

      return dispatch(thunk);
    };
  };
}
