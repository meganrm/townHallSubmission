import {
  filter,
  map,
} from 'lodash';

import {
  firebasedb,
} from '../../scripts/util/setupFirebase';
import {
  STATE_LEG_DATA_ENDPOINT, MOC_DATA_ENDPOINT,
} from '../../constants';

const setUser = payload => ({
  payload,
  type: 'SET_USER',
});

const setMOCs = payload => ({
  payload,
  type: 'SET_MOCS',
});

export const incrementUserEventCount = () => ({
  type: 'INCREMENT_USER_EVENT_COUNT',
});

export const setInitialCount = count => ({
  payload: count,
  type: 'SET_INITIAL_EVENT_COUNT',
});

export const writeUserData = payload => (dispatch) => {
  firebasedb.ref(`users/${payload.uid}`).update({
    email: payload.email,
    username: payload.displayName,
  })
    .then(dispatch(setUser(payload)));
};

// TODO: FIX - if no mocs
export const startSetUserMocs = payload => (dispatch) => {
  firebasedb.ref(`users/${payload.uid}/mocs`).once('value').then((snapshot) => {
    if (!snapshot.exists()) {
      console.log('no mocs for this user');
      dispatch(setMOCs([]));
      return;
    }
    const govtrackIds = map(filter(snapshot.val(), 'govtrack_id'), 'govtrack_id');
    const thpIds = map(filter(snapshot.val(), 'thp_id'), 'thp_id');
    const federalLookups = map(govtrackIds, id => firebasedb.ref(`${MOC_DATA_ENDPOINT}/${id}`).once('value'));
    const stateLooksUps = map(thpIds, id => firebasedb.ref(`${STATE_LEG_DATA_ENDPOINT}/${id}`).once('value'));

    Promise.all([...federalLookups, ...stateLooksUps]).then(returned => returned.reduce((acc, mocSnap) => {
      if (mocSnap.exists()) {
        const moc = mocSnap.val();
        if (!moc.displayName) {
          return acc;
        }
        const mocData = {
          ...moc,
          displayName: moc.displayName,
          id: moc.govtrack_id || moc.thp_id,
          path: moc.govtrack_id ? MOC_DATA_ENDPOINT : STATE_LEG_DATA_ENDPOINT,
          mocLinks: moc.helpful_links,
        };
        acc.push(mocData);
      }
      return acc;
    }, []))
      .then((userMocData) => {
        dispatch(setMOCs(userMocData));
      })
      .catch(err => console.log(err));
  });
};
