import { firebasedb } from '../../scripts/util/setupFirebase';
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

const addLink = (payload) => ({
  type: 'ADD_LINK',
  payload,
});

const editLink = (payload) => ({
  type: 'EDIT_LINK',
  payload
});

const deleteLink = (payload) => ({
  type: 'DELETE_LINK',
  payload
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

const setSelectedMember = payload => ({
  payload,
  type: 'SET_SELECTED_MEMBER',
});

export const setSelectedLink = (payload) => ({
  type: 'SET_SELECTED_LINK',
  payload
});

export const getSelectedMemberInfo = payload => (dispatch) => {
  firebasedb.ref(`mocData/${payload.govtrack_id}/helpful_links`).once('value').then((snapshot) => {
    let links = snapshot.val();
    for (let prop in links) {
      links[prop].id = prop;
    }
    payload.moc_links = links;
    dispatch(setSelectedMember(payload));
  });
}

export const addMemberLink = payload => (dispatch) => {
  if (payload.link_title === undefined || payload.link_url === undefined) {
    return;
  } else {
    let link = {
      link_title: payload.link_title,
      url: payload.link_url
    }
    return firebasedb.ref(`mocData/${payload.member_id}/helpful_links`).push(link).then((ref) => {
      let newLinkInfo = {
        id: ref.key,
        link
      }
      dispatch(addLink(newLinkInfo))
    })
  }
}

export const editMemberLink = payload => (dispatch) => {
  let link = {
    link_title: payload.linkInfo.link_title,
    url: payload.linkInfo.url
  }
  return firebasedb.ref(`mocData/${payload.moc_id}/helpful_links/${payload.link_id}`).update(link).then(() => {
    dispatch(editLink(payload));
  })
}

export const deleteMemberLink = payload => (dispatch) => {
  return firebasedb.ref(`mocData/${payload.moc_id}/helpful_links/${payload.link_id}`).remove().then(() => {
    dispatch(deleteLink(payload));
  })
}