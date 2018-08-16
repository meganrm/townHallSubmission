export const setUsState = payload => ({
    payload,
    type: 'SET_SELECTED_US_STATE',
});

export const toggleMemberCandidate = payload => ({
    payload,
    type: 'TOGGLE_MODE',
});

export const resetSelections = () => ({
    type: 'RESET_SELECTIONS',
});
