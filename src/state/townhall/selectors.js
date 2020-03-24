import { createSelector } from 'reselect';
import { filter } from 'lodash';

export const getTownHall = state => state.townhall;

export const getMemberIsSelected = createSelector([getTownHall], townHall => !!townHall.party);

export const getRequiredFields = createSelector([getTownHall], (townHall) => {
  const { meetingType } = townHall
  const required = ['address', 'displayName', 'time', 'date', 'state', 'meetingType'];
  if (meetingType === 'No Events') {
    return [];
  }
  if (meetingType === 'Tele-Town Hall' || meetingType === 'Campaign Tele-Town Hall') {
    return filter(required, ele => ele !== 'address');
  }
  return required;
});
