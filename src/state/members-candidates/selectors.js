import { createSelector } from 'reselect';
import { map, uniq } from 'lodash';

export const getAllPeople = state => state.people.allPeople;

export const getAllNames = createSelector([getAllPeople], people => uniq(map(people, 'nameEntered')));
