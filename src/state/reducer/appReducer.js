const initialAppState = {
  initialized: false,
};

export const appReducer = (state = initialAppState, action) => {
  switch (action.type) {
    case 'app/initialize': {
      return {
        ...state,
        initialized: action.payload,
      };
    }
    default:
      return state;
  }
};
