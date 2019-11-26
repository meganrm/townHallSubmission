const initialState = {
  allTownHalls: [],
};

const allTownHallsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
  case 'SET_EVENTS_FOR_DUP_CHECK':
    return {
      ...state,
      allTownHalls: payload,
    }
  default:
    return state;
  }
};

export default allTownHallsReducer;
