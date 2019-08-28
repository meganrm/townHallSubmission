const initialState = {
  formKeys: [0],
  mode: 'moc',
  usState: null,
  lat: null,
  lng: null,
  address: null,
  state: null,
  stateName: null,
  selectedOfficePerson: {},
};

const selectionReducer = (state = initialState, { type, payload }) => {
  switch (type) {
  case 'RESET_SELECTIONS':
    return {
      ...initialState,
    };
  case 'RESET_FORM_KEYS':
    return {
      ...state,
      formKeys: initialState.formKeys,
    };
  case 'SET_FORM_KEYS':
    return {
      ...state,
      formKeys: payload,
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
  case 'SET_SELECTED_OFFICE_PERSON':
    return {
      ...state,
      selectedOfficePerson: payload,
    }
  case 'SET_TEMP_ADDRESS':
    return {
      ...state,
      lat: payload.lat,
      lng: payload.lng,
      address: payload.address,
      state: payload.state,
      stateName: payload.stateName,
    };
  case 'CLEAR_ADDRESS':
    return {
      ...state,
      lat: initialState.lat,
      lng: initialState.lng,
      address: initialState.address,
      state: initialState.state,
      stateName: initialState.stateName,
    };
  default:
    return state;
  }
};

export default selectionReducer;
