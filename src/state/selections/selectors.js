import { createSelector } from 'reselect';

export const getSelectedUSState = state => state.selections.usState;
export const getMode = state => state.selections.mode;
export const getTempAddress = state => state.selections.address;
export const getTempLat = state => state.selections.lat;
export const getTempLng = state => state.selections.lng;
export const getTempState = state => state.selections.state;
export const getTempStateName = state => state.selections.stateName;
export const getFormKeys = state => state.selections.formKeys;


export const getLawmakerTypeEventOptions = state => {
  let mode = state.selections.mode;
  let usState = state.selections.usState;
  let eventsArray = [];
  let lawmakerType;

  // parse lawmaker type from state
  if (!usState && mode === 'moc') {
    lawmakerType = 'fedRep';
  } else if (mode === 'moc' && usState !== null) {
    lawmakerType = 'stateRep';
  } else if (!usState && mode === 'candidate') {
    lawmakerType = 'fedCandidate';
  } else if (mode === 'candidate' && usState !== null) {
    lawmakerType = 'stateCandidate';
  }

  // get events options array from lawmaker type
  switch (lawmakerType) {
    case 'fedRep':
      eventsArray = ['No Events', 'Town Hall', 'Tele-Town Hall', 'Empty Chair Town Hall', 'Campaign Town Hall', 'Adopt-A-District/State', 'DC Event', 'Office Hours', 'Other'];
      break;
    case 'stateRep':
      eventsArray = ['No Events', 'Town Hall', 'Tele-Town Hall', 'Empty Chair Town Hall', 'Campaign Town Hall', 'Adopt-A-District/State', 'Hearing', 'Office Hours', 'Other'];
      break;
    case 'fedCandidate':
      eventsArray = ['No Events', 'Campaign Town Hall', 'Other', 'Ticketed Event'];
      break;
    case 'stateCandidate':
      eventsArray = ['No Events', 'Campaign Town Hall', 'Other', 'Ticketed Event'];
      break;
    default:
      eventsArray = ['No Events', 'Town Hall', 'H.R. 1 Town Hall', 'H.R. 1 Activist Event', 'Tele-Town Hall', 'Ticketed Event', 'Campaign Town Hall', 'Adopt-A-District/State', 'Empty Chair Town Hall', 'Hearing', 'DC Event', 'Office Hours', 'Other'];
  }
  return eventsArray;
}

export const getPeopleNameUrl = createSelector([getSelectedUSState, getMode], (usState, mode) => {
  if (mode === 'candidate') {
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
