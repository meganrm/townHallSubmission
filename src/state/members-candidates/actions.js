import { firebasedb, fireStore } from '../../scripts/util/setupFirebase';
import {
  setDataFromPersonInDatabase,
  setAdditionalMember,
  updateAdditionalMember,
} from '../townhall/actions';
import { sanitizeDistrict } from '../../scripts/util';

export const databaseLookupError = () => ({
  type: 'SET_DATABASE_LOOKUP_ERROR',
});

export const resetDatabaseLookUpError = () => ({
  type: 'RESET_DATABASE_LOOKUP_ERROR',
});

export const setPeople = people => ({
  payload: people,
  type: 'SET_PEOPLE',
});

export const requestNamesInCollection = peopleNameUrl => dispatch => fireStore.collection(peopleNameUrl).where('in_office', '==', true)
  .get()
  .then((querySnapshot) => {
    const allPeople = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      allPeople.push(doc.data());
    });
    return dispatch(setPeople(allPeople));
  })
  .catch((error) => {
    console.log('Error getting documents: ', error);
  });

export const requestPersonDataById = (peopleDataUrl, id) => dispatch => firebasedb.ref(`${peopleDataUrl}/${id}`)
  .once('value')
  .then((result) => {
    if (result.exists()) {
      const personData = result.val();
      personData.district = sanitizeDistrict(personData.district);
      return (dispatch(setDataFromPersonInDatabase(personData)));
    }
    return dispatch(databaseLookupError());
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
