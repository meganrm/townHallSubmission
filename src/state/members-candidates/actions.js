import { firebasedb, firestore } from '../../scripts/util/setupFirebase';
import {
  setDataFromPersonInDatabase,
  setAdditionalMember,
  updateAdditionalMember,
} from '../townhall/actions';
import {
  setSelectedMember
} from '../selections/actions';
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

export const getFederalCandidates = (allPeople) => dispatch =>
  firestore.collection('federal_candidates')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if (doc.data().status !== 'Loss') {
          allPeople.push(doc.data());
        }
      });
      return dispatch(setPeople(allPeople));
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });

export const requestNamesInCollection = peopleNameUrl => dispatch => 
  firestore.collection(peopleNameUrl).where('in_office', '==', true)
  .get()
  .then((querySnapshot) => {
    const allPeople = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      allPeople.push(doc.data());
    });
    if (peopleNameUrl === '116th_congress') {
      return dispatch(getFederalCandidates(allPeople));
    }
    return dispatch(setPeople(allPeople));
  })
  .catch((error) => {
    console.log('Error getting documents: ', error);
  });

export const requestPersonDataById = (peopleDataUrl, id) => dispatch => firestore.collection('office_people').doc(id)
  .get()
  .then((result) => {
    if (result.exists) {
      const personData = result.data();
      personData.district = sanitizeDistrict(personData.district);
      if (!personData.campaigns || !personData.campaigns.length) {
        // only has an office
        const flattedData = {
          ...personData,
          ...personData.roles[0],
        }
        return (dispatch(setDataFromPersonInDatabase(flattedData)))
      } else if (!personData.roles || !personData.roles.length) {
        // only has a campaign
        const flattedData = {
          ...personData,
          ...personData.campaigns[0],
        }
        return (dispatch(setDataFromPersonInDatabase(flattedData)))
      }
      return (dispatch(setSelectedMember(personData)))
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
