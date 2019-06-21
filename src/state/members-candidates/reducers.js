const initialState = {
  allPeople: [],
  error: null,
};

const peopleReducer = (state = initialState, {
  type,
  payload,
}) => {
  switch (type) {
  case 'SET_PEOPLE':
    return {
      ...state,
      allPeople: payload,
      error: null,
    };
  case 'SET_DATABASE_LOOKUP_ERROR':
    return {
      ...state,
      error: 'That person is not in our database',
    };
  case 'RESET_DATABASE_LOOKUP_ERROR':
    return {
      ...state,
      error: null,
    };
  default:
    return state;
  }
};

export default peopleReducer;
