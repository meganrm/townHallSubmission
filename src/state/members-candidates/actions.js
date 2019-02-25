import { firebasedb } from '../../scripts/util/setupFirebase';
import {
  setDataFromPersonInDatabase,
  setAdditionalMember,
  updateAdditionalMember,
} from '../townhall/actions';
import { sanitizeDistrict } from '../../scripts/util';

export const setPeople = people => ({
  payload: people,
  type: 'SET_PEOPLE',
});

export const startSetPeople = peopleNameUrl => dispatch => firebasedb.ref(peopleNameUrl)
  .once('value')
  .then((result) => {
    const allpeople = [];
    result.forEach((person) => {
      allpeople.push(person.val());
    });
    return (dispatch(setPeople(allpeople)));
  })
  .catch(console.log);

export const requestPersonDataById = (peopleDataUrl, id) => dispatch => firebasedb.ref(`${peopleDataUrl}/${id}`)
  .once('value')
  .then((result) => {
    const personData = result.val();
    personData.district = sanitizeDistrict(personData.district);
    return (dispatch(setDataFromPersonInDatabase(personData)));
  });

export const requestAdditionalPersonDataById = (peopleDataUrl, id, index) => dispatch => firebasedb.ref(`${peopleDataUrl}/${id}`)
  .once('value')
  .then((result) => {
    const personData = result.val();
    personData.district = sanitizeDistrict(personData.district);
    const member = {
      chamber: personData.chamber,
      displayName: personData.displayName,
      district: personData.district,
      govtrack_id: personData.govtrack_id || null,
      office: personData.role || null,
      party: personData.party,
      state: personData.state,
      thp_id: personData.thp_id || personData.thp_key || null,
    };
    if (index) {
      member.index = index;
      return dispatch(updateAdditionalMember(member));
    }
    return dispatch(setAdditionalMember(member));
  })
  .catch(console.log);
