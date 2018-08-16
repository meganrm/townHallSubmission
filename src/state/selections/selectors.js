import { createSelector } from 'reselect';

export const getSelectedUSState = state => state.selections.usState;
export const getMode = state => state.selections.mode;

export const getPeopleNameUrl = createSelector([getSelectedUSState, getMode], (usState, mode) => {
    if (mode === 'candidate') {
        console.log('candidate_keys')
        return 'candidate_keys';
    }
    if (usState) {
        return `state_legislators_id/${usState}`;
    }
    return 'mocID';
});

export const getPeopleDataUrl = createSelector([getSelectedUSState, getMode], (usState, mode) => {
    if (mode === 'candidate') {
        return 'candidate_data';
    }
    if (usState) {
        return `state_legislators_data/${usState}`;
    }
    return 'mocData';
});

export const getSaveUrl = createSelector([getSelectedUSState], (usState) => {
    if (usState) {
        return `state_legislators_user_submission/${usState}`;
    }
    return 'UserSubmission/';
});
