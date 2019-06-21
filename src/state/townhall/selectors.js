import { createSelector } from 'reselect';
import { filter } from 'lodash';

export const getTownHall = state => state.townhall;

export const getRequiredFields = createSelector([getTownHall], (townHall) => {
  const required = ['address', 'displayName', 'time', 'date', 'state', 'meetingType'];
  if (townHall.meetingType === 'No Events') {
    return [];
  }
  if (townHall.meetingType === 'Tele-Town Hall') {
    return filter(required, ele => ele !== 'address');
  }
  return required;
});
