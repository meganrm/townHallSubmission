const initialState = {
  allPeople: [],
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
    };
  default:
    return state;
  }
};

export default peopleReducer;
