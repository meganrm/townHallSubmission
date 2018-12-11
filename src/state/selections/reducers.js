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
  case 'SET_TEMP_ADDRESS':
    return {
      ...state,
      lat: payload.lat,
      lng: payload.lng,
      address: payload.address,
      state: payload.state,
      stateName: payload.stateName,
    };
  default:
    return state;
  }
};

export default selectionReducer;
