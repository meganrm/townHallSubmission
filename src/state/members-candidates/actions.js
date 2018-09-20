import { firebasedb } from '../../scripts/util/setupFirebase';
import { setDataFromPersonInDatabase, setAdditionalMember } from '../townhall/actions';

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
  });

export const requestPersonDataById = (peopleDataUrl, id) => dispatch => firebasedb.ref(`${peopleDataUrl}/${id}`)
  .once('value')
  .then((result) => {
    const personData = result.val();
    return (dispatch(setDataFromPersonInDatabase(personData)));
  });

export const requestAdditionalPersonDataById = (peopleDataUrl, id) => dispatch => firebasedb.ref(`${peopleDataUrl}/${id}`)
  .once('value')
  .then((result) => {
    const personData = result.val();
    console.log('setting additional member')
    return (dispatch(setAdditionalMember(personData)));
  });