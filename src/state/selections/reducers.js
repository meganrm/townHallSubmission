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
        console.log(payload)
        return {
            ...state,
            mode: payload,
        };
    default:
        return state;
    }
};

export default selectionReducer;
