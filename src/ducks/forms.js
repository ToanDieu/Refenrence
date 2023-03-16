const SHOW = "app/forms/SHOW";

const initialState = {
  current: undefined,
  visible: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SHOW:
      return { ...state, current: action.formName, visible: action.visible };
    default:
      return state;
  }
}

export function showForm(formName) {
  return {
    type: SHOW,
    formName,
    visible: true
  };
}

export function offForm() {
  return {
    type: SHOW,
    formName: undefined,
    visible: false
  };
}
