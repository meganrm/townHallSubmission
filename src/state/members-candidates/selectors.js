import { createSelector } from 'reselect';
import { map, uniq } from 'lodash';

export const getAllPeople = state => state.people.allPeople;
export const getPeopleRequestError = state => state.people.error;
export const getSelectedMember = state => state.people.selectedMember;
export const getSelectedLink = state => state.people.selectedLink;

export const getAllNames = createSelector([getAllPeople], people => uniq(map(people, 'nameEntered')));

export const getSelectedMemberLinks = state => {
  let selectedMember = getSelectedMember(state);
    return selectedMember && selectedMember.moc_links ? Object.keys(selectedMember.moc_links).map(key => {
      let link = selectedMember.moc_links[key];
      return {
        id: key,
        ...link
      }
    }) : []
};

