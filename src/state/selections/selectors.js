import { createSelector } from 'reselect';

import {
  FED_REP_EVENTS,
  STATE_REP_EVENTS,
  FED_CANDIDATE_EVENTS,
  STATE_CANDIDATE_EVENTS,
  DEFAULT_EVENTS,
} from '../../constants/index';

export const getSelectedUSState = state => state.selections.usState;
export const getMode = state => state.selections.mode;
export const getTempAddress = state => state.selections.address;
export const getTempLat = state => state.selections.lat;
export const getTempLng = state => state.selections.lng;
export const getTempState = state => state.selections.state;
export const getTempStateName = state => state.selections.stateName;
export const getFormKeys = state => state.selections.formKeys;


export const getLawmakerTypeEventOptions = createSelector([getMode, getSelectedUSState], (mode, usState) => {
  let lawmakerType;

  if (!usState && mode === 'moc') {
    lawmakerType = 'fedRep';
  } else if (mode === 'moc' && usState !== null) {
    lawmakerType = 'stateRep';
  } else if (!usState && mode === 'candidate') {
    lawmakerType = 'fedCandidate';
  } else if (mode === 'candidate' && usState !== null) {
    lawmakerType = 'stateCandidate';
  }
  const lawMakerToEventTypes = {
    fedRep: FED_REP_EVENTS,
    stateRep: STATE_REP_EVENTS,
    fedCandidate: FED_CANDIDATE_EVENTS,
    stateCandidate: STATE_CANDIDATE_EVENTS,
  };
  return lawMakerToEventTypes[lawmakerType] || DEFAULT_EVENTS;
});

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
