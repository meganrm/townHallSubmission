const initialState = {
  mode: 'moc',
  usState: null,
};

const selectionReducer = (state = initialState, { type, payload }) => {
  switch (type) {
  case 'RESET_SELECTIONS':
    return {
      ...initialState,
    };
  case 'SET_SELECTED_US_STATE':
    return {
      ...state,
      usState: payload,
    };
  case 'TOGGLE_MODE':
    return {
      ...state,
      mode: payload,
    };

  case 'SEARCH_ADDRESSES':
      return {
          ...state,
          possibleAddresses: [...state.possibleAddresses, payload],
      };
  default:
    return state;
  }
};

export default selectionReducer;
