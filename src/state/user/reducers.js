const initialState = {
  displayName: null,
  email: null,
  userMocs: [],
  eventCount: 0,
  initialLoad: true,
  uid: null,
};

const selectionReducer = (state = initialState, {
  type,
  payload,
}) => {
  switch (type) {
  case 'CLEAR_USER':
    return {
      ...initialState,
    };
  case 'SET_USER':
    return {
      ...state,
      uid: payload.uid,
      displayName: payload.displayName,
      email: payload.email,
    };
  case 'SET_INITIAL_EVENT_COUNT':
    return {
      ...state,
      initialLoad: false,
      eventCount: payload,
    };
  case 'INCREMENT_USER_EVENT_COUNT':
    return {
      ...state,
      eventCount: state.eventCount + 1,
    };
  case 'SET_MOCS':
    return {
      ...state,
      userMocs: payload,
    };
  default:
    return state;
  }
};

export default selectionReducer;
