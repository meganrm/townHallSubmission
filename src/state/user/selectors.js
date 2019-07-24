import { createSelector } from 'reselect';
import { filter } from 'lodash';

export const getUid = state => state.user.uid;
export const getUserEmail = state => state.user.email;
export const getUserName = state => state.user.displayName;
export const getAllUserMOCs = state => state.user.userMocs;
export const getEventCount = state => state.user.eventCount;
export const getIsInitial = state => state.user.initialLoad;

export const getUserMOCs = createSelector([getAllUserMOCs], allMocs => filter(allMocs, moc => !!moc.govtrack_id || !!moc.path));
