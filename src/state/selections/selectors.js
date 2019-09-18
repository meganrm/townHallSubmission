import { createSelector } from 'reselect';

import {
  FED_CANDIDATE_EVENTS,
  STATE_CANDIDATE_EVENTS,
  DEFAULT_EVENTS,
  REP_EVENTS,
} from '../../constants/index';
import { getMemberIsSelected } from '../townhall/selectors';

export const getSelectedUSState = state => state.selections.usState;
export const getMode = state => state.selections.mode;
export const getTempAddress = state => state.selections.address;
export const getTempLat = state => state.selections.lat;
export const getTempLng = state => state.selections.lng;
export const getTempState = state => state.selections.state;
export const getTempStateName = state => state.selections.stateName;
export const getFormKeys = state => state.selections.formKeys;


export const getLawmakerTypeEventOptions = createSelector([getMode, getSelectedUSState, getMemberIsSelected], (mode, usState, memberIsSelected) => {
  let lawmakerType = 'default';

  if (mode === 'candidate') {
    if (usState) {
      lawmakerType = 'stateCandidate';
    }
    lawmakerType = 'fedCandidate';
  } else if (memberIsSelected) {
    lawmakerType = 'member';
  }

  const lawMakerToEventTypes = {
    default: DEFAULT_EVENTS,
    fedCandidate: FED_CANDIDATE_EVENTS,
    member: REP_EVENTS,
    stateCandidate: STATE_CANDIDATE_EVENTS,
  };
  return lawMakerToEventTypes[lawmakerType] || DEFAULT_EVENTS;
});

export const getPeopleNameUrl = createSelector([getSelectedUSState, getMode], (usState, mode) => {
  if (mode === 'candidate') {
    if (usState) {
      return `state_candidate_keys/${usState}`
    }
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

export const getLiveUrl = createSelector([getSelectedUSState], (usState) => {
  if (usState) {
    return `state_townhalls/${usState}`;
  }
  return 'townHalls';
})